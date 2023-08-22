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
      if (!this.$route.query.userId) {
        await this.$router.replace({
          query: { ...this.$route.query, userId: 1 },
        })
      }

      await getServiceStore("user/notifications").fetchForUser(
        this.$route.query.userId
      )
    },

    computed: {
      unreadNotifications() {
        return getServiceStore("user/notifications").unread
      },
    },

    watch: {
      unreadNotifications(newVal) {
        if (!newVal.length) this.modalIsOpen = false

        this.modalIsOpen = true
      },
    },

    methods: {
      handleClose() {
        console.log("wtf")
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

  // to do - front-end
  // components dir
  // header
  // 1. build nav bar
  // 2. on click open notification pane
  // 3. build card component

  // to do -- hook up
  // ✅ 1. set current user as userId query param in url
  // ✅ 2. onMounted fetch notifications for the current user
  // 3. Pass those notifications into the notifications pane
  // 4. Any unread notifications get send to modal
</script>

<template>
  <AppHeader />
  <router-view />

  <NotificationsModal
    :showModal="modalIsOpen"
    :notifications="unreadNotifications"
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
