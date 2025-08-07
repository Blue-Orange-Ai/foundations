import React, {useState} from "react";

import './CopyInputDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {CopyInput} from "../../../../components/inputs/copy-input/CopyInput";


interface Props {
}

export const CopyInputDevelopment: React.FC<Props> = ({}) => {


	return (
		<PaddedPage>
			<PageHeading>Copy Input Editor</PageHeading>
			<CopyInput value={"Hello World"}></CopyInput>
		</PaddedPage>
	)
}