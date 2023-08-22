// Initializes the `UserNotifications` service on path `/user/notifications`
const { UserNotifications } = require('./user-notifications.class');
const createModel = require('../../models/user-notifications.model');
const hooks = require('./user-notifications.hooks');

module.exports = function (app) {
	const options = {
		Model: createModel(app),
		paginate: app.get('paginate'),
		multi: ['patch']
	};

	// Initialize our service with any options it requires
	app.use('/user/notifications', new UserNotifications(options, app));

	// Get our initialized service so that we can register hooks
	const service = app.service('user/notifications');

	service.hooks(hooks);
};
