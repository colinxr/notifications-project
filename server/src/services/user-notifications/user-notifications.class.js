const { Service } = require('feathers-sequelize');
const { Op } = require('sequelize');

const { NotFound, GeneralError } = require('@feathersjs/errors');

exports.UserNotifications = class UserNotifications extends Service {
	async read(ids) {
		try {
			await this.Model.update(
				{ readAt: new Date() },
				{
					where: {
						id: { [Op.in]: ids }
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
