import React, {useEffect, useRef} from "react";

import './LineChart.css'

import Chart from 'chart.js/auto';
import {ChartDataset} from "../types/ChartTypes";
import {v4 as uuidv4} from "uuid";

interface Props {
	labels: Array<string>,
	dataset: Array<ChartDataset>,
	gridLines?: boolean,
	yLabels?: boolean,
	tooltipLabel?: string,
	height?: number
}

export const LineChart: React.FC<Props> = ({labels, dataset, gridLines=true, yLabels=true, tooltipLabel="", height=350}) => {

	const chartRef = useRef<HTMLCanvasElement>(null);

	const uuid = uuidv4();

	useEffect(() => {
		var myChart: any = undefined;
		if (chartRef.current) {
			const ctx = chartRef.current.getContext('2d');

			const data = {
				labels: labels,
				datasets: dataset
			};

			var xGrid: any = {
				borderDash: [8, 4],
				borderWidth: 2,
				lineWidth: 2,
				color: '#2e3d4e17'
				// color: this.userService.details.darkMode ? '#454545' : '#2e3d4e17'
			}
			if (!gridLines){
				xGrid = {
					display: false,
					borderWidth: 0
				}
			}
			var ticks = {
				// @ts-ignore
				callback: function(val, index) {
					// @ts-ignore
					return index === 0 || index === ticks.length - 1 ? this.getLabelForValue(val) : '';
				}
			}

			if (!yLabels){
				ticks = {
					callback: function(val, index) {
						return '';
					}
				}
			}

			const config: any = {
				type: "line",
				data: data,
				options: {
					plugins: {
						legend: {
							display: false
						},
						tooltip: {
							enabled: false,
							intersect: false,
							mode: 'index',
							external: (context: any) => {
								let tooltipEl = document.getElementById('hero-chart-js-tooltip-' + uuid);

								if (!tooltipEl) {
									tooltipEl = document.createElement('div');
									tooltipEl.id = 'hero-chart-js-tooltip-' + uuid;
									tooltipEl.className = 'general-chart-tooltip';
									var tooltipHeader = document.createElement('div');
									tooltipHeader.id = 'hero-chart-js-tooltip-header-' + uuid;
									tooltipHeader.className = 'general-chart-tooltip-title';
									tooltipEl.appendChild(tooltipHeader);
									var tooltipBody = document.createElement('div');
									tooltipBody.id = 'hero-chart-js-tooltip-body-' + uuid;
									tooltipBody.className = 'general-chart-tooltip-body';
									var tooltipColor = document.createElement('div');
									tooltipColor.style.height = "14px";
									tooltipColor.style.width = "14px";
									tooltipColor.style.borderRadius = "50%";
									tooltipColor.style.border = "2px solid rgba(143, 66, 255, 1)";
									tooltipColor.style.backgroundColor = "rgba(143, 66, 255, 0.2)";
									tooltipColor.style.marginRight = "15px";
									tooltipBody.appendChild(tooltipColor);
									var tooltipMainValue = document.createElement('div');
									tooltipMainValue.id = "hero-chart-js-main-value-" + uuid;
									tooltipMainValue.className = "general-chart-tooltip-value";
									tooltipBody.appendChild(tooltipMainValue);
									var textNode = document.createElement("span");
									textNode.className = "general-tooltip-text";
									textNode.innerText = tooltipLabel;
									tooltipBody.appendChild(textNode);
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
									// @ts-ignore
									document.getElementById("hero-chart-js-tooltip-header-" + uuid).innerHTML = header;
									// @ts-ignore
									document.getElementById("hero-chart-js-main-value-" + uuid).innerHTML = value;
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
					elements: {
						line: {
							tension: 0.2
						},
						point:{
							radius: 0
						}
					},
					scales: {
						y: {
							grid: xGrid,
							ticks: {
								display: true
							}
						},
						x: {
							grid: xGrid,
							ticks: {
								display: true
							}
						}
					},
					interaction: {
						intersect: false,
						mode: 'index',
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
		<div style={{maxHeight: height + "px"}}>
			<canvas ref={chartRef}/>
		</div>

	)
}