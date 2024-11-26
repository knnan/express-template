import pgPromise from "pg-promise";
import { config } from "./config.js";
import { logger } from "../loggers/logger.js";

const initOptions = {
	connect(client, dc, useCount) {
		// const cp = client.client.connectionParameters;
		// console.log(`Connected to database: ${cp.database}  on PORT : ${cp.port}`);
	},
	disconnect(e) {
		// const cp = e.client.connectionParameters;
		// console.log("Disconnecting from database:", cp.database);
	},
	error(err, e) {
		if (e.cn) {
			// this is a connection-related error
			// cn = safe connection details passed into the library:
			//      if password is present, it is masked by #
		}
		if (e.query) {
			// query string is available
			if (e.params) {
				// query parameters are available
			}
		}
		if (e.ctx) {
			// occurred inside a task or transaction
		}
	}
};

async function testPoolConn(poolConn, connName = "default") {
	// Ping database to check for common exception errors.
	try {
		const connection = await poolConn.connect();
		if (connection) {
			logger.info(`Connected to ${config.app.nodeEnv} ${connName} Database: ${connection.client.database}  on Port: ${connection.client.port}`);
			connection.done();
		}
	} catch (err) {
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			logger.error(err, `${connName} Database connection was closed.`);
		} else if (err.code === "ECONNREFUSED") {
			logger.error(err, `${connName} Database connection was refused.`);
		} else if (err.code === "ER_CON_COUNT_ERROR") {
			logger.error(err, `${connName} Database has too many connections.`);
		} else {
			logger.error(err);
		}
	}
}

const pgp = pgPromise(initOptions);
pgp.pg.types.setTypeParser(20, parseInt);

const pool = pgp({
	host: config.database.host,
	port: config.database.port,
	user: config.database.user,
	password: config.database.password,
	database: config.database.name,
	max: 30 // use up to 30 connections,
});

await testPoolConn(pool);

export { pool, pgp };
