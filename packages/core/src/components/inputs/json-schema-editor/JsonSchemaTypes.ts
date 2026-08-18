/**
 * The types a schema field can take, named after the Java types they map onto.
 *
 * A field is described by a type plus an `array` flag rather than by a separate
 * "array of x" type, so switching a field between one value and many never
 * loses the type that was already chosen.
 */
export enum JsonSchemaFieldType {
	STRING = "STRING",
	BOOLEAN = "BOOLEAN",
	INTEGER = "INTEGER",
	LONG = "LONG",
	FLOAT = "FLOAT",
	DOUBLE = "DOUBLE",
	BIG_DECIMAL = "BIG_DECIMAL",
	DATE = "DATE",
	DATE_TIME = "DATE_TIME",
	UUID = "UUID",
	/** A nested struct — its members live in `fields`. */
	OBJECT = "OBJECT"
}

export interface JsonSchemaField {
	/**
	 * Identity of the row while it is being edited. The editor fills this in for
	 * any field that arrives without one, so callers never have to supply it.
	 */
	id?: string;
	key: string;
	type: JsonSchemaFieldType;
	/** The field holds a list of its type rather than a single value. */
	array: boolean;
	/** The members of a struct. Only read when `type` is OBJECT. */
	fields?: JsonSchemaField[];
}

export interface JsonSchemaTypeDescriptor {
	type: JsonSchemaFieldType;
	/** How the type is named in the dropdown. */
	label: string;
	/** A remixicon class. */
	icon: string;
	/** The Java type this maps onto. */
	javaType: string;
}

/**
 * The types offered by the editor, in the order they are listed.
 */
export const JSON_SCHEMA_TYPES: JsonSchemaTypeDescriptor[] = [
	{type: JsonSchemaFieldType.STRING, label: "String", icon: "ri-paragraph", javaType: "String"},
	{type: JsonSchemaFieldType.BOOLEAN, label: "Boolean", icon: "ri-toggle-line", javaType: "Boolean"},
	{type: JsonSchemaFieldType.INTEGER, label: "Integer", icon: "ri-hashtag", javaType: "Integer"},
	{type: JsonSchemaFieldType.LONG, label: "Long", icon: "ri-hashtag", javaType: "Long"},
	{type: JsonSchemaFieldType.FLOAT, label: "Float", icon: "ri-hashtag", javaType: "Float"},
	{type: JsonSchemaFieldType.DOUBLE, label: "Double", icon: "ri-hashtag", javaType: "Double"},
	{type: JsonSchemaFieldType.BIG_DECIMAL, label: "BigDecimal", icon: "ri-money-dollar-circle-line", javaType: "BigDecimal"},
	{type: JsonSchemaFieldType.DATE, label: "Date", icon: "ri-calendar-line", javaType: "LocalDate"},
	{type: JsonSchemaFieldType.DATE_TIME, label: "DateTime", icon: "ri-calendar-schedule-line", javaType: "Instant"},
	{type: JsonSchemaFieldType.UUID, label: "UUID", icon: "ri-fingerprint-line", javaType: "UUID"},
	{type: JsonSchemaFieldType.OBJECT, label: "Struct", icon: "ri-braces-line", javaType: "Object"}
];

export const getJsonSchemaTypeDescriptor = (type: JsonSchemaFieldType): JsonSchemaTypeDescriptor => {
	const descriptor = JSON_SCHEMA_TYPES.find(item => item.type === type);
	if (descriptor) {
		return descriptor;
	}
	return JSON_SCHEMA_TYPES[0];
};

/** A struct is the only type that can hold fields of its own. */
export const isJsonSchemaStruct = (field: JsonSchemaField): boolean => {
	return field.type === JsonSchemaFieldType.OBJECT;
};
