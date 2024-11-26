/**
 * @template {object} T
 * @param {T} obj
 * @returns {Readonly<T>}
 * @example signature:
 * function deepFreeze<T>(data: T): Readonly<T>
 */
export function deepFreeze(obj) {
	// Retrieve the property names defined on obj
	const propNames = Reflect.ownKeys(obj);
	// Freeze properties before freezing self
	for (const name of propNames) {
		const value = obj[name];
		if ((value && typeof value === "object") || typeof value === "function") {
			deepFreeze(value);
		}
	}
	return Object.freeze(obj);
}
