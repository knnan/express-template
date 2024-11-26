import httpStatus from "http-status";
import { BaseError } from "./baseError.js";

class ApiError extends BaseError {
	/**
	 * @param {number} httpCode
	 * @param {string|Error} message
	 * @param {boolean} isOperationalError
	 */
	constructor(httpCode = httpStatus.INTERNAL_SERVER_ERROR, message = "Internal Server Error", isOperationalError = true) {
		const errMsg = message instanceof Error ? message.message : String(message);
		super(errMsg, isOperationalError);
		this.httpCode = httpCode;
	}

	static getInstance(statusCode, message) {
		return new this(statusCode, message ?? httpStatus[statusCode]);
	}

	static Continue(errMsg) {
		return ApiError.getInstance(httpStatus.CONTINUE, errMsg);
	}

	static SwitchingProtocols(errMsg) {
		return ApiError.getInstance(httpStatus.SWITCHING_PROTOCOLS, errMsg);
	}

	static Ok(errMsg) {
		return ApiError.getInstance(httpStatus.OK, errMsg);
	}

	static Created(errMsg) {
		return ApiError.getInstance(httpStatus.CREATED, errMsg);
	}

	static Accepted(errMsg) {
		return ApiError.getInstance(httpStatus.ACCEPTED, errMsg);
	}

	static NonAuthoritativeInformation(errMsg) {
		return ApiError.getInstance(httpStatus.NON_AUTHORITATIVE_INFORMATION, errMsg);
	}

	static NoContent(errMsg) {
		return ApiError.getInstance(httpStatus.NO_CONTENT, errMsg);
	}

	static ResetContent(errMsg) {
		return ApiError.getInstance(httpStatus.RESET_CONTENT, errMsg);
	}

	static PartialContent(errMsg) {
		return ApiError.getInstance(httpStatus.PARTIAL_CONTENT, errMsg);
	}

	static MultiStatus(errMsg) {
		return ApiError.getInstance(httpStatus.MULTI_STATUS, errMsg);
	}

	static AlreadyReported(errMsg) {
		return ApiError.getInstance(httpStatus.ALREADY_REPORTED, errMsg);
	}

	static ImUsed(errMsg) {
		return ApiError.getInstance(httpStatus.IM_USED, errMsg);
	}

	static MultipleChoices(errMsg) {
		return ApiError.getInstance(httpStatus.MULTIPLE_CHOICES, errMsg);
	}

	static MovedPermanently(errMsg) {
		return ApiError.getInstance(httpStatus.MOVED_PERMANENTLY, errMsg);
	}

	static Found(errMsg) {
		return ApiError.getInstance(httpStatus.FOUND, errMsg);
	}

	static SeeOther(errMsg) {
		return ApiError.getInstance(httpStatus.SEE_OTHER, errMsg);
	}

	static NotModified(errMsg) {
		return ApiError.getInstance(httpStatus.NOT_MODIFIED, errMsg);
	}

	static UseProxy(errMsg) {
		return ApiError.getInstance(httpStatus.USE_PROXY, errMsg);
	}

	static SwitchProxy(errMsg) {
		return ApiError.getInstance(httpStatus.SWITCH_PROXY, errMsg);
	}

	static TemporaryRedirect(errMsg) {
		return ApiError.getInstance(httpStatus.TEMPORARY_REDIRECT, errMsg);
	}

	static PermanentRedirect(errMsg) {
		return ApiError.getInstance(httpStatus.PERMANENT_REDIRECT, errMsg);
	}

	static BadRequest(errMsg) {
		return ApiError.getInstance(httpStatus.BAD_REQUEST, errMsg);
	}

	static Unauthorized(errMsg) {
		return ApiError.getInstance(httpStatus.UNAUTHORIZED, errMsg);
	}

	static PaymentRequired(errMsg) {
		return ApiError.getInstance(httpStatus.PAYMENT_REQUIRED, errMsg);
	}

	static Forbidden(errMsg) {
		return ApiError.getInstance(httpStatus.FORBIDDEN, errMsg);
	}

	static NotFound(errMsg) {
		return ApiError.getInstance(httpStatus.NOT_FOUND, errMsg);
	}

	static MethodNotAllowed(errMsg) {
		return ApiError.getInstance(httpStatus.METHOD_NOT_ALLOWED, errMsg);
	}

	static NotAcceptable(errMsg) {
		return ApiError.getInstance(httpStatus.NOT_ACCEPTABLE, errMsg);
	}

	static ProxyAuthenticationRequired(errMsg) {
		return ApiError.getInstance(httpStatus.PROXY_AUTHENTICATION_REQUIRED, errMsg);
	}

	static RequestTimeout(errMsg) {
		return ApiError.getInstance(httpStatus.REQUEST_TIMEOUT, errMsg);
	}

	static Conflict(errMsg) {
		return ApiError.getInstance(httpStatus.CONFLICT, errMsg);
	}

	static Gone(errMsg) {
		return ApiError.getInstance(httpStatus.GONE, errMsg);
	}

	static LengthRequired(errMsg) {
		return ApiError.getInstance(httpStatus.LENGTH_REQUIRED, errMsg);
	}

	static PreconditionFailed(errMsg) {
		return ApiError.getInstance(httpStatus.PRECONDITION_FAILED, errMsg);
	}

	static RequestEntityTooLarge(errMsg) {
		return ApiError.getInstance(httpStatus.REQUEST_ENTITY_TOO_LARGE, errMsg);
	}

	static RequestUriTooLong(errMsg) {
		return ApiError.getInstance(httpStatus.REQUEST_URI_TOO_LONG, errMsg);
	}

	static UnsupportedMediaType(errMsg) {
		return ApiError.getInstance(httpStatus.UNSUPPORTED_MEDIA_TYPE, errMsg);
	}

	static RequestedRangeNotSatisfiable(errMsg) {
		return ApiError.getInstance(httpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, errMsg);
	}

	static ExpectationFailed(errMsg) {
		return ApiError.getInstance(httpStatus.EXPECTATION_FAILED, errMsg);
	}

	static ImATeapot(errMsg) {
		return ApiError.getInstance(httpStatus.IM_A_TEAPOT, errMsg);
	}

	static MisdirectedRequest(errMsg) {
		return ApiError.getInstance(httpStatus.MISDIRECTED_REQUEST, errMsg);
	}

	static UnprocessableEntity(errMsg) {
		return ApiError.getInstance(httpStatus.UNPROCESSABLE_ENTITY, errMsg);
	}

	static Locked(errMsg) {
		return ApiError.getInstance(httpStatus.LOCKED, errMsg);
	}

	static FailedDependency(errMsg) {
		return ApiError.getInstance(httpStatus.FAILED_DEPENDENCY, errMsg);
	}

	static TooEarly(errMsg) {
		return ApiError.getInstance(httpStatus.TOO_EARLY, errMsg);
	}

	static UpgradeRequired(errMsg) {
		return ApiError.getInstance(httpStatus.UPGRADE_REQUIRED, errMsg);
	}

	static PreconditionRequired(errMsg) {
		return ApiError.getInstance(httpStatus.PRECONDITION_REQUIRED, errMsg);
	}

	static TooManyRequests(errMsg) {
		return ApiError.getInstance(httpStatus.TOO_MANY_REQUESTS, errMsg);
	}

	static RequestHeaderFieldsTooLarge(errMsg) {
		return ApiError.getInstance(httpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE, errMsg);
	}

	static UnavailableForLegalReasons(errMsg) {
		return ApiError.getInstance(httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS, errMsg);
	}

	static InternalServerError(errMsg) {
		return ApiError.getInstance(httpStatus.INTERNAL_SERVER_ERROR, errMsg);
	}

	static NotImplemented(errMsg) {
		return ApiError.getInstance(httpStatus.NOT_IMPLEMENTED, errMsg);
	}

	static BadGateway(errMsg) {
		return ApiError.getInstance(httpStatus.BAD_GATEWAY, errMsg);
	}

	static ServiceUnavailable(errMsg) {
		return ApiError.getInstance(httpStatus.SERVICE_UNAVAILABLE, errMsg);
	}

	static GatewayTimeout(errMsg) {
		return ApiError.getInstance(httpStatus.GATEWAY_TIMEOUT, errMsg);
	}

	static HttpVersionNotSupported(errMsg) {
		return ApiError.getInstance(httpStatus.HTTP_VERSION_NOT_SUPPORTED, errMsg);
	}

	static VariantAlsoNegotiates(errMsg) {
		return ApiError.getInstance(httpStatus.VARIANT_ALSO_NEGOTIATES, errMsg);
	}

	static InsufficientStorage(errMsg) {
		return ApiError.getInstance(httpStatus.INSUFFICIENT_STORAGE, errMsg);
	}

	static LoopDetected(errMsg) {
		return ApiError.getInstance(httpStatus.LOOP_DETECTED, errMsg);
	}

	static NotExtended(errMsg) {
		return ApiError.getInstance(httpStatus.NOT_EXTENDED, errMsg);
	}

	static NetworkAuthenticationRequired(errMsg) {
		return ApiError.getInstance(httpStatus.NETWORK_AUTHENTICATION_REQUIRED, errMsg);
	}
}

export { ApiError };
