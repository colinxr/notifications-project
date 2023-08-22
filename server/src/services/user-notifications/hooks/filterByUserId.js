const { BadRequest } = require('@feathersjs/errors');

module.exports = () => {
	return async (context) => {
		const { query } = context.params;

		if (!query) return context;

		// this uses a query param, but with authentication,
		// would find the authenticated users with their JWT AuthToken
		if (!query.userId) throw new BadRequest('No UserID Query Param provided');

		context.params.query.userId = query.userId;

		return context;
	};
};
