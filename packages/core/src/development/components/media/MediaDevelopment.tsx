import React from "react";

import './MediaDevelopment.css'
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../components/text-decorations/paragraph/Paragraph";
import {Image} from "../../../components/media/image/Image";
import {RenderMedia} from "../../../components/media/default/RenderMedia";
import {CodeBlock} from "../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";
import {Pdf} from "../../../components/media/pdf/Pdf";

const DEMO_MEDIA = {
	uuid: "sample-media",
	filename: "sample.svg",
	folder: "",
	bucketname: "",
	location: "",
	mediaType: "image",
	dateCreated: new Date(),
	url: "",
	mediaPublic: true,
	fragments: []
};

const FIT_OPTIONS = [
	{label: "cover", value: "cover"},
	{label: "contain", value: "contain"},
	{label: "fill", value: "fill"},
	{label: "none", value: "none"}
];

const IMAGE_PROPS: Array<PropSpec> = [
	{
		name: "src",
		type: "string",
		required: true,
		description: "Where the picture comes from."
	},
	{
		name: "alt",
		type: "string",
		required: true,
		control: "text",
		value: "Melbourne Depot",
		description: "What the picture shows, for anyone who cannot see it."
	},
	{
		name: "height",
		type: "number",
		control: "slider",
		min: 40,
		max: 320,
		step: 10,
		value: 120,
		description: "Height in pixels."
	},
	{
		name: "width",
		type: "number",
		control: "slider",
		min: 40,
		max: 320,
		step: 10,
		value: 180,
		description: "Width in pixels."
	},
	{
		name: "borderRadius",
		type: "string",
		control: "select",
		options: [
			{label: "None", value: ""},
			{label: "4px", value: "4px"},
			{label: "8px", value: "8px"},
			{label: "50%", value: "50%"}
		],
		description: "Corner radius. 50% makes a round picture."
	},
	{
		name: "fit",
		type: "string",
		control: "select",
		options: FIT_OPTIONS,
		description: "The CSS object-fit — how the picture fills the box it is given."
	},
	{
		name: "shadow",
		type: "boolean",
		control: "toggle",
		description: "Lifts the picture off the page with a shadow."
	},
	{
		name: "loading",
		type: "boolean",
		control: "toggle",
		description: "Shows a placeholder in place of the picture while it is on its way."
	}
];

const RENDER_MEDIA_PROPS: Array<PropSpec> = [
	{
		name: "media",
		type: "Media",
		required: true,
		description: "The media object from the service. Its type decides which renderer is used."
	},
	{
		name: "height",
		type: "number",
		control: "slider",
		min: 40,
		max: 320,
		step: 10,
		value: 120,
		description: "Height in pixels."
	},
	{
		name: "width",
		type: "number",
		control: "slider",
		min: 40,
		max: 320,
		step: 10,
		value: 180,
		description: "Width in pixels."
	},
	{
		name: "borderRadius",
		type: "string",
		control: "select",
		options: [
			{label: "None", value: ""},
			{label: "4px", value: "4px"},
			{label: "8px", value: "8px"},
			{label: "50%", value: "50%"}
		],
		description: "Corner radius."
	},
	{
		name: "fit",
		type: "string",
		control: "select",
		options: FIT_OPTIONS,
		description: "The CSS object-fit."
	},
	{
		name: "shadow",
		type: "boolean",
		control: "toggle",
		description: "Lifts the media off the page with a shadow."
	}
];

const PDF_PROPS: Array<PropSpec> = [
	{
		name: "src",
		type: "string",
		required: true,
		control: "text",
		value: "/documents/run-sheet.pdf",
		description: "Where the document is."
	}
];

interface Props {
}

// Inline so the page works with no network and no media server behind it.
const SAMPLE = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2196F3"/>
      <stop offset="100%" stop-color="#7c4dff"/>
    </linearGradient>
  </defs>
  <rect width="240" height="160" fill="url(#g)"/>
  <circle cx="72" cy="60" r="26" fill="rgba(255,255,255,0.85)"/>
  <path d="M0 160 L88 84 L152 132 L196 104 L240 140 L240 160 Z" fill="rgba(255,255,255,0.45)"/>
</svg>`);

const USAGE = `// A plain image with the library's sizing and loading behaviour
<Image src={url} alt="Chart preview" width={240} height={160} borderRadius="4px" shadow={true}></Image>

// A Media object from the media service — RenderMedia picks the right renderer
<RenderMedia media={media} width={240} height={160} borderRadius="4px"></RenderMedia>

// A pdf, embedded with its own viewer
<Pdf src="https://files.company.com/report.pdf"></Pdf>`;

export const MediaDevelopment: React.FC<Props> = ({}) => {

	const media = {
		uuid: "sample-media",
		mediaType: "image",
		location: SAMPLE,
		filename: "sample.svg",
		folder: "",
		bucketname: ""
	} as any;

	return (
		<ComponentDoc
			title="Media"
			description="Image renders a url with the library's sizing, fit and shadow options. RenderMedia takes a Media object from the media service and picks the renderer for it. Pdf embeds a document with a viewer of its own."
			name="Image"
			previewHeight={220}
			props={IMAGE_PROPS}
			preview={values => (
				<Image
					src={SAMPLE}
					alt={values.alt}
					height={values.height}
					width={values.width}
					borderRadius={values.borderRadius}
					fit={values.fit}
					shadow={values.shadow}
					loading={values.loading}></Image>
			)}
			siblings={[
				{
					name: "RenderMedia",
					description: "Takes a Media object rather than a url, resolves it through the media service configured by BlueOrangeMediaConfig, and picks the renderer its type calls for.",
					props: RENDER_MEDIA_PROPS,
					previewHeight: 220,
					preview: values => (
						<RenderMedia
							media={DEMO_MEDIA}
							height={values.height}
							width={values.width}
							borderRadius={values.borderRadius}
							fit={values.fit}
							shadow={values.shadow}></RenderMedia>
					)
				},
				{
					name: "Pdf",
					description: "Embeds a PDF with its own viewer. It needs a real document to point at, so there is nothing to render here — the usage below is the whole of it.",
					props: PDF_PROPS,
					previewHeight: 120,
					preview: () => (
						<span style={{opacity: 0.7, fontSize: "0.875rem"}}>
							A Pdf needs a real document behind it, so it is only shown as usage.
						</span>
					)
				}
			]}>

			<div className="media-dev-section">
				<FormHeading label="Image sizes and radii"></FormHeading>
				<div className="media-dev-row">
					<Image src={SAMPLE} alt="Sample" width={120} height={80}></Image>
					<Image src={SAMPLE} alt="Sample" width={180} height={120} borderRadius="8px"></Image>
					<Image src={SAMPLE} alt="Sample" width={80} height={80} borderRadius="50%" fit="cover"></Image>
				</div>
			</div>

			<div className="media-dev-section">
				<FormHeading label="With a shadow"></FormHeading>
				<div className="media-dev-row">
					<Image src={SAMPLE} alt="Sample" width={240} height={160} borderRadius="4px"
						   shadow={true}></Image>
				</div>
			</div>

			<div className="media-dev-section">
				<FormHeading label="Loading state"></FormHeading>
				<div className="media-dev-row">
					<Image src={SAMPLE} alt="Sample" width={240} height={160} borderRadius="4px"
						   loading={true}></Image>
				</div>
			</div>

			<div className="media-dev-section">
				<FormHeading label="RenderMedia"></FormHeading>
				<Paragraph>
					RenderMedia resolves its url through the media service configured by BlueOrangeMediaConfig, so
					these two stay empty until this dev app is pointed at one.
				</Paragraph>
				<div className="media-dev-row">
					<RenderMedia media={media} width={240} height={160} borderRadius="4px"></RenderMedia>
					<RenderMedia media={media} width={64} height={64} borderRadius="50%"></RenderMedia>
				</div>
			</div>

			<div className="media-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
