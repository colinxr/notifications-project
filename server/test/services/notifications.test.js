const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');
const { createUsers } = require('../factories/user.factory');
const { BadRequest } = require('@feathersjs/errors');

beforeAll(async () => {
	await sequelize.sync({ force: true, alter: true });

	Object.keys(sequelize.models).forEach(function (modelName) {
		if ('associate' in sequelize.models[modelName]) {
			sequelize.models[modelName].associate(sequelize.models);
		}
	});
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

	it('has association with users notifications model', async () => {
		const users = await createUsers(2);

		// create notifications
		const notification = await app.service('notifications').Model.create({
			title: 'Test Notification',
			body: '# Welcome to Markdown! \nThis is *italic* and **bold** text.'
		});

		// add users to notifications
		const userIds = users.map(({ id }) => id);
		await notification.addUsers(userIds);

		const notificationUsers = await notification.getUsers();

		expect(notificationUsers).toBeTruthy();
		expect(notificationUsers.length).toEqual(2);
	});

	it('attaches a new notification to all existing users', async () => {
		// create users
		const numUsersToNotify = 5;
		await createUsers(numUsersToNotify);

		// create notification
		const data = await app.service('notifications').create({
			title: 'Test title',
			body: 'test content'
		});

		const notification = await app.service('notifications').Model.findByPk(data.id, {
			include: [
				{
					model: app.service('users').Model
				}
			]
		});

		expect(notification.users).toBeTruthy();
		expect(notification.users.length).toEqual(numUsersToNotify);
	});

	it('can have a CTA and CTA URL', async () => {
		const notification = await app.service('notifications').create({
			title: 'Test title',
			body: 'test content',
			cta: 'Learn More',
			ctaUrl: 'www.google.com'
		});

		console.log(notification);

		expect(notification.cta).toBeTruthy();
		expect(notification.ctaUrl).toBeTruthy();
		expect(notification.cta).toEqual('Learn More');
	});

	it('can be edited by an admin', async () => {
		// create notification
		const notification = await app.service('notifications').create({
			title: 'Test title',
			body: 'test content'
		});

		// update notification
		const updated = await app.service('notifications').patch(notification.id, {
			title: 'Updated title'
		});

		// fetch model from db
		const model = await app.service('notifications').Model.findByPk(notification.id);

		// check that model from db has updated title property
		expect(model.title).toEqual(updated.title);
	});
});
