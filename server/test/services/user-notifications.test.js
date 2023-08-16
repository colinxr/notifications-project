const app = require('../../src/app');

describe("'UserNotifications' service", () => {
	it('registered the service', () => {
		const service = app.service('user/notifications');
		expect(service).toBeTruthy();
	});
});
