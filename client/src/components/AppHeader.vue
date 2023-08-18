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
  <header>
    <h1>Tactus VRC Notifcations</h1>

    <HeaderNav />
  </header>
</template>

<style lang="scss">
  header {
    height: 85px;
    background-color: rgb(17, 24, 39);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    color: white;

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
