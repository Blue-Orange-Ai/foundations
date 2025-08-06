import React, {useState} from "react";

import './EmojiInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {EmojiWrapper} from "../../../../components/inputs/emoji/emoji-wrapper/EmojiWrapper";
import {RenderHtml} from "../../../../components/text-decorations/render-html/RenderHtml";


interface Props {
}

export const EmojiInputDevelopment: React.FC<Props> = ({}) => {

	const initialEmojiObject: string = "&#x1F600;"

	const [query, setQuery] = useState<string>(initialEmojiObject);


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Emoji Input Editor</PageHeading>
					<EmojiWrapper onSelection={setQuery}>
						<div className="workspace-emoji-development">
							<RenderHtml html={query}></RenderHtml>
						</div>
					</EmojiWrapper>
				</PaddedPage>
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