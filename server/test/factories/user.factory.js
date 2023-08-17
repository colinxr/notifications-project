const { faker } = require('@faker-js/faker');
const app = require('../../src/app');

const buildUserData = (props = {}) => {
	const defaultProps = {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
		password: faker.internet.password()
	};

	return { ...defaultProps, ...props };
};

const userFactory = async (props = {}) => {
	const data = buildUserData(props);
	const user = await app.service('users').Model.create(data);

	return user;
};

const createUsers = async (numToCreate = 1) => {
	const array = Array.from({ length: numToCreate }, (_, index) => index);

	// eslint-disable-next-line no-unused-vars
	return Promise.all(array.map(async (el) => await userFactory({})));
};
module.exports = {
	userFactory,
	createUsers
};
