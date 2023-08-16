const { authenticate } = require('@feathersjs/authentication').hooks;

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
					const Users = app.service('users').Model;
					const Notifications = await app.service('notifications').Model;
					const notification = await Notifications.findByPk(result.id);
					const users = await Users.findAll({ attributes: ['id'] });
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
