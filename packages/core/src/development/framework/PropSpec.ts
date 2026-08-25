import {ReactNode} from "react";

/**
 * The control the playground renders for a prop. Leaving it off documents the
 * prop in the table without putting a knob on it — right for callbacks, nodes
 * and anything a control cannot sensibly produce.
 */
export type PropControlType = "toggle" | "text" | "number" | "select" | "slider" | "color";

export interface PropOption {
	label: string;
	/** The value handed to the preview. */
	value: any;
	/** What the snippet prints — `ButtonType.PRIMARY` rather than the number behind it. */
	code?: string;
}

export interface PropSpec {
	name: string;
	/** The type as it is written in the component's own interface. */
	type: string;
	description?: ReactNode;
	/** Printed in the Default column. Simple literals are also parsed back into a value the snippet compares against. */
	default?: string;
	required?: boolean;
	/** Omit to document the prop without making it interactive. */
	control?: PropControlType;
	/** Where the playground starts. */
	value?: any;
	options?: Array<PropOption>;
	min?: number;
	max?: number;
	step?: number;
	/** The value the snippet leaves the prop out at, when `default` is not a literal it can parse. */
	defaultValue?: any;
	/** Prints the current value in the snippet. Return undefined to leave the prop out. */
	code?: (value: any) => string | undefined;
	/** Keeps a prop out of the generated snippet — for a knob that drives the demo rather than the component. */
	hideFromSnippet?: boolean;
	/** Keeps a knob out of the props table — for a control over the demo rather than the component. */
	hideFromTable?: boolean;
}

/** A second interface worth documenting under the props table — a tab, an item, an option object. */
export interface InterfaceDoc {
	name: string;
	description?: ReactNode;
	props: Array<PropSpec>;
}

/**
 * Reads the Default column back into a value, so a spec only has to write the
 * default once. Anything that is not a plain literal is left alone and can be
 * given explicitly through `defaultValue`.
 */
export const parseDefault = (spec: PropSpec): any => {
	if (spec.defaultValue !== undefined) {
		return spec.defaultValue;
	}
	const text = (spec.default ?? "").trim();
	if (text === "" || text === "undefined" || text === "—" || text === "-") {
		return undefined;
	}
	if (text === "true") {
		return true;
	}
	if (text === "false") {
		return false;
	}
	if (text === "null") {
		return null;
	}
	if (/^-?\d+(\.\d+)?$/.test(text)) {
		return Number(text);
	}
	if (/^["'].*["']$/.test(text)) {
		return text.slice(1, -1);
	}
	return undefined;
}

/** The starting value of the playground — the spec's own value, or the default it documents. */
export const initialValues = (props: Array<PropSpec>): Record<string, any> => {
	const values: Record<string, any> = {};
	props.forEach(spec => {
		values[spec.name] = spec.value !== undefined ? spec.value : parseDefault(spec);
	});
	return values;
}

/** Prints one value the way it would be written in JSX, without the surrounding braces. */
const printValue = (value: any): string => {
	if (typeof value === "string") {
		return JSON.stringify(value);
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return "{" + String(value) + "}";
	}
	if (value === null) {
		return "{null}";
	}
	if (Array.isArray(value) || typeof value === "object") {
		return "{" + JSON.stringify(value) + "}";
	}
	return "{" + String(value) + "}";
}

/** The `name="value"` (or bare `name`) a single prop contributes, or undefined when it is left out. */
export const printProp = (spec: PropSpec, value: any): string | undefined => {
	if (spec.hideFromSnippet) {
		return undefined;
	}
	if (spec.code) {
		const printed = spec.code(value);
		return printed === undefined ? undefined : spec.name + "=" + printed;
	}
	if (value === undefined || value === "") {
		// A required prop the playground has no value for still has to appear, or the
		// snippet would not compile if it were copied out. It stands in as a variable
		// of its own name — `properties={properties}` — which is how it would be
		// written anyway. Children are the exception: they are not an attribute.
		if (spec.required && spec.name !== "children") {
			return spec.name + "={" + spec.name + "}";
		}
		return undefined;
	}
	const fallback = parseDefault(spec);
	if (fallback !== undefined && value === fallback) {
		return undefined;
	}
	if (spec.options) {
		const option = spec.options.find(item => item.value === value);
		if (option && option.code) {
			return spec.name + "={" + option.code + "}";
		}
	}
	if (value === true) {
		return spec.name;
	}
	return spec.name + "=" + printValue(value);
}

/** Every capitalised identifier the snippet reaches for, so the import line can name them. */
const referencedNames = (lines: Array<string>): Array<string> => {
	const names: Array<string> = [];
	lines.forEach(line => {
		const matches = line.match(/\b[A-Z][A-Za-z0-9_]*(?=\.)/g) ?? [];
		matches.forEach(match => {
			if (!names.includes(match)) {
				names.push(match);
			}
		});
	});
	return names;
}

export interface SnippetOptions {
	name: string;
	props: Array<PropSpec>;
	values: Record<string, any>;
	/** Written between the opening and closing tag. */
	children?: string;
	packageName?: string;
	/** Named alongside the component on the import line. */
	imports?: Array<string>;
}

/**
 * Turns the current playground values into the JSX someone would write to get
 * the component they are looking at — only the props that are actually doing
 * something, plus the import line that makes them resolve.
 */
export const generateSnippet = (options: SnippetOptions): string => {
	const printed: Array<string> = [];
	options.props.forEach(spec => {
		const line = printProp(spec, options.values[spec.name]);
		if (line !== undefined) {
			printed.push(line);
		}
	});
	const children = options.children;
	const imports = [options.name]
		.concat(options.imports ?? [])
		.concat(referencedNames(printed.concat(children ? [children] : [])))
		.filter((name, index, all) => all.indexOf(name) === index);
	const importLine = "import {" + imports.join(", ") + "} from \"" + (options.packageName ?? "@blue-orange-ai/foundations-core") + "\";";

	const indent = (text: string, by: string): string => text.split("\n").map(line => line === "" ? line : by + line).join("\n");

	var element: string;
	if (printed.length <= 2 && !children) {
		element = "<" + options.name + (printed.length ? " " + printed.join(" ") : "") + "></" + options.name + ">";
	} else if (printed.length <= 2 && children) {
		element = "<" + options.name + (printed.length ? " " + printed.join(" ") : "") + ">\n"
			+ indent(children, "\t") + "\n"
			+ "</" + options.name + ">";
	} else {
		element = "<" + options.name + "\n"
			+ indent(printed.join("\n"), "\t") + ">"
			+ (children ? "\n" + indent(children, "\t") + "\n" : "")
			+ "</" + options.name + ">";
	}
	return importLine + "\n\n" + element;
}
