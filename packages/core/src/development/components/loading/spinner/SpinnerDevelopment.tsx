import React from "react";

import './SpinnerDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Spinner, SpinnerSize} from "../../../../components/loading/spinner/Spinner";

interface Props {
}

export const SpinnerDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Spinner</PageHeading>
			<Description>
				An indeterminate loading indicator. It picks up the theme, comes in three sizes and can
				carry a label.
			</Description>

			<GeneralHeading>Sizes</GeneralHeading>
			<div className="blue-orange-spinner-development-row">
				<Spinner size={SpinnerSize.SMALL}></Spinner>
				<Spinner size={SpinnerSize.MEDIUM}></Spinner>
				<Spinner size={SpinnerSize.LARGE}></Spinner>
			</div>

			<GeneralHeading>With a label</GeneralHeading>
			<div className="blue-orange-spinner-development-row">
				<Spinner label="Loading results"></Spinner>
			</div>

			<GeneralHeading>Custom colour and size</GeneralHeading>
			<div className="blue-orange-spinner-development-row">
				<Spinner color="dodgerblue" fontSize="1.5rem"></Spinner>
				<Spinner color="#16a34b" fontSize="1.5rem"></Spinner>
				<Spinner color="#e11d48" fontSize="1.5rem"></Spinner>
			</div>

			<GeneralHeading>Alternative icons</GeneralHeading>
			<Description>Any remixicon class can be spun.</Description>
			<div className="blue-orange-spinner-development-row">
				<Spinner icon="ri-loader-2-line"></Spinner>
				<Spinner icon="ri-loader-5-line"></Spinner>
				<Spinner icon="ri-refresh-line"></Spinner>
			</div>
		</PaddedPage>
	)
}
