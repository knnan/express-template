import path from "node:path";
import { fileURLToPath } from "node:url";
import { Joi } from "express-validation";
import { Constants } from "../../constants/constants.js";
import { isEmpty } from "../../utils/empty.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envVarsSchema = Joi.object({
	PORT: Joi.number().port().default(5000),
	NODE_ENV: Joi.string().valid("development", "production").required(),
	WHITELISTED_IPS: Joi.array().items(Joi.string().ip()).default([]),
	DISABLED_MODULES: Joi.array()
		.items(Joi.string().valid(...Object.values(Constants.MODULE_NAMES)))
		.default([]),
	NAME: Joi.string().default("express-template"),
	LOGGER_LEVEL: Joi.string().valid("trace", "debug", "info", "warn", "error", "fatal").default("debug"),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().default(5432),
	DB_USER: Joi.string().required(),
	DB_PASS: Joi.string().required(),
	DB_NAME: Joi.string().required(),
	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().default(6379),
	REDIS_AUTH: Joi.string()
		.invalid("foobared")
		.required()
		.messages({
			"any.invalid": `"REDIS_AUTH"  must not be one of ${"[foobared]"}`
		}),
	AWS_REGION: Joi.string().required(),
	AWS_ACCESS_KEY: Joi.string().required(),
	AWS_SECRET_KEY: Joi.string().required()
});

const validateEnv = (env) => envVarsSchema.validate(env, { abortEarly: false });

const envVarsSchemaCustomValidation = Joi.object({
	/* add custom exernal validations here  */
});
const validateEnvAsync = async (env) => {
	const errorAsync = await envVarsSchemaCustomValidation.validateAsync(env, { abortEarly: false, allowUnknown: true }).catch((err) => err);
	if (!isEmpty(errorAsync?.details)) {
		return { errorAsync };
	}
	return { errorAsync: null };
};

export { validateEnv, validateEnvAsync };
