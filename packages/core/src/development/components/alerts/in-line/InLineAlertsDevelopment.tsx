import React from "react";

import './InLineAlertsDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {DefaultBlockAlert} from "../../../../components/alerts/in-line-block/defaultalert/DefaultBlockAlert";
import {SuccessBlockAlert} from "../../../../components/alerts/in-line-block/successalert/SuccessBlockAlert";
import {WarningBlockAlert} from "../../../../components/alerts/in-line-block/warningalert/WarningBlockAlert";
import {ErrorBlockAlert} from "../../../../components/alerts/in-line-block/erroralert/ErrorBlockAlert";
import {InfoBlockAlert} from "../../../../components/alerts/in-line-block/infoalert/InfoBlockAlert";

interface Props {
}

export const InLineAlertsDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>In Line Alerts</PageHeading>
			<div className="blue-orange-in-line-alerts-development">
				<DefaultBlockAlert title={"Default Alert"} description={"This is a default inline alert"}></DefaultBlockAlert>
				<InfoBlockAlert title={"Info Alert"} description={"This is an info inline alert"}></InfoBlockAlert>
				<SuccessBlockAlert title={"Success Alert"} description={"This is a success inline alert"}></SuccessBlockAlert>
				<WarningBlockAlert title={"Warning Alert"} description={"This is a warning inline alert"}></WarningBlockAlert>
				<ErrorBlockAlert title={"Error Alert"} description={"This is an error inline alert"}></ErrorBlockAlert>
			</div>
		</PaddedPage>
	)
}
