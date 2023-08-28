<script>
  import { getServiceStore, serviceGetMixin } from "@/plugins/FeathersAPI"

  import AppHeader from "./components/AppHeader.vue"
  import NotificationsModal from "./components/notifications/NotificationsModal.vue"

  export default {
    name: "App",
    components: {
      AppHeader,
      NotificationsModal,
    },

    data() {
      return {
        modalIsOpen: false,
      }
    },

    async created() {
      await this.fetchNotifications(this.$route.query.userId || 1)

      this.modalIsOpen = getServiceStore("notifications").showModal
    },

    computed: {
      modalNotifications() {
        return getServiceStore("notifications").forModal
      },
    },

    watch: {
      modalNotifications(newVal, old) {
        this.modalIsOpen = newVal.length ? true : false
      },

      async $route(to, from) {
        if (to.query.userId !== from.query.userId) {
          await this.fetchNotifications(to.query.userId)
        }
      },
    },

    methods: {
      async fetchNotifications(userId) {
        await getServiceStore("notifications").fetchForUser(userId)
      },
    },

    head() {
      return {
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
      }
    },
  }
</script>

<template>
  <AppHeader />

  <router-view />

  <NotificationsModal
    v-if="modalIsOpen"
    :notifications="modalNotifications"
    @handleClose="modalIsOpen = false"
  />
</template>

<style lang="scss">
  h1 {
    font-family: Poppins;
    font-size: 29px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
</style>
