const users = require('./users/users.service.js');
const notifications = require('./notifications/notifications.service.js');
const userNotifications = require('./user-notifications/user-notifications.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
	app.configure(users);
	app.configure(notifications);
	app.configure(userNotifications);

	const sequelize = app.get('sequelizeClient');

	Object.keys(sequelize.models).forEach(function (modelName) {
		if ('associate' in sequelize.models[modelName]) {
			sequelize.models[modelName].associate(sequelize.models);
		}
	});

	sequelize.sync({ force: false });
};
