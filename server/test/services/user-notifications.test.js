const axios = require('axios');
const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');

const { userFactory } = require('../factories/user.factory');
const { createNotifications } = require('../factories/notification.factory');

describe("'UserNotifications' service", () => {
	let server;
	let user;

	beforeAll(async () => {
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

		notifications.forEach(async (element) => {
			await element.addUser(user.id);
		});
	});

	afterAll(async () => server.close());

	it('registered the service', () => {
		const service = app.service('user/notifications');
		expect(service).toBeTruthy();
	});

	it('can get the notifications filtered by User ID', async () => {
		const { data } = await axios.get(`http://localhost:3030/user/notifications?userId=${user.id}`);

		expect(data.data.length).toEqual(3);
	});
});
