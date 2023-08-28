const app = require('../../src/app');
const sequelize = app.get('sequelizeClient');
const { createUsers } = require('../factories/user.factory');

beforeEach(async () => {
	await sequelize.sync({ force: true, alter: true });
});

describe("'Event Notifications'", () => {
	it('creates a notification with type of news', async () => {
		// const numUsersToNotify = 5;
		// const users = await createUsers(numUsersToNotify);
		// const userToNotify = users[0];

		const data = await app.service('notifications').create(
			{
				title: 'Your patient just completed an assignment',
				publishedAt: new Date(),
				type: 'event'
			}
			// {
			// 	userIds: [userToNotify.id]
			// }
		);

		const notification = await app.service('notifications').Model.findByPk(data.id, {
			// include: [
			// 	{
			// 		model: app.service('users').Model
			// 	}
			// ]
		});

		// expect(notification.users).toBeTruthy();
		// expect(notification.users.length).toEqual(1);
		expect(notification.type).toEqual('event');
	});

	it('can be attached to specific user', async () => {
		const numUsersToNotify = 5;
		const users = await createUsers(numUsersToNotify);
		const userToNotify = users[0];

		const data = await app.service('notifications').create(
			{
				title: 'Your patient just completed an assignment',
				publishedAt: new Date(),
				type: 'event'
			},
			{
				userIds: [userToNotify.id]
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
		expect(notification.users.length).toEqual(1);
	});

	it('is created automatically after a patient submits their activity session', async () => {
		const users = await createUsers(2);

		const activity = await app.service('activities').create({
			fake: 'data',
			clinicianId: users[0].id,
			patientId: users[1].id
		});

		expect(activity).toBeTruthy();

		const { data } = await app.service('notifications').find({ query: { userId: users[0].id } });

		expect(data.length).toEqual(1);
		expect(data[0]).toBeTruthy();
		expect(data[0].userId).toEqual(users[0].id);
		expect(data[0].ctaUrl).toEqual(`/patient/${users[1].id}/homework`);
	});
});
