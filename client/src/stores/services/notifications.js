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
      console.log(idsToUpdate)
      const updatedNotifications = this.all.map(el => {
        if (!idsToUpdate.includes(el.user_notificationId)) return el

        el.readAt = true
        return el
      })

      console.log(updatedNotifications)

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
