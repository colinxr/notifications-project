const { Service } = require('feathers-sequelize');
const { NotFound } = require('@feathersjs/errors');

exports.UserNotifications = class UserNotifications extends Service {
	async read(id) {
		const notification = await this.get(id);

		if (!notification) {
			throw new NotFound('Notification not found');
		}

		await this.patch(id, { readAt: new Date() });

		return null;
	}
};
