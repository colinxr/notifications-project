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
      console.log(this.$route.params.id)
      this.notification = await getServiceStore("notifications").get(
        this.$route.params.id
      )

      console.log(this.notification)
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
      <div v-else>wtf</div>
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
