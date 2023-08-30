<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import AppButton from "../AppButton.vue"
  import NotificationsCard from "./NotificationsCard.vue"

  export default {
    name: "NotificationsPane",

    components: {
      NotificationsCard,
      AppButton,
    },

    computed: {
      notifications() {
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

      async markAllAsRead() {
        const idsToUpdate = this.notifications
          .filter(({ readAt }) => readAt === null)
          .map(({ user_notificationId }) => user_notificationId)

        await getServiceStore("user/notifications").markAllAsRead(idsToUpdate)
      },
    },
  }
</script>

<template>
  <div class="notifications-pane">
    <div class="notifications-pane__content">
      <template v-if="notifications.length">
        <NotificationsCard
          v-for="(notification, i) in notifications"
          :key="i"
          :notification="notification"
          @closePane="toggleNotificationsPane"
        />
      </template>

      <template v-else>
        <div class="empty-container">
          <span>Shoot!</span>
          <span> No Notifications Yet! </span>
        </div>
      </template>
    </div>

    <footer v-if="hasUnread">
      <AppButton @click="markAllAsRead">
        <span>Mark all as read</span>
      </AppButton>
    </footer>
  </div>
</template>

<style lang="scss">
  .notifications-pane {
    background-color: rgb(17, 24, 39);
    border-radius: 5px;
    width: 300px;
    right: 125px;
    position: relative;
    position: absolute;
    margin-top: 5px;
    top: 110%;

    &:before {
      content: "";
      top: -16px;
      right: 57px;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent rgb(17, 24, 39) transparent;
      position: absolute;
    }

    &__content {
      padding: 15px;
      height: 250px;
      overflow-y: scroll;
    }

    footer {
      position: absolute;
      background-color: rgb(17, 24, 39);
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      margin: 10px auto 0;
      border-radius: 5px;

      span {
        font-size: 0.75rem;
      }
    }
  }

  .empty-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #f0f0f0;
  }
</style>
