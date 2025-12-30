import React, {useState} from "react";

import './PhoneInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {PhoneInput} from "../../../../components/inputs/phone/PhoneInput";
import {Telephone} from "@blue-orange-ai/foundations-clients/lib/Passport";


interface Props {
}

export const TabInput: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<Telephone>({
		code: "",
		country: "",
		extension: "",
		format: "",
		id: "",
		number: ""

	});

	const handleQueryChange = (telephone: Telephone) => {
		setQuery((prevState) => ({
			...prevState,
			...telephone
		}))
	}


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Phone Input Editor</PageHeading>
					<PhoneInput telephone={query} onChange={handleQueryChange}></PhoneInput>
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