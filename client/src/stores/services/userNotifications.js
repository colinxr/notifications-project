import { getServiceStore } from "../../plugins/FeathersAPI"
export default {
  servicePath: "user/notifications",
  modelName: "UserNotification",
  /* eslint-disable-next-line */
  setupInstance(data, { models }) {
    return data
  },
  actions: {
    async markAllAsRead(idsToUpdate) {
      const data = await this.patch(
        null,
        { readAt: new Date() },
        {
          query: { id: { $in: idsToUpdate } },
        }
      )

      const ids = data.map(el => el.id)

      await getServiceStore("notifications").updateAsRead(ids)

      return data
    },

    async markAsRead(id) {
      const data = await this.patch(id, { readAt: new Date() })

      await getServiceStore("notifications").updateAsRead([id])

      return data
    },
  },
}
