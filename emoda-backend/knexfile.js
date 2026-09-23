const { db } = require('./config/env')

module.exports = {
	client: 'mysql',
	connection: db,
	migrations: {
		tableName: 'knex_migrations'
	},
	pool: {
		min: 1,
		max: 1000,
		// O código foi escrito contra o RDS, cujo sql_mode padrão não é estrito:
		// datas ISO com hora em colunas DATE eram truncadas em vez de rejeitadas.
		// O MySQL 8 da VM02 vem em modo estrito e o erro derrubava o processo.
		afterCreate: (conn, done) => {
			conn.query("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'", (err) => done(err, conn))
		}
	},
	acquireConnectionTimeout: 60000,
};
