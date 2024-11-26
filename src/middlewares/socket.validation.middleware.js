import { isEmpty } from "../utils/empty.js";
import { socketIoValidation } from "../validations/socketio.validation.js";

const validateSchema = (schema, data) => {
	const { error, value } = schema.validate(data, {
		abortEarly: false,
		allowUnknown: true, // ignore unknown props
		convert: false // disable type coercion
	});
	return {
		isOk: isEmpty(error),
		value,
		error: error?.message
	};
};

export const socketValidate = (packet, next) => {
	const [eventName, data, ack] = packet;
	if (socketIoValidation[eventName]) {
		const { isOk, error } = validateSchema(socketIoValidation[eventName].schema, data);
		if (isOk) {
			next();
		} else {
			ack({ ok: false, err: error });
		}
	} else {
		next();
	}
};
