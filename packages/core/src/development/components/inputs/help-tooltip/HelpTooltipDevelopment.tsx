import React from "react";

import './HelpTooltipDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {HelpIcon} from "../../../../components/inputs/help/HelpIcon";

interface Props {
}

export const HelpTooltipDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Help Tooltip</PageHeading>
			<div className="blue-orange-help-tooltip-development">
				<div className="blue-orange-help-tooltip-development-row">
					<div>Hover the icon</div>
					<HelpIcon label={"This tooltip is provided by HelpIcon (tippy.js)"}></HelpIcon>
				</div>
				<div className="blue-orange-help-tooltip-development-row">
					<div>Custom size</div>
					<HelpIcon label={"Custom size via style prop"} style={{height: "28px", width: "28px"}}></HelpIcon>
				</div>
			</div>
		</PaddedPage>
	)
}
