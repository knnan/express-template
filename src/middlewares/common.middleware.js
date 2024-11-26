import ipFilter from "express-ipfilter";
import { ApiError } from "../errors/errors.js";
import { logger } from "../loggers/logger.js";
import { config } from "../configs/config.js";
import { isEmpty } from "../utils/empty.js";
import { Constants } from "../constants/constants.js";

export const ipAccessControl = (IpWhiteList) => {
	const ipsToWhiteList = isEmpty(IpWhiteList) ? config.app.whitelistedIps : IpWhiteList;
	return ipFilter.IpFilter(ipsToWhiteList, {
		detectIp: (req, _res) => {
			const clientIp = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress;
			return clientIp;
		},
		mode: "allow",
		log: false
	});
};

function isOriginAllowed(origin, allowedOrigin) {
	if (Array.isArray(allowedOrigin)) {
		for (let i = 0; i < allowedOrigin.length; i++) {
			if (isOriginAllowed(origin, allowedOrigin[i])) {
				return true;
			}
		}
		return false;
	}
	if (typeof allowedOrigin === "string" || allowedOrigin instanceof String) {
		return origin === allowedOrigin;
	}
	if (allowedOrigin instanceof RegExp) {
		return allowedOrigin.test(origin);
	}
	return false;
}

export function originAccessControl({ allowedOrigins = null, allowUnknown = true }) {
	const originFilterMiddleware = (req, _res, next) => {
		const reqOrigin = req.headers.origin;
		const whitelistedOrigins = allowedOrigins || Constants.DEFAULT_WHITELISTED_ORIGINS;
		if (isEmpty(reqOrigin) && allowUnknown === true) {
			return next();
		}
		if (!isOriginAllowed(reqOrigin, whitelistedOrigins)) {
			return next(ApiError.Forbidden("Unknown origin"));
		}
		next();
	};
	return originFilterMiddleware;
}

export const limitSize = (req, _res, next) => {
	let fileSize = req.headers["content-length"];
	// Convert fileSize from byte to Megabyte
	fileSize = fileSize / 1024 / 1024;
	if (fileSize > 500) {
		logger.debug({ fileSize });
		next(ApiError.BadRequest("Filesize too large, fized less than 500 MB only are allowed "));
	}
	next();
};
