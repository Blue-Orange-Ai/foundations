import React from "react";

import './TruncatedTextDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {TruncatedText} from "../../../../components/text-decorations/truncated-text/TruncatedText";
import {TruncatedTextWrapper} from "../../../../components/text-decorations/truncated-text-wrapper/TruncatedTextWrapper";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const TruncatedTextDevelopment: React.FC<Props> = ({}) => {

	const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

	return (
		<PaddedPage>
			<PageHeading>Truncated Text Decorations</PageHeading>
			<Description>Components for truncating text with ellipsis after a specified number of lines.</Description>

			<GeneralHeading>TruncatedText - 1 Line</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={1} />
			</div>

			<GeneralHeading>TruncatedText - 2 Lines</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={2} />
			</div>

			<GeneralHeading>TruncatedText - 3 Lines</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={3} />
			</div>

			<GeneralHeading>TruncatedText - Custom Line Height</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={2} lineHeight={2} />
			</div>

			<GeneralHeading>TruncatedTextWrapper - With Children</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedTextWrapper maxLines={2}>
					<span>This is a <strong>wrapper component</strong> that can contain <em>mixed content</em> including styled elements, and will still truncate properly after the specified number of lines.</span>
				</TruncatedTextWrapper>
			</div>

			<GeneralHeading>TruncatedTextWrapper - 1 Line</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedTextWrapper maxLines={1}>
					A very long single line that should be truncated with an ellipsis when it exceeds the container width.
				</TruncatedTextWrapper>
			</div>
		</PaddedPage>
	)
}
