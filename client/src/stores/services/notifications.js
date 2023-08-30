export default {
  servicePath: "notifications",
  modelName: "Notifications",
  /* eslint-disable-next-line */
  setupInstance(data, { models }) {
    return data
  },
  state: {
    all: [],
    forModal: [],
    showPane: false,
  },

  getters: {
    unread(state) {
      return state.all.filter(({ readAt }) => readAt === null)
    },

    showModal() {
      return this.forModal.length
    },
  },

  actions: {
    togglePane() {
      this.showPane = !this.showPane
    },

    async fetchForUser(userId) {
      const { data } = await this.find({
        query: {
          userId: userId,
          $sort: {
            publishedAt: -1,
          },
        },
      })

      this.all = data

      this.filterForModal()
    },

    updateAsRead(idsToUpdate) {
      const updatedNotifications = this.all.map(el => {
        if (!idsToUpdate.includes(el.user_notificationId)) return el

        el.readAt = true
        return el
      })

      this.all = updatedNotifications
    },

    filterForModal(idToShow = null) {
      if (!idToShow) {
        this.forModal = this.unread.filter(({ type }) => type !== "event")
        return
      }

      this.forModal = this.all.filter(({ id }) => idToShow == id)
      return
    },
  },
}
