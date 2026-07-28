import React from "react";

import './MediaDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../components/text-decorations/paragraph/Paragraph";
import {Image} from "../../../components/media/image/Image";
import {RenderMedia} from "../../../components/media/default/RenderMedia";
import {CodeBlock} from "../../../components/text-decorations/code-block/CodeBlock";

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
		<PaddedPage>
			<PageHeading>Media</PageHeading>
			<Paragraph>
				Image renders a url with the library's sizing, fit and shadow options. RenderMedia takes a Media object
				from the media service and picks the renderer for it. Pdf embeds a document with its own viewer — it
				needs a real file to point at, so it is only shown as usage here.
			</Paragraph>

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
		</PaddedPage>
	)
}
