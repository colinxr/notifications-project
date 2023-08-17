const { faker } = require('@faker-js/faker');
const app = require('../../src/app');

const buildNotificationData = (props = {}) => {
	const defaultProps = {
		title: faker.lorem.words(5),
		body: faker.lorem.paragraph(),
		publishedAt: new Date()
	};

	return { ...defaultProps, ...props };
};

const notificationFactory = async (props = {}) => {
	const data = buildNotificationData(props);
	const notification = await app.service('notifications').Model.create(data);

	return notification;
};

const createNotifications = (numToCreate = 1) => {
	const array = Array.from({ length: numToCreate }, (_, index) => index);

	// eslint-disable-next-line no-unused-vars
	return Promise.all(array.map(async (el) => await notificationFactory({})));
};

module.exports = {
	createNotifications,
	notificationFactory
};
