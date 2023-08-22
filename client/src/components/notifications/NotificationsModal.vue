<script>
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
        console.log("insideNotifications Modal")
        this.emit("handleClose")
      },
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
