<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import AppButton from "../AppButton.vue"
  import NotificationsPane from "./NotificationsPane.vue"

  export default {
    name: "NotificationsMenuItem",

    components: {
      AppButton,
      NotificationsPane,
    },

    data() {
      return {
        paneIsOpen: false,
      }
    },

    computed: {
      allNotifications() {
        return getServiceStore("notifications").all
      },

      hasUnread() {
        return getServiceStore("notifications").unread.length
      },
    },

    methods: {
      toggleNotificationsPane() {
        getServiceStore("notifications").togglePane()
      },

      handleClose() {
        getServiceStore("notifications").showPane = false
      },
    },
  }
</script>

<template>
  <div class="notifications-trigger">
    <AppButton
      data-dropdown-toggle="notification-dropdown"
      sr_text="View Notifications"
      @click="toggleNotificationsPane"
    >
      <!-- Bell icon -->
      <svg
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
        ></path>
      </svg>
    </AppButton>

    <div class="notifications-trigger__alert" v-if="hasUnread"></div>
  </div>
</template>

<style lang="scss">
  .notifications-trigger {
    position: relative;

    &__alert {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 8px;
      height: 8px;
      background-color: red;
      border-radius: 4px;
    }
  }
</style>
