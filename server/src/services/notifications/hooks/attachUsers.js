// const notificationQueue = require('../../../queues/notificationsQueue');

module.exports = () => {
	return async (context) => {
		const { app, result, params } = context;

		try {
			// const { app, result: notification } = context;
			// const userService = app.service('users');
			// notificationQueue.add('attachNotifications', { notification: result, userService });

			const Users = app.service('users').Model;
			const Notifications = app.service('notifications').Model;

			const query = {
				attributes: ['id']
			};

			if (params.userIds)
				query.where = {
					id: params.userIds
				};

			const users = await Users.findAll(query);

			const notification = await Notifications.findByPk(result.id);

			await notification.addUsers(users);
		} catch (error) {
			console.error('Error associating users:', error);
		}

		return context;
	};
};
