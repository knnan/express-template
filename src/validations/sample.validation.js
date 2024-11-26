// const Joi = require( "Joi" );
import { Joi } from "express-validation";

const sampleValidation = {
	// POST /api/sample-route
	sampleDetails: {
		body: Joi.object({
			user: Joi.string()
				.regex(/^[0-9a-zA-z]{5,}$/)
				.required(),
			description: Joi.string().required(),
			done: Joi.boolean()
		})
	},
	getUser: {
		params: Joi.object({
			user: Joi.string()
				.regex(/^[0-9a-zA-z]{5,}$/)
				.required()
		})
	},

	// GET-PUT-DELETE /api/sample-route/:userName
	sampleexample: {
		body: Joi.object({}),
		params: Joi.object({
			name: Joi.string()
				.regex(/^[0-9a-zA-z]{5,}$/)
				.required()
		}),
		query: Joi.object({}),
		cookies: Joi.object({}),
		signedCookies: Joi.object({})
	}
};

export { sampleValidation };
