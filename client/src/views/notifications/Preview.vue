<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import ModalContainer from "../../components/modal/ModalContainer.vue"
  import NotificationsDetail from "../../components/notifications/NotificationsDetail.vue"

  export default {
    name: "NotificationsPreview",

    components: {
      ModalContainer,
      NotificationsDetail,
    },

    data() {
      return {
        notification: {},
      }
    },

    async created() {
      this.notification = await getServiceStore("notifications").get(
        this.$route.params.id
      )
    },
  }
</script>

<template>
  <ModalContainer>
    <template v-slot:header>
      <h1>News</h1>
    </template>

    <template v-slot:content>
      <NotificationsDetail v-if="notification" :notification="notification" />
    </template>
  </ModalContainer>
</template>

<style lang="scss">
  .preview-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
