import { deepFreeze } from "../utils/common.utils.js";

export const Constants = deepFreeze({
	MODULE_NAMES: {
		SAMPLE: "sample"
	},
	DEFAULT_WHITELISTED_IPS: ["::ffff:127.0.0.1", "127.0.0.1", "::1"],
	FILE_SIZE_LIMIT_MB: 100,
	DEFAULT_WHITELISTED_ORIGINS: [/\.(somedomain|someotherdomain|anotherdomain)\.com$/]
});
