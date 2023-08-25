import { cloneDeep, debounce, isEqual } from "lodash"

import feathers from "@feathersjs/feathers"
import socketio from "@feathersjs/socketio-client"
import auth from "@feathersjs/authentication-client"
import io from "socket.io-client"
// import { iff, discard } from 'feathers-hooks-common';
import { createPinia, defineStore, storeToRefs, mapActions } from "pinia"
import { setupFeathersPinia, defineAuthStore } from "feathers-pinia"

const DEFAULT_OPTIONS = {
  apis: [
    // {
    // 	name: 'api',
    // 	url: 'http://localhost:3030',
    // 	idField: 'id',
    // 	whitelist: ['$regex', '$options'],
    // 	services: [
    // 		{
    // 			servicePath: 'users',
    // 			modelName: 'User',
    // 			setupInstance: (data, { model }) => {},
    // 			hooks: {}
    // 		}
    // 	],
    // 	authenticationService: 'users'
    // }
  ],
}

const stores = {}
const models = {}

const FeathersAPI = {
  install(app, userOptions = {}) {
    let options = { ...DEFAULT_OPTIONS, ...userOptions }

    const pinia = createPinia()
    app.use(pinia)

    const createModel = (
      BaseModel,
      serviceModelName,
      // eslint-disable-next-line no-unused-vars
      modalSetupInstance = (data, { models }) => {}
    ) => {
      let Model = class extends BaseModel {
        // static name = `${serviceModelName}`;
        constructor(data, options) {
          super(data, options)
          this.init()
        }
        static setupInstance(data) {
          modalSetupInstance(data, { models })
        }
      }
      Object.defineProperty(Model, "name", { value: serviceModelName })
      return Model
    }

    for (let i = 0; i < options.apis.length; i++) {
      const api = options.apis[i]
      const feathersClient = feathers()
        .configure(
          socketio(io(api.url, { transports: ["websocket"] }), {
            timeout: 10000,
          })
        )
        .configure(auth({ storage: window.localStorage }))

      const { defineStore: defineFeathersStore, BaseModel } =
        setupFeathersPinia({
          clients: { [api.name]: feathersClient },
          idField: api.idField,
        })
      models[api.name] = {}

      for (let j = 0; j < api.services.length; j++) {
        const service = api.services[j]
        const { servicePath, modelName, setupInstance, hooks } = service

        if (modelName === false) {
          stores[servicePath] = defineStore(servicePath, {
            actions: {
              find(params) {
                return feathersClient.service(servicePath).find(params)
              },
              get(id, params) {
                return feathersClient.service(servicePath).get(id, params)
              },
              create(data, params) {
                return feathersClient.service(servicePath).create(data, params)
              },
              patch(id, data, params) {
                return feathersClient
                  .service(servicePath)
                  .patch(id, data, params)
              },
              remove(id, params) {
                return feathersClient.service(servicePath).remove(id, params)
              },
              ...(service.actions || {}),
            },
          })
        } else {
          stores[servicePath] = defineFeathersStore({
            servicePath,
            clientAlias: api.name,
            id: servicePath,
            Model: createModel(BaseModel, modelName, setupInstance),
            whitelist: service.whitelist || api.whitelist,
            state: () => ({
              ...(service.state || {}),
            }),
            getters: { ...(service.getters || {}) },
            actions: {
              findAll(params = {}, afterEach = () => {}, vm = {}) {
                return this.find(params)
                  .then(async results => {
                    afterEach(vm, results)
                    if (results.total > results.limit + results.skip) {
                      const query = params.query || {}
                      return this.findAll(
                        {
                          ...params,
                          query: {
                            ...query,
                            $skip: results.limit + results.skip,
                          },
                        },
                        afterEach,
                        vm
                      )
                    }
                    return results
                  })
                  .catch(error => {
                    console.log(error)
                  })
              },
              ...(service.actions || {}),
            },
          })
          Object.defineProperty(models[api.name], modelName, {
            get() {
              return stores[servicePath]().Model
            },
          })
        }
        feathersClient.service(servicePath).hooks(hooks)
        for (const key in service.customEvents) {
          if (Object.hasOwnProperty.call(service.customEvents, key)) {
            const handler = service.customEvents[key]
            feathersClient.service(service.servicePath).on(key, item => {
              handler(item, app)
            })
          }
        }
      }
      if (api.auth) {
        const storeId = api.auth.namespace || "auth"
        const usersService = api.auth.userService
        const additionalParams = api.auth.additionalParams

        const userState = usersService ? { userId: null } : {}
        const userGetters = usersService
          ? {
              user() {
                const user = this.userId
                  ? getServiceStore(usersService).getFromStore(this.userId)
                  : null
                return user
              },
            }
          : {}
        const userActions = usersService
          ? {
              async authenticate(authData) {
                try {
                  if (typeof authData == "undefined")
                    authData = {
                      strategy: "jwt",
                      accessToken:
                        this.feathersClient.settings.storage.storage[
                          "feathers-jwt"
                        ] || this.accessToken,
                    }
                  const response = await feathersClient.authenticate(
                    authData,
                    additionalParams
                  )
                  const { accessToken, authentication, user } = response
                  getServiceStore(usersService).addToStore(user)
                  Object.assign(this, {
                    accessToken,
                    authentication,
                    userId: user.id || user._id,
                    isAuthenticated: true,
                  })
                  return this.handleResponse(response) || response
                } catch (error) {
                  console.log(error)
                  this.error = error
                  return this.handleError(error)
                }
              },
            }
          : {}

        stores[storeId] = defineAuthStore({
          feathersClient,
          id: storeId,
          state: () => ({
            ...(api.auth.state || {}),
            ...userState,
          }),
          getters: {
            ...(api.auth.getters || {}),
            ...userGetters,
          },
          actions: {
            ...(api.auth.actions || {}),
            ...userActions,
            logout() {
              return feathersClient.logout()
            },
          },
        })
      }
    }
  },
}

const getServiceStore = service => {
  if (typeof stores[service] == "undefined")
    throw new Error("Invalid Service Name: " + service)
  return stores[service]()
}
const mapServiceState = (service, states = []) => {
  const store = getServiceStore(service)
  const storeRefs = storeToRefs(store)
  return Array.isArray(states)
    ? states.reduce((reduced, key) => {
        reduced[key] = function () {
          return storeRefs[key].value
        }
        return reduced
      }, {})
    : Object.keys(states).reduce((reduced, key) => {
        reduced[key] = () => {
          const storeKey = states[key]
          return storeRefs[storeKey].value
        }
        return reduced
      }, {})
}

const mapServiceActions = (service, actions = []) => {
  return mapActions(stores[service], actions)
}

const serviceFindMixin = options => {
  console.log(stores)
  const service = options.service
  const name = options.name
  const nameToUse = name
    ? name
    : typeof service == "string"
    ? service.replace(/-./g, x => x[1].toUpperCase())
    : "items"
  if (typeof service !== "function" && typeof stores[service] == "undefined")
    throw new Error("Invalid Service Name: " + service)
  const params = options.params
  const fetchParams = options.fetchParams
  const fetchAll = options.fetchAll
  const afterEach = options.afterEachFetch
  const afterFetch = options.afterFetch
  const debounceTime = options.debounce || 500
  const capitalizedName = nameToUse.charAt(0).toUpperCase() + nameToUse.slice(1)
  const ITEMS = nameToUse
  const FETCH = "fetch" + capitalizedName
  const DO_FETCH = "_doFetch" + capitalizedName
  const DO_DEBOUNCED_FETCH = "_doDebouncedFetch" + capitalizedName
  const IS_FIND_PENDING = "isFind" + capitalizedName + "Pending"
  const PARAMS = nameToUse + "Params"
  const FETCH_PARAMS = nameToUse + "FetchParams"
  const LATEST_QUERY = nameToUse + "LatestQuery"
  const PAGINATION_DATA = nameToUse + "PaginationData"
  const ERROR = nameToUse + "Error"

  return {
    data() {
      return {
        [IS_FIND_PENDING]: false,
        [LATEST_QUERY]: null,
        [ERROR]: null,
      }
    },
    computed: {
      [PARAMS]() {
        return typeof params == "function" ? params(this) : null
      },
      [FETCH_PARAMS]() {
        return typeof fetchParams == "function"
          ? fetchParams(this)
          : this[PARAMS]
      },
      [ITEMS]() {
        let localParams = cloneDeep(this[PARAMS])
        return stores[
          typeof service == "function" ? service(this) : service
        ]().findInStore(localParams).data
      },
      [PAGINATION_DATA]() {
        return (
          stores[typeof service == "function" ? service(this) : service]()
            .pagination.default || {}
        )
      },
    },
    methods: {
      [FETCH]() {
        this[IS_FIND_PENDING] = true
        this[DO_DEBOUNCED_FETCH]()
      },
      [DO_FETCH]() {
        const params = this[FETCH_PARAMS]
        if (params) {
          const findMethod = fetchAll ? "findAll" : "find"
          const args = fetchAll ? [params, afterEach, this] : [params]
          stores[typeof service == "function" ? service(this) : service]()
            [findMethod].apply(this, args)
            .then(result => {
              this[IS_FIND_PENDING] = false
              this[LATEST_QUERY] = {
                params,
                response: result,
              }
              this[ERROR] = null
              if (typeof afterFetch == "function")
                return afterFetch(this, result)
            })
            .catch(err => {
              this[IS_FIND_PENDING] = false
              this[ERROR] = err.message
            })
        }
      },
    },
    created() {
      this[DO_DEBOUNCED_FETCH] = debounce(this[DO_FETCH], debounceTime)

      this[FETCH]()
    },
    watch: {
      [FETCH_PARAMS](val, oldVal) {
        if (!isEqual(val, oldVal)) this[FETCH]()
      },
    },
  }
}
const serviceGetMixin = options => {
  const service = options.service
  const name = options.name
  if (typeof service !== "function" && typeof stores[service] == "undefined")
    throw new Error("Invalid Service Name: " + service)
  const id = options.id
  const params = options.params
  const fetchParams = options.fetchParams
  const afterFetch = options.afterFetch
  const debounceTime = options.debounce || 500
  const serviceStore =
    stores[typeof service == "function" ? service(this) : service]()
  const nameToUse = name
    ? name
    : typeof service == "string"
    ? serviceStore.Model.name.charAt(0).toLowerCase() +
      serviceStore.Model.name.slice(1)
    : "item"
  const capitalizedName = nameToUse.charAt(0).toUpperCase() + nameToUse.slice(1)
  const FETCH = "fetch" + capitalizedName
  const DO_FETCH = "_doFetch" + capitalizedName
  const DO_DEBOUNCED_FETCH = "_doDebouncedFetch" + capitalizedName
  const ITEM = nameToUse
  const ID = "serviceItemId"
  const PARAMS = nameToUse + "Params"
  const FETCH_PARAMS = nameToUse + "FetchParams"
  const IS_GET_PENDING = "isGet" + capitalizedName + "Pending"
  const ERROR = nameToUse + "Error"

  return {
    data() {
      return {
        [IS_GET_PENDING]: false,
      }
    },
    computed: {
      [ID]() {
        return typeof id == "function"
          ? id(this)
          : typeof id == "string"
          ? this[id]
          : id
      },
      [PARAMS]() {
        return typeof params == "function" ? params(this) : null
      },
      [FETCH_PARAMS]() {
        return typeof fetchParams == "function"
          ? fetchParams(this)
          : this[PARAMS]
      },
      [ITEM]() {
        return this[ID] ? stores[service]().getFromStore(this[ID]) : {}
      },
    },
    methods: {
      [FETCH]() {
        this[IS_GET_PENDING] = true
        this[DO_DEBOUNCED_FETCH]()
      },
      [DO_FETCH]() {
        const params = this[FETCH_PARAMS]
        stores[service]()
          .get(this[ID], params)
          .then(result => {
            this[IS_GET_PENDING] = false
            if (typeof afterFetch == "function") return afterFetch(this, result)
          })
          .catch(err => {
            this[IS_GET_PENDING] = false
            this[ERROR] = err.message
          })
      },
    },
    created() {
      this[DO_DEBOUNCED_FETCH] = debounce(this[DO_FETCH], debounceTime)

      this[FETCH]()
    },
    watch: {
      [ID](val, oldVal) {
        if (val !== oldVal) this[FETCH]()
      },
      [FETCH_PARAMS](val, oldVal) {
        if (!isEqual(val, oldVal)) this[FETCH]()
      },
    },
  }
}

export {
  FeathersAPI as default,
  getServiceStore,
  mapServiceState,
  mapServiceActions,
  serviceFindMixin,
  serviceGetMixin,
}
