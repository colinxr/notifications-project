export default {
  servicePath: "notifications",
  modelName: "Notifications",
  /* eslint-disable-next-line */
  setupInstance(data, { models }) {
    return data
  },
  state: {
    all: [],
  },

  getters: {
    unread(state) {
      return state.all.filter(({ readAt }) => readAt === null)
    },

    forModal() {
      return this.unread.filter(({ type }) => type !== "event")
    },

    showModal() {
      return this.forModal.length
    },
  },

  actions: {
    async fetchForUser(userId) {
      const { data } = await this.find({ query: { userId } })

      this.all = data
    },

    updateAsRead(idsToUpdate) {
      const updatedNotifications = this.all.map(el => {
        if (!idsToUpdate.includes(el.user_notificationId)) return el

        el.readAt = true
        return el
      })

      this.all = updatedNotifications
    },
  },
}
