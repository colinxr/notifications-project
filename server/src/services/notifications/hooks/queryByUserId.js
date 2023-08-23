const { BadRequest } = require('@feathersjs/errors');

module.exports = () => {
	return async (context) => {
		const { params } = context;

		// this uses a query param, but with authentication,
		// would find the authenticated users with their JWT AuthToken
		if (!params.query.userId) throw new BadRequest('No UserID Query Param provided');

		const { Model } = context.app.service('users');
		context.params.sequelize.include = [
			{
				model: Model,
				where: { id: params.query.userId },
				attributes: [],
				through: {
					attributes: ['readAt', 'userId', 'notificationId']
				},
				required: true
			}
		];

		// remove unneccsary query item
		delete context.params.query;
		return context;
	};
};
