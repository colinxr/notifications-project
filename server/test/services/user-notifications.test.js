const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');
const { Op } = require('sequelize');

const { userFactory } = require('../factories/user.factory');
const { createNotifications } = require('../factories/notification.factory');

let user;
describe("'UserNotifications' service", () => {
	let server;

	beforeEach(async () => {
		// server = app.listen(app.get('port'));
		await sequelize.sync({ force: true });

		user = await userFactory({
			email: 'test@example.com',
			password: 'supersecret'
		});

		/* eslint-disable-next-line */
		const user2 = await userFactory({
			email: 'second_user@example.com',
			password: 'supersecret'
		});

		const notifications = await createNotifications(3);
		await Promise.all(notifications.map(async (el) => await el.addUser(user.id)));
	});

	afterAll(async () => server.close());

	it('registered the service', () => {
		try {
			const service = app.service('user/notifications');

			expect(service).toBeTruthy();
		} catch (error) {
			console.log(error);
		}
	});

	it('can get the notifications filtered by User ID', async () => {
		const { data } = await app.service('user/notifications').find({
			query: {
				userId: user.id
			}
		});
		expect(data.length).toEqual(3);
	});

	it("can sort userNotifications by notification's publishedAt property", async () => {
		const newNotifications = await createNotifications(3);
		await Promise.all(newNotifications.map(async (el) => await el.addUser(user.id)));

		const notifications = await app.service('user/notifications').Model.findAll({ where: { userId: user.id } });
		expect(notifications.length).toEqual(6);

		const { data } = await app.service('user/notifications').find({
			query: {
				userId: user.id
			}
		});

		const sortedArray = data.sort((a, b) => {
			const dateA = new Date(a['notification.publishedAt']);
			const dateB = new Date(b['notification.publishedAt']);
			return dateB - dateA; // Descending order
		});

		expect(data.length).toEqual(6);
		expect(data).toStrictEqual(sortedArray);
	});

	it('can mark user notification as read', async () => {
		const notifications = await app.service('user/notifications').Model.findAll({ limit: 1, attributes: ['id'] });
		/* eslint-disable-next-line */
		const resp = await app.service('user/notifications').markAsRead(notifications[0].id);

		const readNotifications = await app.service('user/notifications').Model.findAll({
			where: {
				readAt: { [Op.not]: null }
			}
		});

		expect(readNotifications.length).toEqual(1);
		expect(readNotifications[0].id).toEqual(notifications[0].id);
	});

	it('can mark an array of notification ids as read', async () => {
		const notifications = await app.service('user/notifications').Model.findAll({ attributes: ['id'] });
		const ids = notifications.map(({ id }) => id);

		/* eslint-disable-next-line */
		const resp = await app.service('user/notifications').markAsRead(ids);

		const readNotifications = await app.service('user/notifications').Model.findAll({
			where: {
				readAt: { [Op.not]: null }
			}
		});

		expect(readNotifications.length).toEqual(notifications.length);
	});
});
