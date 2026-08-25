import React, {useState} from "react";

import './ObjectArrayInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {ObjectArrayInput, SchemaField} from "../../../../components/inputs/object-array-input/ObjectArrayInput";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const DEMO_OBJECT_SCHEMA: SchemaField[] = [
	{key: "name", label: "Name", type: 'input', placeholder: "Ada Lovelace"},
	{key: "email", label: "Email", type: 'input', placeholder: "ada@blueorange.ai"}
];

const DEMO_OBJECT_ARRAY = [
	{name: "Ada Lovelace", email: "ada@blueorange.ai"}
];

const SCHEMA_FIELD_INTERFACE = {
	name: "SchemaField",
	description: "One field of each entry. The schema is what decides how many inputs a row has and what each one edits.",
	props: [
		{name: "key", type: "string", required: true, description: "The key the value is stored under on each object."},
		{name: "label", type: "string", required: true, description: "The label above the field."},
		{name: "type", type: "SchemaFieldType", required: true, description: "What the field edits, which decides the input used for it."},
		{name: "placeholder", type: "string", description: "Shown while that field is empty."},
		{name: "whitelist", type: "string[]", description: "Values offered as suggestions for a tag field."},
		{name: "enforceWhitelist", type: "boolean", description: "Refuses anything that is not on that whitelist."}
	] as Array<PropSpec>
};

const OBJECT_ARRAY_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "Record<string, any>[]",
		default: "[]",
		description: "The entries, each one an object keyed by the schema."
	},
	{
		name: "schema",
		type: "SchemaField[]",
		required: true,
		description: "The fields each entry carries."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Contacts",
		description: "The label above the list."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the list out and stops entries being added or removed."
	},
	{
		name: "onChange",
		type: "(value: Record<string, any>[]) => void",
		description: "Fires with the whole list whenever any field changes."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the list."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	...validationProps("Record<string, any>[]")
];

interface Props {
}

export const ObjectArrayInputDevelopment: React.FC<Props> = ({}) => {

	const personSchema: SchemaField[] = [
		{key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...'},
		{key: 'age', label: 'Age', type: 'number', placeholder: 'Enter age...'},
		{key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Enter bio...'},
		{key: 'skills', label: 'Skills', type: 'tag', placeholder: 'Add skills...'}
	];

	const productSchema: SchemaField[] = [
		{key: 'title', label: 'Product Title', type: 'input', placeholder: 'Enter product title...'},
		{key: 'price', label: 'Price ($)', type: 'number', placeholder: 'Enter price...'},
		{key: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description...'},
		{
			key: 'categories',
			label: 'Categories',
			type: 'tag',
			placeholder: 'Select categories...',
			whitelist: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys'],
			enforceWhitelist: true
		}
	];

	const [people, setPeople] = useState<Record<string, any>[]>([
		{name: 'John Doe', age: 30, bio: 'Software developer', skills: ['React', 'TypeScript']},
		{name: 'Jane Smith', age: 25, bio: 'Designer', skills: ['Figma', 'CSS']}
	]);

	const [products, setProducts] = useState<Record<string, any>[]>([
		{title: 'Laptop', price: 999, description: 'High-performance laptop', categories: ['Electronics']}
	]);

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Object Array Input"
					description="A list of objects rather than values — a row of fields per entry, described by a schema. Useful wherever a form has to collect several of the same thing."
					name="ObjectArrayInput"
					previewHeight={280}
					previewCentered={false}
					imports={["SchemaField"]}
					interfaces={[SCHEMA_FIELD_INTERFACE]}
					props={OBJECT_ARRAY_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "520px"}}>
							<ObjectArrayInput
								value={DEMO_OBJECT_ARRAY}
								schema={DEMO_OBJECT_SCHEMA}
								label={values.label}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></ObjectArrayInput>
						</div>
					)}>
					<div style={{display: "flex", flexDirection: "column", gap: "32px", maxWidth: "500px"}}>
						<ObjectArrayInput
							label="People (Required)"
							schema={personSchema}
							value={people}
							onChange={setPeople}
							required={true}
							help="An array of person objects with name, age, bio and skills"
						/>
						<ObjectArrayInput
							label="Products"
							schema={productSchema}
							value={products}
							onChange={setProducts}
							help="An array of product objects with whitelist for categories"
						/>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						<div style={{marginBottom: "16px"}}>
							<strong>People:</strong>
							<br />
							{JSON.stringify(people, null, 2)}
						</div>
						<div>
							<strong>Products:</strong>
							<br />
							{JSON.stringify(products, null, 2)}
						</div>
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
