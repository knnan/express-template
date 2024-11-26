import httpStatus from "http-status";
import httpContext from "express-http-context";
import { Joi } from "express-validation";
import { isEmpty } from "./empty.js";
import { logger } from "../loggers/logger.js";

const validStatusCodes = Object.keys(httpStatus)
	.filter((key) => /^\d+_NAME$/.test(key))
	.map((key) => httpStatus[httpStatus[key]]);

const responseSchema = Joi.object({
	requestId: Joi.string().required(),
	statusCode: Joi.number()
		.valid(...validStatusCodes)
		.required(),
	status: Joi.string().valid("error", "success").required(),
	message: Joi.string().required(),
	data: Joi.object().optional(),
	error: Joi.any().optional()
});
class Response {
	static formatResponse({ statusCode, data = undefined, message, error = undefined, success = null }) {
		const statusOptions = {
			true: "success",
			false: "error"
		};

		const getStatusByClass = (httpStatusCode) => {
			let statusType = "error";
			switch (httpStatus[`${httpStatusCode}_CLASS`]) {
				case httpStatus.classes.INFORMATIONAL /*  The responseCode is 1xx */:
					statusType = "success";
					break;
				case httpStatus.classes.SUCCESSFUL /*  The responseCode is 2xx */:
					statusType = "success";
					break;
				case httpStatus.classes.REDIRECTION /*  The responseCode is 3xx */:
					statusType = "error";
					break;
				case httpStatus.classes.CLIENT_ERROR /*  The responseCode is 4xx */:
					statusType = "error";
					break;
				case httpStatus.classes.SERVER_ERROR /*  The responseCode is 5xx */:
					statusType = "error";
					break;
				default:
					// Unknown
					break;
			}
			return statusType;
		};

		const response = {
			requestId: httpContext.get("reqId"),
			statusCode,
			status: success !== null ? statusOptions[success] : getStatusByClass(statusCode),
			message: message ?? httpStatus[statusCode],
			data: data ?? undefined,
			error: typeof error === "string" ? { message: error } : error
		};

		const { error: validationErr } = responseSchema.validate(response, { abortEarly: false });
		if (!isEmpty(validationErr)) {
			logger.error(validationErr);
			return "Invalid response format";
		}
		return response;
	}

	static fmtExternalResponse({ isOk, data, error }) {
		if (typeof isOk !== "boolean") {
			throw new Error("Incorrect parameter type, isOk should be a boolean");
		}
		return {
			isOk,
			data,
			error
		};
	}
}

export { Response };
