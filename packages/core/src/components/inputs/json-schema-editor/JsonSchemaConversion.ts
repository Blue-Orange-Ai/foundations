import {JsonSchemaField, JsonSchemaFieldType} from "./JsonSchemaTypes";

/**
 * A JSON Schema document, or the fragment describing one property of one.
 */
export interface JsonSchemaDocument {
	[key: string]: any;
}

/**
 * How each Java type is written out as JSON Schema. Read in reverse when a
 * document is loaded back into the editor: an exact type + format match first,
 * then the first entry for the type alone — so a bare `integer` reads as an
 * Integer and a bare `number` as a Double.
 */
const TYPE_MAPPING: Array<{type: JsonSchemaFieldType, schema: JsonSchemaDocument}> = [
	{type: JsonSchemaFieldType.STRING, schema: {type: "string"}},
	{type: JsonSchemaFieldType.BOOLEAN, schema: {type: "boolean"}},
	{type: JsonSchemaFieldType.INTEGER, schema: {type: "integer", format: "int32"}},
	{type: JsonSchemaFieldType.LONG, schema: {type: "integer", format: "int64"}},
	{type: JsonSchemaFieldType.DOUBLE, schema: {type: "number", format: "double"}},
	{type: JsonSchemaFieldType.FLOAT, schema: {type: "number", format: "float"}},
	{type: JsonSchemaFieldType.BIG_DECIMAL, schema: {type: "number", format: "decimal"}},
	{type: JsonSchemaFieldType.DATE, schema: {type: "string", format: "date"}},
	{type: JsonSchemaFieldType.DATE_TIME, schema: {type: "string", format: "date-time"}},
	{type: JsonSchemaFieldType.UUID, schema: {type: "string", format: "uuid"}}
];

const toPropertySchema = (field: JsonSchemaField): JsonSchemaDocument => {
	if (field.type === JsonSchemaFieldType.OBJECT) {
		return toJsonSchema(field.fields ?? []);
	}
	const mapping = TYPE_MAPPING.find(item => item.type === field.type);
	return {...(mapping ? mapping.schema : {type: "string"})};
};

/**
 * Writes a list of edited fields out as a JSON Schema object document. Fields
 * left unnamed are skipped, so a half-finished row never lands in the output.
 */
export const toJsonSchema = (fields: JsonSchemaField[]): JsonSchemaDocument => {
	const properties: JsonSchemaDocument = {};
	fields.forEach(field => {
		const key = field.key.trim();
		if (key.length === 0) {
			return;
		}
		const property = toPropertySchema(field);
		properties[key] = field.array ? {type: "array", items: property} : property;
	});
	return {type: "object", properties: properties};
};

const fromPropertySchema = (key: string, property: JsonSchemaDocument): JsonSchemaField => {
	if (property && property.type === "array") {
		const field = fromPropertySchema(key, property.items ?? {});
		return {...field, array: true};
	}
	if (property && property.type === "object") {
		return {key: key, type: JsonSchemaFieldType.OBJECT, array: false, fields: fromJsonSchema(property)};
	}
	const exact = TYPE_MAPPING.find(item =>
		item.schema.type === property?.type && item.schema.format === property?.format);
	if (exact) {
		return {key: key, type: exact.type, array: false};
	}
	// an unrecognised format still names a type — fall back to the unformatted one
	const loose = TYPE_MAPPING.find(item => item.schema.type === property?.type);
	return {key: key, type: loose ? loose.type : JsonSchemaFieldType.STRING, array: false};
};

/**
 * Reads a JSON Schema object document back into the fields the editor works
 * with. Anything the mapping does not recognise is read as a String.
 */
export const fromJsonSchema = (schema: JsonSchemaDocument): JsonSchemaField[] => {
	const properties = schema?.properties ?? {};
	return Object.keys(properties).map(key => fromPropertySchema(key, properties[key]));
};
