const axios = require('axios');
const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');

const { userFactory } = require('../factories/user.factory');
const { createNotifications } = require('../factories/notification.factory');

describe("'UserNotifications' service", () => {
	let server;
	let user;

	beforeEach(async () => {
		server = app.listen(app.get('port'));
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
		const service = app.service('user/notifications');
		expect(service).toBeTruthy();
	});

	it('can get the notifications filtered by User ID', async () => {
		const { data } = await axios.get(`http://localhost:3030/user/notifications?userId=${user.id}`);

		console.log(data.data);
		expect(data.data.length).toEqual(3);
	});

	it("can sort userNotifications by notification's publishedAt property", async () => {
		const newNotifications = await createNotifications(3);
		await Promise.all(newNotifications.map(async (el) => await el.addUser(user.id)));

		const notifications = await app.service('user/notifications').Model.findAll({ where: { userId: user.id } });
		expect(notifications.length).toEqual(6);

		const { data } = await axios.get(`http://localhost:3030/user/notifications?userId=${user.id}`);

		const sortedArray = data.data.sort((a, b) => {
			const dateA = new Date(a['notification.publishedAt']);
			const dateB = new Date(b['notification.publishedAt']);
			return dateB - dateA; // Descending order
		});

		expect(data.data.length).toEqual(6);
		expect(data.data).toStrictEqual(sortedArray);
	});
});
