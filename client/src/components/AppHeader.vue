<script>
  import HeaderNav from "./nav/HeaderNav.vue"
  export default {
    name: "AppHeader",
    components: {
      HeaderNav,
    },
  }
</script>

<template>
  <header class="app-header">
    <h1>Tactus VRC Notifcations</h1>

    <HeaderNav />
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
