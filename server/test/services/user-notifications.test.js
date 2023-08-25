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

	it('can mark user notification as read', async () => {
		const notifications = await app.service('user/notifications').Model.findAll({ limit: 1, attributes: ['id'] });
		/* eslint-disable-next-line */
		const resp = await app.service('user/notifications').patch([notifications[0].id], { readAt: new Date() });
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
		const resp = await app.service('user/notifications').patch(
			null,
			{ readAt: new Date() },
			{
				query: {
					id: { $in: ids }
				}
			}
		);

		const readNotifications = await app.service('user/notifications').Model.findAll({
			where: {
				readAt: { [Op.not]: null }
			}
		});

		expect(readNotifications.length).toEqual(notifications.length);
	});
});
