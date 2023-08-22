<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import ModalContainer from "../modal/ModalContainer.vue"
  import NotificationsDetail from "./NotificationsDetail.vue"
  import { log } from "console"

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
        this.emit("handleClose")
      },

      async markNotificationsAsRead() {
        try {
          const ids = this.notifications.map(({ id }) => id)
          const resp = await getServiceStore("user/notifications").read(id)
        } catch (error) {
          console.log(error)
        }
      },
    },

    mounted() {
      markNotificationsAsRead()
    },
  }
</script>

<template>
  <ModalContainer @handleClose="$emit('handleClose')">
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
