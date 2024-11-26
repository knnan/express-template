import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import dotenvParseVariables from "dotenv-parse-variables";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env.defaults") });
const env = dotenv.config({ path: path.resolve(__dirname, "../../.env"), override: true });

if (env.error) throw new Error(`Env Validation error ${env.error.message}`);

const combinedEnv = dotenvParseVariables(env.parsed, {
	assignToProcessEnv: true,
	overrideProcessEnv: true
});

const sanitizedEnv = Object.keys(combinedEnv)
	.filter((key) => combinedEnv[key] !== "")
	.reduce(
		(obj, key) => ({
			...obj,
			[key]: combinedEnv[key]
		}),
		{}
	);

export { sanitizedEnv as myEnv };
