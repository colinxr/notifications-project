module.exports = () => {
	return async (context) => {
		const sanitizedData = context.result.data.map((el) => {
			if (!el['users.user_notifications.id']) return el;

			return {
				...el,
				user_notificationId: el['users.user_notifications.id'],
				readAt: el['users.user_notifications.readAt'],
				userId: el['users.user_notifications.userId']
			};
		});

		context.result.data = sanitizedData;

		return context;
	};
};
