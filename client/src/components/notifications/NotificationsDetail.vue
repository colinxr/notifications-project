<script>
  import MarkdownIt from "markdown-it"
  import { useDate } from "../../composables/useDateComposable"
  const { getReadableDate } = useDate()

  const md = new MarkdownIt()

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

    computed: {
      bodyText() {
        return md.render(this.notification["notification.body"])
      },
    },
  }
</script>

<template>
  <div class="notification-detail">
    <header>
      <span>{{ date }}</span>
      <h5>{{ notification["notification.title"] }}</h5>
    </header>

    <div v-html="bodyText"></div>
  </div>
</template>

<style lang="scss">
  .notification-detail {
    padding: 16px 40px;
    color: var(--main-body-color);

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
        color: var(--primary);
      }
    }
  }
</style>
