import "./utils/cleanup.js";
import "./cron/scheduler.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import requestlogger from "morgan";
import cookieParser from "cookie-parser";
import httpContext from "express-http-context";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";
import { genNanoId } from "./utils/file.utils.js";
import { config } from "./configs/config.js";
import { apiRouter } from "./routes/index.js";
import * as authHandler from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { responseHandler } from "./middlewares/response.middleware.js";
import { ipAccessControl, limitSize } from "./middlewares/common.middleware.js";
import { swaggerSpec, swaggerSpecInternal } from "./configs/swagger.config.js";
import { Constants } from "./constants/constants.js";

const app = express();

// MIDDLEWARES

app.use(helmet()); // set security HTTP headers
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
app.use(cors({ origin: true, credentials: true })); // enable cors
// app.options( '*', cors() );
app.use(cookieParser());

// set req context middleware
app.use(httpContext.middleware);

app.use((_req, _res, next) => {
	httpContext.ns.bindEmitter(_req);
	httpContext.ns.bindEmitter(_res);
	httpContext.set("reqId", genNanoId({ allowSpecialChars: false }));
	next();
});

app.use(limitSize);

// setup the request logging
if (config.app.nodeEnv === "development" || config.logger.level === "debug") {
	requestlogger.token("reqId", () => httpContext.get("reqId"));
	requestlogger.token("statusColor", (req, res, _) => {
		const status = (typeof res.headersSent !== "boolean" ? Boolean(res.header) : res.headersSent) ? res.statusCode : undefined;
		return status >= 400 ? `\x1b[31m${status}\x1b[0m` : status;
	});
	app.use(requestlogger("[:date[iso]] INFO - :reqId - :method \x1b[36m:url\x1b[0m :statusColor | :response-time ms", { immediate: false }));
}

// liveness api
app.get("/liveness", ipAccessControl(Constants.DEFAULT_WHITELISTED_IPS), (req, res, next) => {
	const appStatus = {
		message: "OK",
		timestamp: Date.now(),
		nodeJsVersion: process.version,
		uptime: `${process.uptime()}s`,
		processtime: process.hrtime(),
		description: "Liveness endpoint"
	};
	res.json(appStatus);
});

// ROUTES

// V1 routes
app.use("/api/v1", authHandler.authenticate, apiRouter.v1.externalRoutes);
app.use("/api/internal/v1`", ipAccessControl(), authHandler.internalAuthenticate, apiRouter.v1.internalRoutes);

// Swagger documentation routes
app.use("/api-docs/", swaggerUi.serveFiles(swaggerSpec), swaggerUi.setup(swaggerSpec));
app.use(
	"/api-docs-internal/",
	ipAccessControl,
	basicAuth({
		users: { internalUser: "jxsSt7I5er" },
		challenge: true
	}),
	swaggerUi.serveFiles(swaggerSpecInternal),
	swaggerUi.setup(swaggerSpecInternal)
);

app.use(responseHandler);

app.use(errorHandler);

export default app;
