import React, {useState} from "react";

import './PassportTagInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {TagInputUsers} from "../../../../components/inputs/tags/users/TagInputUsers";
import {TagInputGroups} from "../../../../components/inputs/tags/groups/TagInputGroups";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";

interface Props {
}

export const PassportTagInputDevelopment: React.FC<Props> = ({}) => {

	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Passport Tag Inputs</PageHeading>

					<FormHeading>User Selection</FormHeading>

					<div style={{marginTop: "20px"}}>
						<TagInputUsers
							label="Select Users"
							placeholder="Search for users..."
							onChange={setSelectedUserIds}
							help="Start typing to search for users from passport. Output is userIds."
						/>
					</div>

					<div style={{marginTop: "40px"}}>
						<TagInputUsers
							label="Limited Users (Max 3)"
							placeholder="Search for users..."
							maxTags={3}
							onChange={(userIds) => console.log("Limited users:", userIds)}
							help="You can select up to 3 users"
						/>
					</div>

					<FormHeading style={{marginTop: "60px"}}>Group Selection</FormHeading>

					<div style={{marginTop: "20px"}}>
						<TagInputGroups
							label="Select Groups"
							placeholder="Search for groups..."
							onChange={setSelectedGroupIds}
							help="Start typing to search for groups from passport. Output is groupIds."
						/>
					</div>

					<div style={{marginTop: "40px"}}>
						<TagInputGroups
							label="Limited Groups (Max 5)"
							placeholder="Search for groups..."
							maxTags={5}
							onChange={(groupIds) => console.log("Limited groups:", groupIds)}
							help="You can select up to 5 groups"
						/>
					</div>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Selected User IDs:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(selectedUserIds, null, 4)}
					</div>
					<div style={{marginTop: "30px", marginBottom: "20px"}}>Selected Group IDs:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(selectedGroupIds, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
