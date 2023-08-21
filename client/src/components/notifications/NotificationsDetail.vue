<script>
  import { useDate } from "../../composables/useDateComposable"
  const { getReadableDate } = useDate()

  export default {
    name: "NotificationsDetail",
    props: {
      notification: {
        type: Object,
      },
    },

    mixins: [useDate],

    created() {
      this.date = getReadableDate(this.notification["notification.publishedAt"])

      console.log(this.date)
    },
  }
</script>

<template>
  <div class="notification-detail">
    <header>
      <span>{{ date }}</span>
      <h5>{{ notification["notification.title"] }}</h5>
    </header>

    {{ notification["notification.body"] }}
  </div>
</template>

<style lang="scss">
  .notification-detail {
    padding: 16px 40px;

    header {
      span {
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        display: inline-block;
      }

      h5 {
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 16px;
      }
    }
  }
</style>
