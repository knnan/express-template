import knex from "knex";
import path from "path";
import { rename, writeFile } from "fs/promises";
import knexconfig from "../src/configs/knexfile.js";
import { logger } from "../src/loggers/logger.js";

const [migrateCmd, option] = process.argv.slice(2);
// Logging, error management & rollback omitted
const knexDb = knex(knexconfig.development);

async function migrationMake(name) {
	const oldName = await knexDb.migrate.make(name, { extension: "ts" });
	const newName = path.join(path.dirname(oldName), `${path.basename(oldName, path.extname(oldName))}.js`);

	const template = `/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up ( knex )
{

};

export async function down ( knex )
{

};`;

	await writeFile(oldName, template);
	await rename(oldName, newName);
}
async function migrationlist() {
	const [completed, pending] = await knexDb.migrate.list();
	logger.info("COMPLETED MIGRATIONS : ");
	for (const { name } of completed) {
		logger.warn(` *   ${name} `);
	}
	logger.info("\nPENDING MIGRATIONS : ");
	for (const { file } of pending) {
		logger.warn(` *   ${file} `);
	}
}

switch (migrateCmd) {
	case "latest":
		await knexDb.migrate.latest();
		break;
	case "make":
		await migrationMake(option);
		break;
	case "up":
		await knexDb.migrate.up();
		break;
	case "down":
		await knexDb.migrate.down();
		break;
	case "rollback":
		await knexDb.migrate.rollback();
		break;
	case "reset":
		await knexDb.migrate.rollback(true);
		break;
	case "list":
		await migrationlist();
		break;

	default:
		break;
}
await knexDb.destroy();
