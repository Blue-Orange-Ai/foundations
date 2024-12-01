import React, {useEffect, useState} from "react";

import './ScatterChartDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {ScatterChart} from "../../../../components/charts/scatter/ScatterChart";

interface Props {
}

export const ScatterChartDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Scatter Chart</PageHeading>
			<ScatterChart
				height={"400px"}
				gridLines={true}
				xScale={"linear"}
				dataset={[{
					label: "Subscribers",
					backgroundColor: "#BB8FCE",
					borderColor: "#BB8FCE",
					data: [{ x: -10, y: 0 },
						{ x: 0, y: 10 },
						{ x: 10, y: 5 },
						{ x: 20, y: -10 },
						{ x: 25, y: -5 }]
				},{
					label: "Subscribers 2",
					backgroundColor: '#E59866',
					borderColor: '#E59866',
					data: [{ x: -30, y: 0 },
						{ x: 30, y: 20 },
						{ x: 40, y: -5 },
						{ x: 50, y: -10 },
						{ x: 65, y: -50 }]
				}]}></ScatterChart>
		</PaddedPage>
	)
}