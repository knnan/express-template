import { ApiError } from "../errors/errors.js";
import { logger } from "../loggers/logger.js";

export async function authenticate(req, res, next) {
	try {
		// Todo: Do required authentiation
		const authSuccess = true;
		if (authSuccess === false) {
			return next(ApiError.Unauthorized("Invalid user"));
		}
		next();
	} catch (error) {
		next(error);
	}
}

export async function internalAuthenticate(req, res, next) {
	try {
		return next();
	} catch (error) {
		next(error);
	}
}

export function socketInternalAuthenticate(_socket, next) {
	try {
		// Todo: Do required authentiation
		return next();
	} catch (error) {
		logger.error(error);
		next(error);
	}
}
