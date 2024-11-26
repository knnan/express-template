// import * as luxon from "luxon";
// import { isEmpty } from "../utils/empty.js";
// import { logger } from "../loggers/logger.js";

const validationHelper = {
	// async ridValidate(value, helpers) {
	// 	const currentEpochTime = luxon.DateTime.now().toSeconds();
	// 	const query = SQL`SELECT COUNT(rid) as count FROM pcloud_reservation WHERE pcloud_reservation.rid = ${value} AND pcloud_reservation.etime > ${currentEpochTime}`;
	// 	const [[{ count: result }]] = await pool.query(query);
	// 	if (result === 0) {
	// 		const errcustom = new Error("rid not valid, reservation has expired");
	// 		errcustom.details = [
	// 			{
	// 				message: "rid not valid, reservation has expired",
	// 				context: {
	// 					key: "rid"
	// 				}
	// 			}
	// 		];
	// 		throw errcustom;
	// 	}
	// 	return value;
	// }
	// 	async uid_rid_Validate(value, helpers) {
	// 		const currentEpochTime = luxon.DateTime.now().toSeconds();
	// 		const query = SQL`SELECT rid,uid FROM pcloud_reservation WHERE pcloud_reservation.rid = ${value} AND pcloud_reservation.etime > ${currentEpochTime}`;
	// 		const [[reservationInfo]] = await pool.query(query);
	// 		const userInfo = httpContext.get("userInfo");
	// 		let errorMessage = "";
	// 		if (isEmpty(reservationInfo)) {
	// 			errorMessage = "rid not valid or reservation has expired";
	// 		} else if (reservationInfo?.uid !== userInfo?.uid) {
	// 			errorMessage = "rid not valid, user is different";
	// 		}
	// 		if (!isEmpty(errorMessage)) {
	// 			const errcustom = new Error(errorMessage);
	// 			errcustom.details = [
	// 				{
	// 					message: errorMessage,
	// 					context: {
	// 						key: "rid"
	// 					}
	// 				}
	// 			];
	// 			throw errcustom;
	// 		}
	// 		return value;
	// 	}
};

export { validationHelper };
