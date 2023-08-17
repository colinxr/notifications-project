const { BadRequest } = require('@feathersjs/errors');

module.exports = () => {
	return async (context) => {
		const { params } = context;
		const { query } = params;

		if (!query.userId) throw new BadRequest('No UserID Query Param provided');

		context.params.query.userId = query.userId;
		delete context.params.query.userId; // Optional: Remove the userId from the query to prevent duplication

		return context;
	};
};
