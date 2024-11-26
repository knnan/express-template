import { validate as expressValidations } from "express-validation";

const joiDefaultOption = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	convert: false // disable type coercion
};

const validate = (schema) => expressValidations(schema, { context: true, statusCode: 400, keyByField: true }, joiDefaultOption);

export { validate };
