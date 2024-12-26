import React from "react";

import './SimpleTooltipDevelopment.css'
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SimpleTooltip} from "../../../../components/tooltips/simple-tooltip/SimpleTooltip";

interface Props {
}

export const SimpleTooltipDevelopment: React.FC<Props> = ({}) => {


	return (
		<PaddedPage>
			<PageHeading>Advanced Tooltip</PageHeading>
			<SimpleTooltip label={"This is where the simple tooltip text goes"}>
				<Button text={"Nothing Button"} buttonType={ButtonType.PRIMARY}></Button>
			</SimpleTooltip>
		</PaddedPage>
	)
}