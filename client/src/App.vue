<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import AppHeader from "./components/AppHeader.vue"

  export default {
    name: "App",
    components: {
      AppHeader,
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
</template>

<style lang="scss"></style>
