import React, {useState} from "react";

import './EmojiInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {EmojiWrapper} from "../../../../components/inputs/emoji/emoji-wrapper/EmojiWrapper";
import {RenderHtml} from "../../../../components/text-decorations/render-html/RenderHtml";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {EmojiContainer} from "../../../../components/inputs/emoji/emoji-container/EmojiContainer";


const EMOJI_WRAPPER_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "Whatever should open the picker. It is positioned against this."
	},
	{
		name: "onSelection",
		type: "(emoji: string) => void",
		description: "Fires with the chosen emoji as an HTML entity, ready to be dropped into content."
	}
];

const EMOJI_CONTAINER_PROPS: Array<PropSpec> = [
	{
		name: "onSelection",
		type: "(emoji: EmojiObj) => void",
		description: "Fires with the whole emoji object — its html, its name and whether it takes a skin tone."
	}
];

interface Props {
}

export const EmojiInputDevelopment: React.FC<Props> = ({}) => {

	const initialEmojiObject: string = "&#x1F600;"

	const [query, setQuery] = useState<string>(initialEmojiObject);


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Emoji Input"
					description="The emoji picker. EmojiWrapper turns whatever it wraps into the trigger and reports the chosen glyph as HTML; EmojiContainer is the picker itself, for putting inside something that already opens."
					name="EmojiWrapper"
					previewHeight={180}
					props={EMOJI_WRAPPER_PROPS}
					snippetChildren={() => "<ButtonIcon icon={\"ri-emotion-happy-line\"} label={\"Add an emoji\"}></ButtonIcon>"}
					preview={values => (
						<EmojiWrapper onSelection={() => {}}>
							<div className="workspace-emoji-development">
								<i className="ri-emotion-happy-line"></i>
							</div>
						</EmojiWrapper>
					)}
					siblings={[
						{
							name: "EmojiContainer",
							description: "The picker on its own — the search, the category rail, the grid and the footer that names whatever the pointer is over.",
							props: EMOJI_CONTAINER_PROPS,
							previewHeight: 440,
							preview: () => (
								<EmojiContainer onSelection={() => {}}></EmojiContainer>
							)
						}
					]}>
					<EmojiWrapper onSelection={setQuery}>
						<div className="workspace-emoji-development">
							<RenderHtml html={query}></RenderHtml>
						</div>
					</EmojiWrapper>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(query, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}