import status from "http-status";
import { sampleService } from "./sample.service.js";
import { isEmpty } from "../../utils/empty.js";

const sampleController = {
	async getSampleUser(req, res, next) {
		const sampleusers = sampleService.getAllSampleUsers();
		res.locals = {
			data: sampleusers,
			message: "Successfully retreived users",
			status: !isEmpty(sampleusers) ? status.OK : status.NOT_FOUND
		};
	}
};

export { sampleController };
