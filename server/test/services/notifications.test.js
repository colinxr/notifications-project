const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');
const { createUsers } = require('../factories/user.factory');
const { BadRequest } = require('@feathersjs/errors');
const { userFactory } = require('../factories/user.factory');

const { createNotifications } = require('../factories/notification.factory');

beforeEach(async () => {
	await sequelize.sync({ force: true, alter: true });
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
		expect(data.type).toEqual('news');
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
		const numUsers = 5;
		await createUsers(numUsers);

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
		expect(notification.users.length).toEqual(numUsers);
	});

	it('attaches a new notification to specific users', async () => {
		const numUsersToNotify = 5;
		const users = await createUsers(numUsersToNotify);
		const usersToNotify = users.filter((el, i) => i < 3).map(({ id }) => id);

		const data = await app.service('notifications').create(
			{
				title: 'Test title',
				body: 'test content'
			},
			{
				userIds: usersToNotify
			}
		);

		const notification = await app.service('notifications').Model.findByPk(data.id, {
			include: [
				{
					model: app.service('users').Model
				}
			]
		});

		expect(notification.users).toBeTruthy();
		expect(notification.users.length).toEqual(usersToNotify.length);
	});

	it('can have a CTA and CTA URL', async () => {
		const notification = await app.service('notifications').create({
			title: 'Test title',
			body: 'test content',
			cta: 'Learn More',
			ctaUrl: 'www.google.com'
		});

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

	it('can be queried by userId', async () => {
		const numUsersToNotify = 5;
		const users = await createUsers(numUsersToNotify);

		// create notification
		/* eslint-disable-next-line */
		const notification = await app.service('notifications').create({
			title: 'Test title',
			body: 'test content',
			publishedAt: new Date()
		});

		const { data } = await app.service('notifications').find({ query: { userId: users[0].id } });

		expect(data.length).toEqual(1);
		expect(data[0].readAt).toBe(null);
		expect(data[0].userId).toBe(users[0].id);
	});
});

it("can sort userNotifications by notification's publishedAt property", async () => {
	const user = await userFactory({
		email: 'test@example.com',
		password: 'supersecret'
	});

	const notifications = await createNotifications(3);
	await Promise.all(notifications.map(async (el) => await el.addUser(user.id)));

	const newNotifications = await createNotifications(3);
	await Promise.all(newNotifications.map(async (el) => await el.addUser(user.id)));

	const user_notifications = await app.service('user/notifications').Model.findAll({ where: { userId: user.id } });

	expect(user_notifications.length).toEqual(6);

	const { data } = await app.service('notifications').find({
		query: {
			userId: user.id
		}
	});

	const sortedArray = data.sort((a, b) => {
		const dateA = new Date(a.publishedAt);
		const dateB = new Date(b.publishedAt);
		return dateB - dateA; // Descending order
	});

	expect(data.length).toEqual(6);
	expect(data).toStrictEqual(sortedArray);
});
