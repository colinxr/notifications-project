// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const users = sequelizeClient.define(
		'users',
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			hooks: {
				beforeCount(options) {
					options.raw = true;
				}
			}
		}
	);

	// eslint-disable-next-line no-unused-vars
	users.associate = function ({ notifications, userNotifications }) {
		users.belongsToMany(notifications, {
			through: 'user_notifications',
			foreignKey: 'userId',
			otherKey: 'notificationId'
		});
	};

	return users;
};
