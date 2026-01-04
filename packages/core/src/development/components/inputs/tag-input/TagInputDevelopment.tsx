import React, {useState} from "react";

import './TagInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";
import {TagInputCallback} from "../../../../components/inputs/tags/fetch/TagInputCallback";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

interface Props {
}

export const TagInputDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [query, setQuery] = useState<string[]>(["William"]);
	const [callbackTags, setCallbackTags] = useState<string[]>([]);

	const mockFetchWhitelist = async (inputValue: string): Promise<string[]> => {
		await new Promise(resolve => setTimeout(resolve, 500));
		const allOptions = [
			"JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust", "Swift",
			"Kotlin", "PHP", "Scala", "Haskell", "Elixir", "Clojure", "Dart", "Lua", "Perl", "R"
		];
		return allOptions.filter(option =>
			option.toLowerCase().includes(inputValue.toLowerCase())
		);
	};

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Tag Editor</PageHeading>
					<TagInput initialTags={query} onChange={setQuery}></TagInput>

					<div style={{marginTop: "40px"}}>
						<PageHeading>Tag Editor with Callback (Dynamic Whitelist)</PageHeading>
						<TagInputCallback
							placeholder="Type to search programming languages..."
							fetchWhitelist={mockFetchWhitelist}
							onChange={setCallbackTags}
						/>
					</div>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>TagInput Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(query, null, 4)}
					</div>
					<div style={{marginTop: "20px", marginBottom: "20px"}}>TagInputCallback Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(callbackTags, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}