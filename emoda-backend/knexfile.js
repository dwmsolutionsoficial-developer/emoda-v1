const { db } = require('./config/env')

module.exports = {
	client: 'mysql',
	connection: db,
	migrations: {
		tableName: 'knex_migrations'
	},
	pool: {
		min: 1,
		max: 1000
	},
	acquireConnectionTimeout: 60000,
};
