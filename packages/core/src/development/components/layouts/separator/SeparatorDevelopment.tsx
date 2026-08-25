import React from "react";

import './SeparatorDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Separator, SeparatorOrientation} from "../../../../components/layouts/separator/Separator";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SEPARATOR_PROPS: Array<PropSpec> = [
	{
		name: "orientation",
		type: "SeparatorOrientation",
		default: "SeparatorOrientation.HORIZONTAL",
		defaultValue: SeparatorOrientation.HORIZONTAL,
		control: "select",
		options: [
			{label: "Horizontal", value: SeparatorOrientation.HORIZONTAL, code: "SeparatorOrientation.HORIZONTAL"},
			{label: "Vertical", value: SeparatorOrientation.VERTICAL, code: "SeparatorOrientation.VERTICAL"}
		],
		description: "Which way the line runs. A vertical separator takes its height from whatever it is sitting in."
	},
	{
		name: "children",
		type: "React.ReactNode",
		control: "text",
		hideFromSnippet: true,
		description: "A label rendered in the middle of the line. Horizontal separators only."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the separator."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the separator."
	}
];

interface Props {
}

export const SeparatorDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Separator"
			description="A dividing line between sections, either across or down. A horizontal one can carry a label in the middle of it."
			name="Separator"
			previewHeight={140}
			previewCentered={false}
			props={SEPARATOR_PROPS}
			snippetChildren={values => values.children ? values.children : undefined}
			preview={values => (
				<div style={{
					width: "100%",
					height: values.orientation === SeparatorOrientation.VERTICAL ? "80px" : undefined,
					display: values.orientation === SeparatorOrientation.VERTICAL ? "flex" : undefined
				}}>
					<Separator orientation={values.orientation} classes={values.classes}>
						{values.children ? values.children : undefined}
					</Separator>
				</div>
			)}>

			<GeneralHeading>Horizontal</GeneralHeading>
			<div className="blue-orange-separator-development-block">
				<div className="blue-orange-separator-development-title">Foundations</div>
				<div className="blue-orange-separator-development-subtitle">A React component library.</div>
				<Separator style={{margin: "16px 0"}}></Separator>
				<div className="blue-orange-separator-development-row">
					<span>Docs</span>
					<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
					<span>Source</span>
					<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
					<span>Releases</span>
				</div>
			</div>

			<GeneralHeading>With a label</GeneralHeading>
			<div className="blue-orange-separator-development-block">
				<Separator>or continue with</Separator>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<div className="blue-orange-separator-development-row blue-orange-separator-development-tall">
				<div>Left</div>
				<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
				<div>Middle</div>
				<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
				<div>Right</div>
			</div>
		</ComponentDoc>
	)
}
