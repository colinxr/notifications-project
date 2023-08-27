<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"

  import { useDate } from "../../composables/useDateComposable"
  const { getReadableDate } = useDate()

  export default {
    name: "NotificationsCard",

    props: {
      notification: Object,
    },

    mixins: [useDate],

    created() {
      this.date = getReadableDate(this.notification.publishedAt)
    },

    methods: {
      handleOpen() {
        console.log(getServiceStore("notifications").openNotifications)

        getServiceStore("notifications").openNotifications = [this.notification]
      },
    },
  }
</script>

<template>
  <div class="notifications__card" @click="handleOpen">
    <div class="notifications__card__icon"></div>

    <div class="notifications__card__body">
      <span>{{ date }}</span>

      <h3>{{ notification.title }}</h3>
    </div>

    <div class="notifications__alert" v-if="!notification.readAt"></div>
  </div>
</template>

<style lang="scss">
  .notifications__card {
    position: relative;
    padding: 5px;
    border-bottom: 1px solid grey;
    color: white;
    display: flex;
    cursor: pointer;

    &__body {
      display: flex;
      flex-direction: column;

      span {
        margin-bottom: 5px;
      }

      h3 {
        font-size: 1.5rem;
      }
    }

    .notifications__alert {
      top: 0;
      right: 0;
    }
  }
</style>
