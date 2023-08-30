<script>
  import MarkdownIt from "markdown-it"
  import AppButton from "../AppButton.vue"

  import { useDate } from "../../composables/useDateComposable"

  const md = new MarkdownIt()
  const { getReadableDate } = useDate()

  export default {
    name: "NotificationsDetail",

    components: {
      AppButton,
    },

    props: {
      notification: {
        type: Object,
      },
    },

    mixins: [useDate],

    created() {
      this.date = getReadableDate(this.notification.publishedAt)
    },

    computed: {
      bodyText() {
        return md.render(this.notification.body)
      },
    },
  }
</script>

<template>
  <div class="notification-detail">
    <header>
      <span>{{ date }}</span>
      <h5>{{ notification.title }}</h5>
    </header>

    <div v-html="bodyText"></div>

    <AppButton>
      <a :href="`//${notification.ctaUrl}`">
        {{ notification.cta }}
      </a>
    </AppButton>
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
        text-transform: capitalize;
      }
    }
  }
</style>
