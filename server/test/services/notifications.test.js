const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');
const { createUsers } = require('../factories/user.factory');
const { BadRequest } = require('@feathersjs/errors');

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

// const createUsers = async (numToCreate = 10) => {
// 	const array = Array.from({ length: numToCreate }, (_, index) => index);

// 	// eslint-disable-next-line no-unused-vars
// 	return Promise.all(array.map(async (el) => await userFactory({})));
// };

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
		// create users
		console.log(createUsers);
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
		// eslint-disable-next-line no-unused-vars
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
});
