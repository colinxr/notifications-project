export default {
	servicePath: 'user/notifications',
	modelName: 'UserNotification',
	setupInstance(data, { models }) {
		return data;
	},
	state: {
		all: []
	},
	getters: {
		unread: (state) => state.all.filter(({ readAt }) => readAt === null)
	},
	actions: {
		fetchForUser: async function (userId) {
			const { data } = await this.find({ query: { userId } });

			this.all = data;
		}
	}
};
