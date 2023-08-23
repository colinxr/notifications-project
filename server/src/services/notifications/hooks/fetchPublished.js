const { Op } = require('sequelize');

module.exports = () => {
	return async (context) => {
		const { params } = context;

		if (!params.query.preview) {
			context.params.sequelize = {
				where: {
					publishedAt: {
						[Op.not]: null
					}
				}
			};
		}
	};
};
