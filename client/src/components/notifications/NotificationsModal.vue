<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import ModalContainer from "../modal/ModalContainer.vue"
  import NotificationsDetail from "./NotificationsDetail.vue"

  export default {
    name: "NotificationsModal",

    components: {
      ModalContainer,
      NotificationsDetail,
    },

    props: {
      notifications: {
        type: Array,
        required: true,
      },
    },

    methods: {
      handleClose() {
        this.markAllAsRead()

        this.$emit("handleClose")
      },

      async markAllAsRead() {
        getServiceStore("user/notifications").openNotifications = []

        const idsToUpdate = this.notifications.map(
          ({ user_notificationId }) => user_notificationId
        )
        const data =
          await getServiceStore("user/notifications").markAllAsRead(idsToUpdate)
      },
    },
  }
</script>

<template>
  <ModalContainer @handleClose="handleClose">
    <template v-slot:header>
      <h1>News</h1>
    </template>

    <template v-slot:content>
      <NotificationsDetail
        v-for="(notification, i) in notifications"
        :notification="notification"
      />
    </template>
  </ModalContainer>
</template>
