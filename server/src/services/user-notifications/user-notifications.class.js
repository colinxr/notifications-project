const { Service } = require('feathers-sequelize');
const { Op } = require('sequelize');

const { NotFound, GeneralError } = require('@feathersjs/errors');

const checkForArray = (value) => {
	if (!Array.isArray(value)) return [value];
	return value;
};
exports.UserNotifications = class UserNotifications extends Service {
	async markAsRead(ids) {
		const idsToUpdate = checkForArray(ids);

		try {
			await this.Model.update(
				{ readAt: new Date() },
				{
					where: {
						id: { [Op.in]: idsToUpdate }
					}
				}
			);
			return null;
		} catch (error) {
			console.log(error);
			throw new GeneralError('Something went wrong');
		}
	}
};
