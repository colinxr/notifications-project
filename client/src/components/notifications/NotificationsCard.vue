<script>
  export default {
    name: "NotificationsCard",

    props: {
      notification: Object,
    },

    computed: {
      date() {
        const dateString = new Date(this.notification.createdAt)
        // Define month names
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

        // Get the full month name
        const fullMonth = monthNames[dateString.getMonth()]

        // Get day and year
        const day = dateString.getDate()
        const year = dateString.getFullYear()

        return `${fullMonth} ${day}, ${year}`
      },
    },

    methods: {
      handleOpen() {
        alert(this.notification["notification.title"])
      },
    },
  }
</script>

<template>
  <div class="notifications__card" @click="handleOpen">
    <div class="notifications__card__icon"></div>

    <div class="notifications__card__body">
      <span>{{ date }}</span>

      <h3>{{ notification["notification.title"] }}</h3>
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
