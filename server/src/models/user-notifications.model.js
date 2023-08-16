// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const { DataTypes } = require('sequelize');

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const userNotifications = sequelizeClient.define('user_notifications', {
		readAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	});

	return userNotifications;
};
