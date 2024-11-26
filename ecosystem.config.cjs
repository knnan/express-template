const path = require("path");
const fs = require("fs");

// Load node version from .nvmrc file
const nodejsVersion = fs.readFileSync(path.join(__dirname, ".nvmrc"), { encoding: "utf-8" }).trim().replace(/^v/, "");

module.exports = {
	apps: [
		{
			name: "express-template",
			script: "src/index.js",
			interpreter: `node@${nodejsVersion}`,
			autorestart: true,
			exp_backoff_restart_delay: 100,
			stop_exit_codes: [0],
			watch: false,
			time: true,
			env: {
				NODE_ENV: "production"
			}
		}
	]
};
