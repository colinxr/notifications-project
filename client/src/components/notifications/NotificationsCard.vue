<script>
  import { getServiceStore } from "@/plugins/FeathersAPI"
  import { useDate } from "../../composables/useDateComposable"

  import EventIcon from "../icons/EventIcon.vue"
  import NewsIcon from "../icons/NewsIcon.vue"

  const { getReadableDate } = useDate()

  export default {
    name: "NotificationsCard",

    components: {
      EventIcon,
      NewsIcon,
      EventIcon,
    },

    props: {
      notification: Object,
    },

    mixins: [useDate],

    created() {
      this.date = getReadableDate(this.notification.publishedAt)
    },

    methods: {
      async handleOpen() {
        this.$emit("closePane")

        if (this.notification.type !== "event") {
          return getServiceStore("notifications").filterForModal(
            this.notification.id
          )
        }

        console.log(this.notification)

        const data = await getServiceStore("user/notifications").markAsRead([
          this.notification.user_notificationId,
        ])

        this.$router.push(this.notification.ctaUrl)
      },
    },
  }
</script>

<template>
  <div class="notifications__card" @click="handleOpen">
    <div class="notifications__card__icon">
      <NewsIcon v-if="notification.type !== 'event'" />
      <EventIcon v-else />
    </div>

    <div class="notifications__card__body">
      <span>{{ date }}</span>

      <h4>{{ notification.title }}</h4>
    </div>

    <div class="notifications__alert" v-if="!notification.readAt"></div>
  </div>
</template>

<style lang="scss">
  .notifications__card {
    position: relative;
    padding: 10px 5px;
    border-bottom: 1px solid grey;
    color: white;
    display: flex;
    gap: 10px;
    cursor: pointer;

    &__body {
      display: flex;
      flex-direction: column;

      span {
        font-size: 0.75rem;
      }

      h4 {
        line-height: 1.4;
      }
    }

    &__icon {
      fill: white;
      align-self: start;
    }

    .notifications__alert {
      top: 10px;
      right: 10px;
    }
  }
</style>
