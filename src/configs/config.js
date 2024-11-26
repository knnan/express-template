import { myEnv } from "./env-loader.js";
import { validateEnv, validateEnvAsync } from "./validations/env.validate.js";
import { isEmpty } from "../utils/empty.js";
import { Constants } from "../constants/constants.js";
import { deepFreeze } from "../utils/common.utils.js";

const { warn } = console;
let errorDetails = null;
const { error, value: parsedEnv } = validateEnv(myEnv);

if (error) {
	errorDetails = isEmpty(error?.details) ? null : error.details;
} else {
	const { errorAsync } = await validateEnvAsync(myEnv);
	errorDetails = isEmpty(errorAsync?.details) ? null : errorAsync.details;
}

if (errorDetails) {
	warn(" Env Config Validation Error \n");

	for (let i = 0; i < errorDetails.length; i += 1) {
		warn(` *   ${errorDetails[i].message} `);
	}
	process.exit(1);
}

export const config = deepFreeze({
	raw: parsedEnv,
	app: {
		name: parsedEnv.NAME,
		nodeEnv: parsedEnv.NODE_ENV,
		port: parsedEnv.PORT,
		disabledModules: parsedEnv.DISABLED_MODULES,
		whitelistedIps: [...parsedEnv.WHITELISTED_IPS, ...Constants.DEFAULT_WHITELISTED_IPS]
	},
	logger: {
		level: parsedEnv.LOGGER_LEVEL
	},
	database: {
		user: parsedEnv.DB_USER,
		host: parsedEnv.DB_HOST,
		name: parsedEnv.DB_NAME,
		password: parsedEnv.DB_PASS,
		port: parsedEnv.DB_PORT
	},
	redis: {
		port: parsedEnv.REDIS_PORT,
		host: parsedEnv.REDIS_HOST,
		auth: parsedEnv.REDIS_AUTH
	},
	aws: {
		region: parsedEnv.AWS_REGION,
		accessKey: parsedEnv.AWS_ACCESS_KEY,
		secretKey: parsedEnv.AWS_SECRET_KEY
	}
});
