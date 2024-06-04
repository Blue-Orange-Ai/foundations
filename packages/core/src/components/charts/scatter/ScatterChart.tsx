import React, {useEffect, useRef} from "react";

import './ScatterChart.css'

import Chart from 'chart.js/auto';
import {ChartDataset} from "../types/ChartTypes";
import {v4 as uuidv4} from "uuid";

interface Props {
	dataset: Array<ChartDataset>,
	gridLines?: boolean,
	xScale?: string,
	yScale?: string,
	height?: string,
	width?: string,
	interactionType?: string  // mode: 'index' or mode: 'nearest'
}

export const ScatterChart: React.FC<Props> = ({
											   dataset,
											   gridLines=true,
											   xScale,
											   yScale,
											   height="100%",
											   width="100%",
											   interactionType = "nearest"}) => {

	const chartRef = useRef<HTMLCanvasElement>(null);

	const uuid = uuidv4();

	useEffect(() => {
		var myChart: any = undefined;
		if (chartRef.current) {
			const ctx = chartRef.current.getContext('2d');

			const data = {
				datasets: dataset
			};

			const config: any = {
				type: "scatter",
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: true,
						},
						tooltip: {
							enabled: false,
							intersect: false,
							mode: interactionType,
							external: (context: any) => {
								let tooltipEl = document.getElementById('blue-orange-chart-line-js-tooltip-' + uuid);

								if (!tooltipEl) {
									tooltipEl = document.createElement('div');
									tooltipEl.id = 'blue-orange-chart-line-js-tooltip-' + uuid;
									tooltipEl.className = 'blue-orange-chart-line-tooltip';
									var tooltipBody = document.createElement('div');
									tooltipBody.id = 'blue-orange-chart-line-js-tooltip-body-' + uuid;
									tooltipBody.className = 'blue-orange-chart-line-tooltip-body';
									tooltipEl.appendChild(tooltipBody);
									document.body.appendChild(tooltipEl);
								}

								const tooltipModel = context.tooltip;
								if (tooltipModel.opacity === 0) {
									// @ts-ignore
									tooltipEl.style.opacity = 0;
									return;
								}

								tooltipEl.classList.remove('above', 'below', 'no-transform');
								if (tooltipModel.yAlign) {
									tooltipEl.classList.add(tooltipModel.yAlign);
								} else {
									tooltipEl.classList.add('no-transform');
								}

								function getBody(bodyItem: any) {
									return bodyItem.lines;
								}

								if (tooltipModel.body) {
									const titleLines = tooltipModel.title || [];
									const bodyLines = tooltipModel.body.map(getBody);
									const selectedDataPoints = tooltipModel.dataPoints;
									var toolTipDatasets = document.createElement("div");
									toolTipDatasets.className = "blue-orange-charts-line-dataset-container";
									for (let dataPoint of selectedDataPoints) {
										const dataset = dataPoint.dataset;
										const borderColor = dataset.borderColor;
										const backgroundColor = dataset.backgroundColor;
										const formattedValue = dataPoint.formattedValue;
										const yLabel = dataPoint.label;
										const datasetLabel = dataset.label;
										var toolTipDatasetRow = document.createElement("div");
										toolTipDatasetRow.className = "blue-orange-charts-line-dataset-row";
										var tooltipDatasetColor = document.createElement('div');
										tooltipDatasetColor.style.height = "10px";
										tooltipDatasetColor.style.width = "10px";
										tooltipDatasetColor.style.borderRadius = "50%";
										tooltipDatasetColor.style.border = "2px solid " + borderColor;
										tooltipDatasetColor.style.backgroundColor = backgroundColor;
										tooltipDatasetColor.style.marginRight = "15px";
										toolTipDatasetRow.appendChild(tooltipDatasetColor);
										var tooltipFormattedValue = document.createElement('div');
										tooltipFormattedValue.className = "blue-orange-chart-line-tooltip-value";
										tooltipFormattedValue.innerHTML = "<span class='blue-orange-chart-line-tooltip-dataset-label'>" + datasetLabel + ":</span>" + formattedValue;
										toolTipDatasetRow.appendChild(tooltipFormattedValue);
										toolTipDatasets.appendChild(toolTipDatasetRow);
									}
									const selectedDatasets = tooltipModel.datasets;
									var header = '';
									titleLines.forEach(function(title:any) {
										header += title;
									});
									var value = ""
									bodyLines.forEach(function(body:any, i:any) {
										var vals = body[0].split(":");
										var val = vals[1].trim();
										value += val;
									});
									var chartTooltipBody = document.getElementById('blue-orange-chart-line-js-tooltip-body-' + uuid) as HTMLElement;
									chartTooltipBody.innerHTML = "";
									chartTooltipBody.appendChild(toolTipDatasets);
								}

								const position = context.chart.canvas.getBoundingClientRect();
								tooltipEl.style.opacity = String(1);
								tooltipEl.style.position = 'absolute';
								tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
								tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
								tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
								tooltipEl.style.pointerEvents = 'none';
							}
						}
					},
					scales: {
						y: {
							type: yScale,
							grid: {
								display: true
							},
							ticks: {
								display: true
							}
						},
						x: {
							type: xScale,
							grid: {
								display: gridLines
							},
							ticks: {
								display: gridLines
							}
						}
					},
					interaction: {
						intersect: false,
						mode: interactionType,
					}
				}
			};

			myChart = new Chart((ctx as CanvasRenderingContext2D), config);
		}

		return () => {
			if (myChart) {
				myChart.destroy();
			}
		};
	}, []);

	return (
		<div style={{height: height, width: width}}>
			<canvas ref={chartRef}/>
		</div>

	)
}