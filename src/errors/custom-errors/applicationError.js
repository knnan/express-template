import { BaseError } from "./baseError.js";

class ApplicationError extends BaseError {
	/**
	 * @param {string} message
	 * @param {boolean} [isOperational=false] isOperational
	 */
	static category = {
		SERVICE_ERROR: "SERVICE_ERROR",
		DATABASE_ERROR: "DATABASE_ERROR"
	};

	constructor(message = "Application encountered an error", type = ApplicationError.category.SERVICE_ERROR, isOperationalError = false) {
		super(message, isOperationalError);
		this.type = type;
	}
}

export { ApplicationError };
