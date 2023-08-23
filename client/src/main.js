import "./assets/main.css"

import { createApp } from "vue"

import FeathersAPI from "@/plugins/FeathersAPI"
import { getServiceStore } from "@/plugins/FeathersAPI"

import services from "./stores/services"
import router from "./router"

import { VueHeadMixin, createHead } from "@vueuse/head"

import App from "./App.vue"
const app = createApp(App)
const head = createHead()

app.mixin(VueHeadMixin)
app.use(head)

app.use(FeathersAPI, {
  apis: [
    {
      name: "api",
      url: "http://localhost:3030",
      idField: "id",
      whitelist: ["$regex", "$options"],
      services: services,
      auth: {
        userService: "users",
      },
    },
  ],
})

app.provide("head", {
  title: "Tactus Notifications Project",
  htmlAttrs: {
    lang: "en",
    amp: true,
  },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;1,400;1,600&display=swap",
    },
  ],
})

const auth = getServiceStore("auth")
Promise.all([auth.authenticate()])
  .catch(() => {})
  // Render the app
  .then(() => {
    app.use(router)

    console.log(router)

    app.mount("#app")
  })
