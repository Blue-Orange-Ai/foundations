import React, {useState} from "react";

import './LoadingDevelopment.css'
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../components/text-decorations/paragraph/Paragraph";
import {Loading} from "../../../components/loading/loading/Loading";
import {Skeleton} from "../../../components/loading/skeleton/Skeleton";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {CodeBlock} from "../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const LOADING_PROPS: Array<PropSpec> = [
	{
		name: "fontSize",
		type: "string",
		required: true,
		control: "select",
		value: "2rem",
		options: [
			{label: "1rem", value: "1rem"},
			{label: "1.5rem", value: "1.5rem"},
			{label: "2rem", value: "2rem"},
			{label: "3rem", value: "3rem"}
		],
		description: "The size of the spinner, as a CSS font size — the glyph is a font icon."
	},
	{
		name: "color",
		type: "string",
		required: true,
		control: "color",
		value: "#7c4dff",
		description: "The colour of the spinner."
	}
];

const SKELETON_PROPS: Array<PropSpec> = [
	{
		name: "animationDuration",
		type: "number",
		control: "number",
		description: "How long one pass of the shimmer takes."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the block. This is where its height and width come from."
	},
	{
		name: "height",
		type: "number",
		control: "slider",
		min: 8,
		max: 48,
		step: 2,
		value: 14,
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — the height handed to each block through style."
	}
];

interface Props {
}

const USAGE = `// A spinner, sized and coloured by its props
<Loading fontSize="1.5rem" color="dodgerblue"></Loading>

// A placeholder block while content loads
<Skeleton style={{height: "16px", width: "220px"}}></Skeleton>

// Buttons carry their own spinner
<Button text="Save" buttonType={ButtonType.PRIMARY} isLoading={true}></Button>`;

export const LoadingDevelopment: React.FC<Props> = ({}) => {

	const [loaded, setLoaded] = useState(false);

	return (
		<ComponentDoc
			title="Loading"
			description="Loading is a spinner sized and coloured through its props. Skeleton is a shimmering placeholder that fills whatever box it is given — size it with style, and use as many as the real content will occupy."
			name="Loading"
			previewHeight={140}
			props={LOADING_PROPS}
			preview={values => (
				<Loading fontSize={values.fontSize} color={values.color}></Loading>
			)}
			siblings={[
				{
					name: "Skeleton",
					description: "A shimmering block standing in for content that has not arrived. It has no size of its own, so give it one through style.",
					props: SKELETON_PROPS,
					previewHeight: 160,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%", display: "flex", flexDirection: "column", gap: "8px"}}>
							<Skeleton style={{height: values.height + "px", width: "60%", borderRadius: "4px"}}></Skeleton>
							<Skeleton style={{height: values.height + "px", width: "90%", borderRadius: "4px"}}></Skeleton>
							<Skeleton style={{height: values.height + "px", width: "75%", borderRadius: "4px"}}></Skeleton>
						</div>
					)
				}
			]}>

			<div className="loading-dev-section">
				<FormHeading label="Spinner sizes"></FormHeading>
				<div className="loading-dev-row">
					<Loading fontSize="1rem" color="inherit"></Loading>
					<Loading fontSize="1.5rem" color="inherit"></Loading>
					<Loading fontSize="2.5rem" color="inherit"></Loading>
					<Loading fontSize="2.5rem" color="dodgerblue"></Loading>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Inside a button"></FormHeading>
				<div className="loading-dev-row">
					<Button text="Saving" buttonType={ButtonType.PRIMARY} isLoading={true}></Button>
					<Button text="Saving" buttonType={ButtonType.SECONDARY} isLoading={true}></Button>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Skeleton shapes"></FormHeading>
				<div className="loading-dev-skeletons">
					<Skeleton style={{height: "40px", width: "40px", borderRadius: "50%"}}></Skeleton>
					<div className="loading-dev-skeleton-lines">
						<Skeleton style={{height: "12px", width: "220px"}}></Skeleton>
						<Skeleton style={{height: "12px", width: "160px"}}></Skeleton>
						<Skeleton style={{height: "12px", width: "260px"}}></Skeleton>
					</div>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Standing in for real content"></FormHeading>
				<div className="loading-dev-card">
					{!loaded &&
						<>
							<Skeleton style={{height: "18px", width: "180px", marginBottom: "10px"}}></Skeleton>
							<Skeleton style={{height: "12px", width: "100%", marginBottom: "6px"}}></Skeleton>
							<Skeleton style={{height: "12px", width: "80%"}}></Skeleton>
						</>
					}
					{loaded &&
						<>
							<div className="loading-dev-card-title">Quarterly revenue</div>
							<Paragraph>
								Loaded content replaces the placeholders without the card changing size.
							</Paragraph>
						</>
					}
				</div>
				<div className="loading-dev-row">
					<Button
						text={loaded ? "Show placeholders" : "Show content"}
						buttonType={ButtonType.SECONDARY}
						onClick={() => setLoaded(!loaded)}></Button>
				</div>
			</div>

			<div className="loading-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
