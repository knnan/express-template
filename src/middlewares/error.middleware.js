import expressValidation from "express-validation";
import ipFilter from "express-ipfilter";
import httpStatus from "http-status";
import { Response } from "../utils/fmt-response.utils.js";
import { logger } from "../loggers/logger.js";
import * as customErrors from "../errors/errors.js";

const errorHandler = (err, req, res, next) => {
	logger.error(err);
	if (err instanceof expressValidation.ValidationError) {
		const statusCode = httpStatus.BAD_REQUEST;
		const errResponse = Response.formatResponse({
			statusCode,
			message: "Validation Failed",
			error: {
				message: "Validation Failed",
				details: err.details
			}
		});
		res.status(statusCode).json(errResponse);
	} else if (err instanceof ipFilter.IpDeniedError) {
		const statusCode = httpStatus.FORBIDDEN;
		const errMessage = "Access denied";
		const errResponse = Response.formatResponse({ statusCode, error: errMessage });
		res.status(statusCode).json(errResponse);
	} else if (customErrors.isTrustedError(err)) {
		if (err instanceof customErrors.ApiError) {
			const { httpCode: statusCode, message } = err;
			const errResponse = Response.formatResponse({ statusCode, error: message });
			res.status(statusCode).json(errResponse);
		} else if (err instanceof customErrors.ApplicationError) {
			const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
			const errMessage = "Something went wrong while processing your request";
			const errResponse = Response.formatResponse({ statusCode, error: errMessage });
			res.status(statusCode).json(errResponse);
		}
	} else {
		const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		const errMessage = "Something went wrong while processing your request";
		const errResponse = Response.formatResponse({ statusCode, error: errMessage });
		res.status(statusCode).json(errResponse);
	}
};

export { errorHandler };
