<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import HeaderNav from "./nav/HeaderNav.vue"
  import NotificationsPane from "./notifications/NotificationsPane.vue"
  export default {
    name: "AppHeader",
    components: {
      HeaderNav,
      NotificationsPane,
    },

    computed: {
      showPane() {
        return getServiceStore("notifications").showPane
      },
    },
  }
</script>

<template>
  <header class="app-header">
    <h1>Tactus VRC Notifcations</h1>

    <HeaderNav />

    <NotificationsPane
      v-if="showPane"
      class="notifications__pane"
      @closePane="handleClose"
    />
  </header>
</template>

<style lang="scss">
  .app-header {
    height: 85px;
    background-color: var(--secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    color: var(--neutral-white);
    position: relative;

    ul {
      list-style-type: none;
      display: flex;
      gap: 20px;
      align-items: center;
    }
  }

  .sr-only {
    display: none;
  }
</style>
