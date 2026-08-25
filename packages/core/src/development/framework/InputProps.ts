import {PropSpec} from "./PropSpec";

/**
 * The props every input in the library shares — how it registers with a
 * FormGroup, and how it validates. They read the same on each one, so they are
 * declared here rather than copied onto every page.
 */
export const validationProps = (valueType: string = "string"): Array<PropSpec> => [
	{
		name: "name",
		type: "string",
		control: "text",
		description: "Registers the input with a surrounding FormGroup under this key, which is what the group reports its value under."
	},
	{
		name: "required",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks the field as one that has to be filled in, and fails validation while it is empty."
	},
	{
		name: "requiredMessage",
		type: "string",
		control: "text",
		description: "Overrides the message shown when a required field is left empty."
	},
	{
		name: "validate",
		type: "InputValidateCallback<" + valueType + ">",
		description: "A check of your own, run on blur. Return an error to fail the field, or nothing to pass it."
	},
	{
		name: "validateOnChange",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Runs that check on every keystroke as well as on blur."
	}
];
