import React, {useEffect, useState} from "react";

import './LineChartDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {LineChart} from "../../../../components/charts/line/LineChart";

interface Props {
}

export const LineChartDevelopment: React.FC<Props> = ({}) => {


	const [dataset1, setDataset1] = useState([]);

	const [dataset2, setDataset2] = useState([]);

	const interval = 5000;

	useEffect(() => {
		const intervalId = setInterval(() => {
			const newDataPoint1 = {
				x: new Date().toISOString(), // Current timestamp
				y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
			};
			const newDataPoint2 = {
				x: new Date().toISOString(), // Current timestamp
				y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
			};
			setDataset1((prevElements) => [
				...prevElements,
				newDataPoint1
			]);
			setDataset2((prevElements) => [
				...prevElements,
				newDataPoint2
			]);
		}, interval);

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, [interval]);

	return (
		<PaddedPage>
			<PageHeading>Line Chart</PageHeading>
			<LineChart
				height={"100vh"}
				width={"100%"}
				gridLines={true}
				xLabel={"Timestamp"}
				yLabel={"Value"}
				xScale={"time"}
				xScaleTimeUnit={"second"}
				interactionType={"nearest"}
				legend={true}
				dataset={[{
					label: "Subscribers",
					backgroundColor: "#BB8FCE",
					borderColor: "#BB8FCE",
					borderWidth: 2,
					borderDash: [5, 5],
					data: dataset1
				},{
					label: "Subscribers 2",
					backgroundColor: '#E59866',
					borderColor: '#E59866',
					data: dataset2
				}]}></LineChart>
		</PaddedPage>
	)
}