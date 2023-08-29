const app = require('../../src/app');

describe("'Activities' service", () => {
	it('registered the service', () => {
		const service = app.service('activities');
		expect(service).toBeTruthy();
	});
});
