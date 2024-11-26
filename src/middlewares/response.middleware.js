import httpStatus from "http-status";
import { Response } from "../utils/fmt-response.utils.js";

const responseHandler = (req, res, next) => {
	const { status, message, data, routeExist, success = null } = res.locals;
	if (!routeExist && !status) {
		const resObj = Response.formatResponse({
			statusCode: httpStatus.NOT_FOUND,
			message: "Route doesn't exist",
			success: false,
			error: "Requested route doesn't exist"
		});
		return res.status(httpStatus.NOT_FOUND).json(resObj);
	}
	if (!status || typeof status !== "number") return next(new Error("response object is missing status"));
	const responseObject = Response.formatResponse({ statusCode: status, data, message, success });
	return res.status(status).json(responseObject);
};

export { responseHandler };
