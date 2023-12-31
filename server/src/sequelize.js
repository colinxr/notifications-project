const Sequelize = require('sequelize');

module.exports = function (app) {
	let sequelize;

	if (process.env.NODE_ENV === 'test') {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false, // Disable logging for cleaner test output
			define: {
				freezeTableName: true
			}
		});
	} else {
		const connectionString = app.get('mysql');
		sequelize = new Sequelize(connectionString, {
			dialect: 'mysql',
			logging: false,
			define: {
				freezeTableName: true
			}
		});
	}

	const oldSetup = app.setup;

	app.set('sequelizeClient', sequelize);

	app.setup = function (...args) {
		const result = oldSetup.apply(this, args);

		// Set up data relationships
		const models = sequelize.models;

		Object.keys(models).forEach((name) => {
			if ('associate' in models[name]) {
				models[name].associate(models);
			}
		});

		// Sync to the database
		app.set('sequelizeSync', sequelize.sync({ alter: true }));

		return result;
	};
};
