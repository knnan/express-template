import { createClient } from "redis";
import { config } from "./config.js";
import { logger } from "../loggers/logger.js";
import { isEmpty } from "../utils/empty.js";

const retryIntervalSec = 20; // retry interval in milliseconds
let retryIntervalId = null;
const client = createClient({
	socket: {
		port: config.redis.port,
		host: config.redis.host,
		connectTimeout: 3000,
		reconnectStrategy: false
	},
	password: config.redis.auth,
	name: config.setupName
});

client.on("connect", () => {
	logger.info("RedisClient is establishing connection to REDIS...");
});
client.on("disconnect", () => {
	logger.debug("RedisClient disconnected");
});
client.on("ready", () => {
	logger.info("RedisClient is connected to REDIS");
	clearInterval(retryIntervalId);
	retryIntervalId = null;
});
client.on("end", () => {
	logger.error("RedisClient disconnected from REDIS");
});

process.on("cleanup", async () => {
	clearInterval(retryIntervalId);
	retryIntervalId = null;
	logger.info("performing cleanup steps for redis");
	await client.quit().catch((err) => logger.error(err.message));
	logger.info("cleanup completed for redis");
});

const setupConn = async () => {
	try {
		await client.connect();
		await client.ping();
	} catch (err) {
		logger.error(`Connecting to redis: ${err.message}`);
	}
};

client.on("error", (err) => {
	if (err.message === "WRONGPASS invalid username-password pair or user is disabled.") {
		throw err;
	}
	if (isEmpty(retryIntervalId)) {
		retryIntervalId = setInterval(async () => {
			try {
				if (!client.isReady) {
					if (client.isOpen) {
						await client.disconnect();
					}
					await setupConn();
				}
			} catch (error) {
				logger.error(`Retrying redis connection : ${err.message}`);
			}
		}, retryIntervalSec * 1000); // convert seconds to milliseconds
	}
	logger.error(err.message);
});

await setupConn();
export { client as redis };
