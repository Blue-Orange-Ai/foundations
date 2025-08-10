import React, {useEffect, useRef, useState} from "react";

import './ComboChartDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {LineChart} from "../../../../components/charts/line/LineChart";
import {ComboChart} from "../../../../components/charts/combo/ComboChart";

interface Props {
}

export const ComboChartDevelopment: React.FC<Props> = ({}) => {

	const [dataset1, setDataset1] = useState([]);

	const [dataset2, setDataset2] = useState([]);

	const [initialised, setInitialised] = useState(false);

	const initialisedRef = useRef(false);

	const interval = 1000;

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
			<PageHeading>Combo Chart</PageHeading>
			<ComboChart
				height={"100vh"}
				width={"100%"}
				dataset={[
					{ type: 'line', label: 'CPU %', parsing: false, data: [
							{x: 1719705600000, y: 12}, {x: 1719709200000, y: 18}
						], borderColor: '#2d88ff' },
					{ type: 'scatter', label: 'Events', parsing: false, data: [
							{x: 1719707000000, y: 20}, {x: 1719708200000, y: 35}
						], borderColor: '#ff7a00', backgroundColor: '#ff7a00' },
				]}
				xScale="time"
				xScaleTimeUnit="minute"
				yScale="linear"
				legend
				rangeSelect
			/>
			{/*<ComboChart*/}
			{/*	height={"100vh"}*/}
			{/*	width={"100%"}*/}
			{/*	dataset={[*/}
			{/*		{ type: 'bar', label: 'Volume', data: dataset1, backgroundColor: 'rgba(0,0,0,0.2)', borderColor: '#888', borderRadius: 4 },*/}
			{/*		{ type: 'line', label: 'Price', data: dataset2, borderColor: '#2d88ff', backgroundColor: 'rgba(45,136,255,0.2)' }*/}
			{/*	]}*/}
			{/*	xScale="category"*/}
			{/*	yScale="linear"*/}
			{/*	interactionType={"nearest"}*/}
			{/*	legend*/}
			{/*	rangeSelect*/}
			{/*	onRangeSelected={(a,b)=>console.log('range', a, b)}*/}
			{/*/>*/}

		</PaddedPage>
	)
}