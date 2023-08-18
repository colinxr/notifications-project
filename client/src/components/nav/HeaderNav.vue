<script>
  import AppButton from "../AppButton.vue"
  import NotificationsMenuItem from "../notifications/NotificationsMenuItem.vue"

  export default {
    name: "HeaderNav",
    components: {
      AppButton,
      NotificationsMenuItem,
    },
  }
</script>

<template>
  <nav class="menu">
    <ul>
      <li>
        <NotificationsMenuItem />
      </li>
      <li>
        <AppButton
          data-dropdown-toggle="notification-dropdown"
          class="menu__button"
          sr_text="Change User"
        >
          Change User
        </AppButton>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss"></style>
