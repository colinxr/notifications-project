const { authenticate } = require('@feathersjs/authentication').hooks;

// const notificationQueue = require('../../queues/notificationsQueue');

module.exports = {
	before: {
		all: [authenticate('jwt')],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [
			async (context) => {
				const { app, result } = context;
				try {
					// const { app, result: notification } = context;
					// const userService = app.service('users');
					// notificationQueue.add('attachNotifications', { notification: result, userService });

					console.log(result);
					const Users = app.service('users').Model;
					const Notifications = app.service('notifications').Model;

					const users = await Users.findAll({ attributes: ['id'] });
					const notification = await Notifications.findByPk(result.id);

					await notification.addUsers(users);
				} catch (error) {
					console.error('Error associating users:', error);
				}
				return context;
			}
		],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
