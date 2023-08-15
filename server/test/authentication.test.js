const app = require('../src/app');
const { faker } = require('@faker-js/faker');

const sequelize = app.get('sequelizeClient');

const userInfo = {
	email: 'someone@example.com',
	password: 'supersecret'
};

describe('authentication', () => {
	it('registered the authentication service', () => {
		expect(app.service('authentication')).toBeTruthy();
	});

	describe('local strategy', () => {
		beforeAll(async () => {
			try {
				await sequelize.sync({ force: true }); // For testing only; recreates tables

				await app.service('users').create({
					firstName: faker.person.firstName(),
					lastName: faker.person.lastName(),
					email: userInfo.email,
					password: userInfo.password
				});
			} catch (error) {
				// Do nothing, it just means the user already exists and can be tested
			}
		});

		it('authenticates user and creates accessToken', async () => {
			const { accessToken, user } = await app.service('authentication').create({
				strategy: 'local',
				...userInfo
			});

			await expect(accessToken).toBeTruthy();
			await expect(user).toBeTruthy();
		});
	});
});
