export default {
  servicePath: "user/notifications",
  modelName: "UserNotification",
  /* eslint-disable-next-line */
  setupInstance(data, { models }) {
    return data
  },
  state: {
    all: [],
  },
  getters: {
    unread: state => state.all.filter(({ readAt }) => readAt === null),
  },
  actions: {
    async fetchForUser(userId) {
      const { data } = await this.find({ query: { userId } })

      this.all = data
    },

    async markAsRead(idsToUpdate) {
      const { data } = this.patch(
        null,
        { readAt: new Date() },
        {
          query: { id: { $in: idsToUpdate } },
        }
      )

      return data
    },
  },
}
