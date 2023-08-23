import { getServiceStore } from "../../plugins/FeathersAPI"
export default {
  servicePath: "user/notifications",
  modelName: "UserNotification",
  /* eslint-disable-next-line */
  setupInstance(data, { models }) {
    return data
  },
  actions: {
    async markAsRead(idsToUpdate) {
      const data = await this.patch(
        null,
        { readAt: new Date() },
        {
          query: { id: { $in: idsToUpdate } },
        }
      )

      await getServiceStore("notifications").updateAsRead(data)

      return data
    },
  },
}
