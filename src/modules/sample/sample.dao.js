import { pgp, pool } from "../../configs/db.config.js";
import { logger } from "../../loggers/logger.js";

const sampleDao = {
	async getSampleUser({ name }) {
		const query = pgp.as.format(`
			SELECT * FROM knex_migrations km
			`);
		const result = await pool.query(query);
		logger.debug(result);
		return result;
	}
};

export { sampleDao };
