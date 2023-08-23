// const { authenticate } = require('@feathersjs/authentication').hooks;
const attachUsers = require('./hooks/attachUsers');
const fetchPublished = require('./hooks/fetchPublished');
const queryByUserId = require('./hooks/queryByUserId');
const sanitizeData = require('./hooks/sanitizeData');

module.exports = {
	before: {
		all: [], //authenticate('jwt'),
		find: [fetchPublished(), queryByUserId()],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [sanitizeData()],
		get: [],
		create: [attachUsers()],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
