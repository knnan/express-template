function isObjectEmpty(value) {
	if (value instanceof Set || value instanceof Map || value instanceof RegExp || value instanceof Date) {
		throw new Error("isEmpty doesn't support Set , Map, RegexExp, Date");
	}
	return typeof value === "object" && Object.keys(value).length === 0;
}
export const isEmpty = (value) =>
	value === undefined || value === null || Number.isNaN(value) || (typeof value === "string" && value === "") || (Array.isArray(value) && value.length === 0) || isObjectEmpty(value);

export const isNotEmpty = (value) => !isEmpty(value);
export const isAnyEmpty = (paramsArr) => isEmpty(paramsArr) || paramsArr.some(isEmpty);
export const isAllEmpty = (paramsArr) => isEmpty(paramsArr) || paramsArr.every(isEmpty);
