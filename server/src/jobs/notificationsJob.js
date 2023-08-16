const notificationQueue = require('../queues/notificationQueue');

notificationQueue.process('attachNotifications', async (job) => {
	const { notification, usersService } = job.data;
	const users = await usersService.find();

	notification.addUsers(users);
});
