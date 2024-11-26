import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	development: {
		client: "pg",
		connection: {
			host: config.database.host,
			port: config.database.port,
			user: config.database.user,
			password: config.database.password,
			database: config.database.name
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: path.resolve(__dirname, "../migrations")
		}
	}
};
