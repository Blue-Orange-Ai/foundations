import React from "react";

import './AdvancedTooltipDevelopment.css'
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {AdvancedTooltip} from "../../../../components/tooltips/advanced-tooltip/AdvancedTooltip";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";

interface Props {
}

export const AdvancedTooltipDevelopment: React.FC<Props> = ({}) => {


	return (
		<PaddedPage>
			<PageHeading>Advanced Tooltip</PageHeading>
			<AdvancedTooltip tooltipComponent={<Button text={"Tooltip Button"} buttonType={ButtonType.PRIMARY} onClick={() => console.log("Hello tooltip")}></Button>}>
				<Button text={"Nothing Button"} buttonType={ButtonType.PRIMARY}></Button>
			</AdvancedTooltip>
		</PaddedPage>
	)
}