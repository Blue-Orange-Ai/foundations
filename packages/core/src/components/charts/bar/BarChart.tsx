import React, {useEffect, useRef, useState} from "react";

import './BarChart.css'

import Chart from 'chart.js/auto';
import {ChartDataset, LegendPosition} from "../types/ChartTypes";
import {v4 as uuidv4} from "uuid";

interface Props {
	dataset: Array<ChartDataset>,
	indexAxis?: string, // x is vertical bar chart y is horizontal bar chart
	labels?: Array<string>,
	gridLines?: boolean,
	xLabel?: string,
	yLabel?: string,
	height?: string,
	width?: string,
	interactionType?: string,  // mode: 'index' or mode: 'nearest'
	animationTimeout?: number,
	legend?: boolean,
	legendPosition?: LegendPosition
}

export const BarChart: React.FC<Props> = ({
											   dataset,
											   indexAxis="x",
											   labels,
											   gridLines=true,
											   xLabel,
											   yLabel,
											   height="100%",
											   width="100%",
											   interactionType = "index",
											   animationTimeout = 2000,
											   legend=true,
											   legendPosition=LegendPosition.BOTTOM
										  }) => {

	const chartRef = useRef<HTMLCanvasElement>(null);

	const chartInstanceRef = useRef<Chart | null>(null);

	const initRef = useRef<boolean>(false);

	const uuid = uuidv4();

	const floatingLegendTopLeft: React.CSSProperties = {
		top: "20px",
		left: "20px",
	}

	const floatingLegendTopRight: React.CSSProperties = {
		top: "20px",
		right: "20px",
	}

	const floatingLegendBottomLeft: React.CSSProperties = {
		bottom: "20px",
		left: "20px",
	}

	const floatingLegendBottomRight: React.CSSProperties = {
		bottom: "20px",
		right: "20px",
	}

	const setLegendStyleValue = (): React.CSSProperties => {
		if (legendPosition == LegendPosition.TOP || legendPosition == LegendPosition.BOTTOM) {
			return {}
		} else if (legendPosition == LegendPosition.TOP_RIGHT) {
			return floatingLegendTopRight;
		} else if (legendPosition == LegendPosition.TOP_LEFT) {
			return floatingLegendTopLeft;
		} else if (legendPosition == LegendPosition.BOTTOM_RIGHT) {
			return floatingLegendBottomRight;
		}
		return floatingLegendBottomLeft;
	}

	const [legendStyle, setLegendStyle] = useState<React.CSSProperties>(setLegendStyleValue());

	const getOrCreateLegendList = (chart: any, id: any) => {
		const legendContainer = document.getElementById(id);
		if (!legendContainer) {
			return null;
		}
		let listContainer = legendContainer.querySelector('ul');

		if (!listContainer) {
			listContainer = document.createElement('ul');
			listContainer.style.display = 'flex';
			listContainer.style.flexDirection = legendPosition == LegendPosition.TOP || legendPosition == LegendPosition.BOTTOM ? 'row' : 'column';
			listContainer.style.margin = "0";
			listContainer.style.padding = "0";
			// @ts-ignore
			legendContainer.appendChild(listContainer);
		}

		return listContainer;
	};

	const htmlLegendPlugin = {
		id: 'htmlLegend',
		afterUpdate(chart: any, args:any, options:any) {
			const ul = getOrCreateLegendList(chart, options.containerID);
			if (ul) {
				while (ul.firstChild) {
					ul.firstChild.remove();
				}

				// Reuse the built-in legendItems generator
				const items = chart.options.plugins.legend.labels.generateLabels(chart);

				// @ts-ignore
				items.forEach(item => {
					const li = document.createElement('li');
					li.className = "blue-orange-bar-chart-legend-item"
					li.style.alignItems = 'center';
					li.style.cursor = 'pointer';
					li.style.display = 'flex';
					li.style.flexDirection = 'row';
					li.style.marginLeft = '10px';

					li.onclick = () => {
						const {type} = chart.config;
						if (type === 'pie' || type === 'doughnut') {
							chart.toggleDataVisibility(item.index);
						} else {
							chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
						}
						chart.update();
					};

					// Color box
					const boxSpan = document.createElement('span');
					boxSpan.className = "blue-orange-bar-chart-legend-item-color-span"
					boxSpan.style.background = item.fillStyle;
					boxSpan.style.borderColor = item.strokeStyle;
					boxSpan.style.borderWidth = item.lineWidth + 'px';
					boxSpan.style.display = 'inline-block';
					boxSpan.style.flexShrink = "0";

					// Text
					const textContainer = document.createElement('p');
					textContainer.className = "blue-orange-bar-chart-legend-item-text"
					textContainer.style.margin = "0";
					textContainer.style.padding = "0";
					textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

					const text = document.createTextNode(item.text);
					textContainer.appendChild(text);

					li.appendChild(boxSpan);
					li.appendChild(textContainer);
					ul.appendChild(li);
				});
			}
		}
	};

	const updateChartData = () => {
		if (chartInstanceRef.current != null && initRef.current) {
			dataset.forEach(ds => ds.axis = indexAxis)
			const data = {
				labels: labels,
				datasets: dataset
			};
			if (chartInstanceRef.current.data != data) {
				chartInstanceRef.current.data = data;
				chartInstanceRef.current.options.animation = false;
				chartInstanceRef.current.update();
			}

		}
	};

	useEffect(() => {
		if (chartRef.current) {
			const ctx = chartRef.current.getContext('2d');
			dataset.forEach(ds => ds.axis = indexAxis)
			const data = {
				labels: labels,
				datasets: dataset
			};

			const config: any = {
				type: "bar",
				data: data,
				options: {
					indexAxis: indexAxis,
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						htmlLegend: {
							// ID of the container to put the legend in
							containerID: uuid,
						},
						legend: {
							display: false,
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
								if (tooltipModel.caretX > window.innerWidth / 2) {
									tooltipEl.style.left = "unset"
									tooltipEl.style.right = position.right - tooltipModel.caretX + 'px';
								} else {
									tooltipEl.style.left = position.left + window.scrollX + tooltipModel.caretX + 'px';
									tooltipEl.style.right = "unset"
								}
								if (tooltipModel.caretY > window.innerHeight / 2) {
									tooltipEl.style.bottom = position.bottom - tooltipModel.caretY + 'px';
									tooltipEl.style.top = "unset";
								} else {
									tooltipEl.style.top = position.top + window.scrollY + tooltipModel.caretY + 'px';
									tooltipEl.style.bottom = "unset";
								}
								tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
								tooltipEl.style.pointerEvents = 'none';
							}
						}
					},
					scales: {
						y: {
							title: {
								display: yLabel != undefined,
								text: yLabel
							},
							grid: {
								display: gridLines
							}
						},
						x: {
							title: {
								display: xLabel != undefined,
								text: xLabel
							},
							grid: {
								display: gridLines
							}
						}
					},
					interaction: {
						intersect: false,
						mode: interactionType,
					}
				},
				plugins:[htmlLegendPlugin]
			};
			chartInstanceRef.current = new Chart((ctx as CanvasRenderingContext2D), config);
			setTimeout(() => {
				initRef.current = true;
				updateChartData();
			}, animationTimeout)
		}

		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, []);

	useEffect(() => {
		updateChartData();
	}, [dataset, labels]);

	return (
		<div className="blue-orange-bar-chart-cont" style={{height: height, width: width}}>
			{legend && legendPosition == LegendPosition.TOP && <div id={uuid} className="blue-orange-bar-chart-legend-cont"></div>}
			<canvas ref={chartRef}/>
			{legend && legendPosition == LegendPosition.BOTTOM && <div id={uuid} className="blue-orange-bar-chart-legend-cont"></div>}
			{legend && legendPosition != LegendPosition.BOTTOM && legendPosition != LegendPosition.TOP && <div id={uuid} style={legendStyle} className="blue-orange-bar-chart-floating-legend-cont"></div>}
		</div>

	)
}