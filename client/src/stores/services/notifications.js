export default {
  servicePath: "notifications",
  modelName: "Notifications",
  /* eslint-disable-next-line */
  setupInstance(data, { models }) {
    return data
  },
  state: {
    all: [],
    openNotifications: [],
  },
  getters: {
    unread: state => state.all.filter(({ readAt }) => readAt === null),
  },
  actions: {
    async fetchForUser(userId) {
      const { data } = await this.find({ query: { userId } })

      this.all = data
      this.openNotifications = this.unread
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
