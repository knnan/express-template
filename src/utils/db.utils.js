import { pgp } from "../configs/db.config.js";

const whereFormat = (obj, isAnd = true, isSelect = false) => {
	try {
		const count = Object.keys(obj).filter((k) => obj[k] !== undefined && obj[k] !== null).length;
		if (isSelect && count === 0) {
			return "WHERE 1 = 1";
		}
		if (count === 0) {
			return "WHERE 0 = 1";
		}
		// count = is_select ? 1 : count
		let conditions = "";
		if (isAnd) {
			conditions = Object.keys(obj)
				.filter((k) => obj[k] !== undefined && obj[k] !== null)
				.map((key) => pgp.as.format("$1:name = $2", [key, obj[key]]))
				.join(" AND ");
		} else {
			conditions = Object.keys(obj)
				.filter((k) => obj[k] !== undefined && obj[k] !== null)
				.map((key) => pgp.as.format("$1:name = $2", [key, obj[key]]))
				.join(" OR ");
		}
		conditions = conditions && ` WHERE ${conditions}`;

		return conditions;
	} catch (error) {
		throw error;
	}
};
const whereFilter = ({ filters: obj = {}, isAnd = true, isSelect = false }) => {
	try {
		const count = Object.keys(obj).filter((k) => obj[k] !== undefined && obj[k] !== null).length;
		if (isSelect && count === 0) {
			return "WHERE 1 = 1";
		}
		if (count === 0) {
			return "WHERE 0 = 1";
		}
		// count = is_select ? 1 : count
		let conditions = "";
		if (isAnd) {
			conditions = Object.keys(obj)
				.filter((k) => obj[k] !== undefined && obj[k] !== null)
				.map((key) => pgp.as.format("$1:alias = $2", [key, obj[key]]))
				.join(" AND ");
		} else {
			conditions = Object.keys(obj)
				.filter((k) => obj[k] !== undefined && obj[k] !== null)
				.map((key) => pgp.as.format("$1:alias = $2", [key, obj[key]]))
				.join(" OR ");
		}
		conditions = conditions && ` WHERE ${conditions}`;

		return conditions;
	} catch (error) {
		throw error;
	}
};
const skipWhenEmpty = (column) => {
	const rule = {
		name: column,
		skip: (c) => c.value === null || c.value === undefined || !c.exists
	};
	return rule;
};
const timequery = ({ column, from, to }) => ({
	rawType: true,
	toPostgres: () => pgp.as.format(` ${from && to ? "AND $(column:alias) >= $(from) AND $(column:alias) <= $(to)" : ""}`, { column, from, to })
});

export { whereFilter, whereFormat, skipWhenEmpty, timequery };
