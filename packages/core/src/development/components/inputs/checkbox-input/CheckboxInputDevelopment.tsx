import React, {useState} from "react";

import './CheckboxInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";

interface Props {
}

export const CheckboxInputDevelopment: React.FC<Props> = ({}) => {

	const [checked, setChecked] = useState(false);


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Checkbox Input</PageHeading>
					<Checkbox
						checked={checked}
						onCheckboxChange={setChecked}
					></Checkbox>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(checked)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}