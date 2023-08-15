const { BadRequest } = require('@feathersjs/errors');
const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');

beforeAll(async () => {
	await sequelize.sync({ force: true }); // For testing only; recreates tables
});

describe("'Notifications' service", () => {
	it('registered the service', () => {
		const service = app.service('notifications');
		expect(service).toBeTruthy();
	});

	it('creates a notifications', async () => {
		const currentDate = new Date();

		const data = await app.service('notifications').create({
			title: 'Test Notification',
			body: '# Welcome to Markdown! \nThis is *italic* and **bold** text.',
			publishedAt: currentDate
		});

		expect(data).toBeTruthy();
		expect(data.title).toEqual('Test Notification');
		expect(data.publishedAt).toEqual(currentDate);
	});

	it('throws error if data does not validate', async () => {
		try {
			const data = await app.service('notifications').create({
				title: 'Test Notification'
			});

			expect(data).toBe(false);
		} catch (error) {
			expect(error instanceof BadRequest).toBe(true);

			const errorBag = error.errors;
			expect(errorBag[0].message).toContain('Notification body content is required.');
		}
	});
});
