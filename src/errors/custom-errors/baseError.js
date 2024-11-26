/**
 * @extends Error
 */

class BaseError extends Error {
	constructor(message, isOperationalError = false, details = {}) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.isOperationalError = isOperationalError;
		this.details = details;

		Error.captureStackTrace(this, this.constructor.name);
	}
}

export { BaseError };
