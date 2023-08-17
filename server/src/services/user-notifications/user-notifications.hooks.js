// const { authenticate } = require('@feathersjs/authentication').hooks
// const notificationsModel = require('../../models/notifications.model');
const { addAssociated, filterByUserId } = require('./hooks');

module.exports = {
	before: {
		all: [],
		find: [addAssociated(), filterByUserId()],
		get: [addAssociated()],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
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
