// sum.test.js
import { describe, expect, it } from "vitest";
import { isEmpty } from "../src/utils/empty.js";

describe("isEmpty", () => {
	it("should return true for undefined", () => {
		expect(isEmpty(undefined)).toBe(true);
	});

	it("should return true for null", () => {
		expect(isEmpty(null)).toBe(true);
	});

	it("should return true for NaN", () => {
		expect(isEmpty(NaN)).toBe(true);
	});

	it("should return true for an empty object", () => {
		expect(isEmpty({})).toBe(true);
	});

	it("should return false for a non-empty object", () => {
		expect(isEmpty({ key: "value" })).toBe(false);
	});

	it("should return true for an empty array", () => {
		expect(isEmpty([])).toBe(true);
	});

	it("should return false for a non-empty array", () => {
		expect(isEmpty([1, 2, 3])).toBe(false);
	});

	it("should return true for an empty string", () => {
		expect(isEmpty("")).toBe(true);
	});

	it("should return false for a non-empty string", () => {
		expect(isEmpty("hello")).toBe(false);
	});

	it("should return false for a number (0 is not empty)", () => {
		expect(isEmpty(0)).toBe(false);
	});

	it("should return false for a boolean value (false is not empty)", () => {
		expect(isEmpty(false)).toBe(false);
	});

	it("should return false for a function", () => {
		expect(isEmpty(() => {})).toBe(false);
	});

	it("should throw for an empty Set", () => {
		expect(() => isEmpty(new Set())).toThrowError("doesn't support");
	});

	it("should throw for an non-empty  Set", () => {
		expect(() => isEmpty(new Set([1]))).toThrowError("isEmpty doesn't support Set , Map, RegexExp, Date");
	});

	it("should throw for an empty Map", () => {
		expect(() => isEmpty(new Map())).toThrowError("isEmpty doesn't support Set , Map, RegexExp, Date");
	});

	it("should throw for an empty non-empty Map", () => {
		expect(() => isEmpty(new Map([["key", "value"]]))).toThrowError("isEmpty doesn't support Set , Map, RegexExp, Date");
	});
});
