import fs from "node:fs/promises";
import pino from "pino";
import httpContext from "express-http-context";
import colors from "colors";
import tracer from "tracer";
import { config } from "../configs/config.js";

const packageJson = JSON.parse(await fs.readFile(new URL("../../package.json", import.meta.url), { encoding: "utf-8" }));

/*
	Available Logging Methods
		* trace
		* debug
		* info
		* warn
		* error
		* fatal
 */

/*
tracer logger config

tracer logger gives better info while using debug mode and trace mode
need to discuss if we can include it as a additional logger that will be used only in specific instances
- provides colorized output for the entire log so its easily distinguishable
- provides details like line no and file in which the log occured
*/

const tracerLogger = tracer.colorConsole({
	level: config.logger.level,
	dateformat: "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'",
	filters: {
		trace: colors.magenta,
		debug: colors.blue,
		info: colors.green,
		warn: colors.yellow,
		error: [colors.red, colors.bold]
	}
});

// Pino transport config
const transport = pino.transport({
	target: "pino-pretty",
	options: {
		colorize: true,
		translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'"
	}
});

const pinoLogger = pino(
	{
		name: `${config.app.name} @v${packageJson.version}`,
		level: config.logger.level || "info",
		base: {
			stage: config.app.nodeEnv
		},
		enabled: true
	},
	transport
);

export const logger = new Proxy(pinoLogger, {
	get(target, property, receiver) {
		const reqId = httpContext.get("reqId");
		let loggerTarget;
		//  when using debug or trace mode for logging use tracer as the logger  otherwise use pino logger
		if (property !== "debug" && property !== "trace") {
			loggerTarget = reqId ? pinoLogger.child({ requestId: reqId }) : target;
		} else {
			loggerTarget = tracerLogger;
		}
		return Reflect.get(loggerTarget, property, receiver);
	}
});
