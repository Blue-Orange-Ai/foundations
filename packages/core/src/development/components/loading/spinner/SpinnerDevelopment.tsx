import React from "react";

import './SpinnerDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Spinner, SpinnerSize} from "../../../../components/loading/spinner/Spinner";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SPINNER_PROPS: Array<PropSpec> = [
	{
		name: "size",
		type: "SpinnerSize",
		default: "SpinnerSize.MEDIUM",
		defaultValue: SpinnerSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: SpinnerSize.SMALL, code: "SpinnerSize.SMALL"},
			{label: "Medium", value: SpinnerSize.MEDIUM, code: "SpinnerSize.MEDIUM"},
			{label: "Large", value: SpinnerSize.LARGE, code: "SpinnerSize.LARGE"}
		],
		description: "One of the three size variants."
	},
	{
		name: "fontSize",
		type: "string",
		control: "text",
		description: "Overrides the size variant with an explicit CSS font size, such as \"2rem\"."
	},
	{
		name: "color",
		type: "string",
		control: "color",
		description: "Overrides the themed spinner colour."
	},
	{
		name: "icon",
		type: "string",
		default: "\"ri-loader-4-line\"",
		control: "text",
		description: "Any remixicon class can be spun."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Loading runs…",
		description: "Rendered next to the spinner, and used as its accessible label."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the spinner."
	}
];

interface Props {
}

export const SpinnerDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Spinner"
			description="An indeterminate loading indicator. It picks up the theme, comes in three sizes and can carry a label — which is also what a screen reader announces it as."
			name="Spinner"
			previewHeight={140}
			props={SPINNER_PROPS}
			preview={values => (
				<Spinner
					size={values.size}
					fontSize={values.fontSize}
					color={values.color}
					icon={values.icon}
					label={values.label}></Spinner>
			)}>

			<GeneralHeading>Sizes</GeneralHeading>
			<div className="blue-orange-spinner-development-row">
				<Spinner size={SpinnerSize.SMALL}></Spinner>
				<Spinner size={SpinnerSize.MEDIUM}></Spinner>
				<Spinner size={SpinnerSize.LARGE}></Spinner>
			</div>

			<GeneralHeading>With a label</GeneralHeading>
			<div className="blue-orange-spinner-development-row">
				<Spinner label="Loading results"></Spinner>
			</div>

			<GeneralHeading>Custom colour and size</GeneralHeading>
			<div className="blue-orange-spinner-development-row">
				<Spinner color="dodgerblue" fontSize="1.5rem"></Spinner>
				<Spinner color="#16a34b" fontSize="1.5rem"></Spinner>
				<Spinner color="#e11d48" fontSize="1.5rem"></Spinner>
			</div>

			<GeneralHeading>Alternative icons</GeneralHeading>
			<Description>Any remixicon class can be spun.</Description>
			<div className="blue-orange-spinner-development-row">
				<Spinner icon="ri-loader-2-line"></Spinner>
				<Spinner icon="ri-loader-5-line"></Spinner>
				<Spinner icon="ri-refresh-line"></Spinner>
			</div>
		</ComponentDoc>
	)
}
