import {JsonSchemaField, JsonSchemaFieldType} from "./JsonSchemaTypes";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;

/** Beyond this an integer no longer fits a Java Integer. */
const INTEGER_LIMIT = 2147483647;

const inferStringType = (value: string): JsonSchemaFieldType => {
	const trimmed = value.trim();
	if (UUID_PATTERN.test(trimmed)) {
		return JsonSchemaFieldType.UUID;
	}
	if (DATE_PATTERN.test(trimmed) && !isNaN(Date.parse(trimmed))) {
		return JsonSchemaFieldType.DATE;
	}
	if (DATE_TIME_PATTERN.test(trimmed) && !isNaN(Date.parse(trimmed))) {
		return JsonSchemaFieldType.DATE_TIME;
	}
	return JsonSchemaFieldType.STRING;
};

const inferNumberType = (value: number): JsonSchemaFieldType => {
	if (!Number.isInteger(value)) {
		return JsonSchemaFieldType.DOUBLE;
	}
	return Math.abs(value) > INTEGER_LIMIT ? JsonSchemaFieldType.LONG : JsonSchemaFieldType.INTEGER;
};

const isObject = (value: any): boolean => {
	return value !== null && typeof value === "object" && !Array.isArray(value);
};

/**
 * The members of an array are read together rather than one at a time, so a list
 * whose first entry happens to be null, or which omits an optional field, still
 * describes every field the list actually carries.
 */
const mergeArrayMembers = (values: any[]): any => {
	const populated = values.filter(value => value !== null && value !== undefined);
	if (populated.length === 0) {
		return null;
	}
	if (!populated.every(value => isObject(value))) {
		return populated[0];
	}
	const merged: Record<string, any> = {};
	populated.forEach(value => {
		Object.keys(value).forEach(key => {
			// the first entry that actually holds a value decides the type
			if (merged[key] === undefined || merged[key] === null) {
				merged[key] = value[key];
			}
		});
	});
	return merged;
};

const inferField = (key: string, value: any): JsonSchemaField => {
	if (Array.isArray(value)) {
		// a list of lists cannot be described by one field, so the inner type is used
		const field = inferField(key, mergeArrayMembers(value));
		return {...field, array: true};
	}
	if (isObject(value)) {
		return {key: key, type: JsonSchemaFieldType.OBJECT, array: false, fields: inferFields(value)};
	}
	if (typeof value === "boolean") {
		return {key: key, type: JsonSchemaFieldType.BOOLEAN, array: false};
	}
	if (typeof value === "number" && !isNaN(value)) {
		return {key: key, type: inferNumberType(value), array: false};
	}
	if (typeof value === "string") {
		return {key: key, type: inferStringType(value), array: false};
	}
	// null, undefined and anything else say nothing about the type
	return {key: key, type: JsonSchemaFieldType.STRING, array: false};
};

const inferFields = (value: Record<string, any>): JsonSchemaField[] => {
	return Object.keys(value).map(key => inferField(key, value[key]));
};

/**
 * Reads the shape of an example JSON value as a field tree.
 *
 * An array is read from all of its members merged together, so the example can
 * be either a single object or a list of them. Returns undefined when the value
 * is not an object — a bare string or number describes no fields.
 */
export const inferJsonSchemaFields = (value: any): JsonSchemaField[] | undefined => {
	const example = Array.isArray(value) ? mergeArrayMembers(value) : value;
	if (!isObject(example)) {
		return undefined;
	}
	return inferFields(example);
};
