// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const notifications = sequelizeClient.define(
		'notifications',
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Notification title is required.' // Custom error message for notNull validation
					}
				}
			},
			body: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Notification body content is required.' // Custom error message for notNull validation
					}
				}
			},
			cta: {
				type: DataTypes.TEXT,
				allowNull: true
			},
			ctaUrl: {
				type: DataTypes.TEXT,
				allowNull: true
			},
			publishedAt: {
				type: DataTypes.DATE,
				allowNull: true
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
	notifications.associate = function ({ users }) {
		notifications.belongsToMany(users, {
			through: 'user_notifications',
			foreignKey: 'notificationId',
			otherKey: 'userId'
		});
	};

	return notifications;
};
