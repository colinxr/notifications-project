module.exports = () => {
	return async (context) => {
		const { Model } = context.app.service('notifications');

		context.params.sequelize = {
			include: [
				{
					model: Model,
					as: 'notification'
				}
			],
			order: [[Model, 'publishedAt', 'desc']]
		};
	};
};
