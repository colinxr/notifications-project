module.exports = () => {
	return async (context) => {
		const sanitizedData = context.result.data
			.map((el) => {
				if (!el['users.user_notifications.id']) return el;

				return {
					...el,
					user_notificationId: el['users.user_notifications.id'],
					readAt: el['users.user_notifications.readAt'],
					userId: el['users.user_notifications.userId']
				};
			})
			.sort((a, b) => {
				// sort unread Notifications first
				if (a.readAt === null && b.readAt !== null) return -1;

				if (a.readAt !== null && b.readAt === null) return 1;

				return new Date(a.publishedAt) - new Date(a.publishedAt);

				// if (new Date(a.publishedAt) < new Date(a.publishedAt)) return 1;
			});

		context.result.data = sanitizedData;

		return context;
	};
};
