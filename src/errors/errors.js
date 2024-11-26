import { BaseError } from "./custom-errors/baseError.js";

export const isTrustedError = (error) => {
	if (error instanceof BaseError) {
		return error.isOperationalError;
	}
	return false;
};
export { ApiError } from "./custom-errors/apiError.js";
export { ApplicationError } from "./custom-errors/applicationError.js";
