import { Constants } from "../../../constants/constants.js";
import { useP } from "../../../middlewares/promise-wrapper.middleware.js";
import { validate } from "../../../middlewares/validation.middleware.js";
import { sampleValidation } from "../../../validations/sample.validation.js";
import { sampleController } from "../sample.controller.js";
// all sample routes goes here
const name = Constants.MODULE_NAMES.SAMPLE;
const set = (router, enabled = true) => {
	if (enabled === false) return;
	router.get("/sample/users/:user", validate(sampleValidation.getUser), useP(sampleController.getSampleUser));
};

export default { set, name };
