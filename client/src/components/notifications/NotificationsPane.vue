<script>
  import NotificationsCard from "./NotificationsCard.vue"

  export default {
    name: "NotificationsPane",

    components: {
      NotificationsCard,
    },

    props: {
      isOpen: Boolean,
      notifications: Array,
    },

    methods: {
      toggleNotificationsPane() {
        this.paneIsOpen = !this.paneIsOpen
      },

      emitClose() {
        this.emit("closePane")
      },
    },
  }
</script>

<template>
  <div class="notifications__pane">
    <template v-if="notifications.length">
      <NotificationsCard
        v-for="(notification, i) in notifications"
        :key="i"
        :notification="notification"
      />
    </template>
    <template v-else>
      <div class="empty-container">
        <span>Shoot!</span>
        <span> No Notifications Yet! </span>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  .notifications__pane {
    background-color: rgb(17, 24, 39);
    border-radius: 5px;
    padding: 15px;
    width: 300px;
    height: 400px;
    right: -50px;

    &:before {
      content: "";
      top: -16px;
      right: 57px;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent rgb(17, 24, 39) transparent;
      position: absolute;
    }
  }

  .empty-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #f0f0f0;
  }
</style>
