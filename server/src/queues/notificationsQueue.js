const { Queue } = require('bullmq');
const redisClient = require('../redis'); // Adjust the path

module.exports = new Queue('notificationQueue', { connection: redisClient });
