<script>
  export default {
    name: "NotificationsPane",

    props: {
      isOpen: Boolean,
      notificiations: Array,
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
  <div class="notifications__list" v-on-click-outside="emitClose">
    <div class="notifications__card"></div>
  </div>
</template>

<style lang="scss"></style>
