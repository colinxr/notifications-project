const Redis = require('ioredis');

module.exports = function (app) {
	const redisConfig = app.get('redis');
	const redisClient = new Redis(redisConfig);

	return redisClient;
};
