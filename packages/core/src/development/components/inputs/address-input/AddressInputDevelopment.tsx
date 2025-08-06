import React, {useState} from "react";

import './AddressInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Address, Media} from "@blue-orange-ai/foundations-clients";
import {AddressInput} from "../../../../components/inputs/address/AddressInput";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

interface Props {
}

export const AddressInputDevelopment: React.FC<Props> = ({}) => {

	const generateContentStr = (state: Address) => {
		return JSON.stringify(state, null, 2);
	}

	const [address, setAddress] = useState<Address>({
		address: "4 Kegworth Street",
		city: "Leichhardt",
		country: "Australia",
		id: "",
		postcode: "2040",
		state: "NSW"
	});

	const updateAddress = (address: Address) => {
		setAddress((prevState) => ({
			...prevState,
			...address
		}))
	}


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<PaddedPage>
					<PageHeading>Address Input</PageHeading>
					<AddressInput
						address={address}
						onChange={updateAddress}
						label="Address Input"
					></AddressInput>
				</PaddedPage>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{generateContentStr(address)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}