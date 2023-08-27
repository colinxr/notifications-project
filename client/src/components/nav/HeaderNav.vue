<script>
  import { getServiceStore } from "../../plugins/FeathersAPI"
  import AppButton from "../AppButton.vue"
  import UserSelect from "../UserSelect.vue"
  import NotificationsMenuItem from "../notifications/NotificationsMenuItem.vue"

  export default {
    name: "HeaderNav",
    components: {
      AppButton,
      NotificationsMenuItem,
      UserSelect,
    },

    data() {
      return {
        users: [],
      }
    },

    async created() {
      const { data } = await getServiceStore("users").find()

      this.users = data
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
        <UserSelect :options="users" />
      </li>
    </ul>
  </nav>
</template>

<style lang="scss"></style>
