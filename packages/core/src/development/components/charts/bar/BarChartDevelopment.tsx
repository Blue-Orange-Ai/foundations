import React, {useEffect, useState} from "react";

import './BarChartDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {BarChart} from "../../../../components/charts/bar/BarChart";

interface Props {
}

export const BarChartDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Bar Chart</PageHeading>
			<BarChart
			 	indexAxis={"x"}
			 	height={"400px"}
				gridLines={true}
				xScale={"category"}
				legend={false}
				labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
				dataset={[{
					label: "Subscribers",
					backgroundColor: "#BB8FCE",
					borderColor: "#BB8FCE",
					data: [0, 20, 5, 10, 50],
					borderRadius: 4
				}]}></BarChart>
		</PaddedPage>
	)
}