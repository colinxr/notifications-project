const { Queue } = require('bullmq');
const redisClient = require('../redis'); // Adjust the path

const notificationQueue = new Queue('notificationQueue', { connection: redisClient });

module.exports = notificationQueue;
