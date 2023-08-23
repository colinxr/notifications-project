// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const { DataTypes } = require('sequelize');

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const userNotifications = sequelizeClient.define('user_notifications', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		readAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	});

	// userNotifications.associate = function ({ notifications }) {
	// 	userNotifications.belongsTo(notifications, {
	// 		as: 'notification'
	// 	});
	// };

	return userNotifications;
};
