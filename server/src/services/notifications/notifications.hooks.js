const { Op } = require('sequelize');
// const { authenticate } = require('@feathersjs/authentication').hooks;

const { BadRequest } = require('@feathersjs/errors');

// const notificationQueue = require('../../queues/notificationsQueue');

module.exports = {
	before: {
		all: [], //authenticate('jwt'),
		find: [
			async (context) => {
				const { params } = context;

				if (!params.query.preview) {
					context.params.sequelize = {
						where: {
							publishedAt: {
								[Op.not]: null
							}
						}
					};
				}

				// this uses a query param, but with authentication,
				// would find the authenticated users with their JWT AuthToken
				if (!params.query.userId) throw new BadRequest('No UserID Query Param provided');

				const { Model } = context.app.service('users');
				context.params.sequelize.include = [
					{
						model: Model,
						where: { id: params.query.userId },
						attributes: [],
						through: {
							attributes: ['readAt', 'userId', 'notificationId']
						},
						required: true
					}
				];

				console.log(params.query.userId);

				delete context.params.query;
				return context;
			}
		],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [
			async (context) => {
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
			}
		],
		get: [],
		create: [
			async (context) => {
				const { app, result } = context;
				try {
					// const { app, result: notification } = context;
					// const userService = app.service('users');
					// notificationQueue.add('attachNotifications', { notification: result, userService });
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
