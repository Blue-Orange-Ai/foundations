import React, {useState} from "react";

import './ObjectArrayInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {ObjectArrayInput, SchemaField} from "../../../../components/inputs/object-array-input/ObjectArrayInput";

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
				<PaddedPage>
					<PageHeading>Object Array Input Editor</PageHeading>
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
				</PaddedPage>
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
