import { Joi } from "express-validation";

const socketIoValidation = {
	test: {
		schema: Joi.object({
			sessionId: Joi.string().required(),
			projectId: Joi.string().required(),
			buildId: Joi.string().required()
		})
	},
	"event:name": {
		schema: Joi.object({
			field1: Joi.string().required(),
			field2: Joi.string().required()
		})
	}
};

export { socketIoValidation };
