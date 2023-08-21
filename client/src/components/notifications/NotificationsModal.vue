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
      showModal: Boolean,
      notifications: {
        type: Array,
        required: true,
      },
    },
  }
</script>

<template>
  <ModalContainer :showModal="modalIsOpen" @handleClose="modalIsOpen = false">
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
