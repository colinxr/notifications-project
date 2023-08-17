const notificationQueue = require('../queues/notificationQueue');

notificationQueue.process('attachNotifications', async ({ notification, userService }) => {
	try {
		const { Model } = userService;

		const users = await await Model.findAll({ attributes: ['id'] });

		notification.addUsers(users);
	} catch (error) {
		console.log('something went wrong attaching notification to existing users');
		console.log(error);
	}
});
