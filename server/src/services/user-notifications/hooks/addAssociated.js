module.exports = () => {
	return async (context) => {
		const { Model } = context.app.service('notifications');

		context.params.sequelize = {
			include: [
				{
					model: Model
				}
			],
			order: [[Model, 'publishedAt', 'desc']]
		};
	};
};
