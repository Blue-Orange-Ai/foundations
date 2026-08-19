import React, {useEffect, useMemo, useRef, useState} from "react";

import {ChartBlockData, chartIsRenderable} from "../ChartBlockTypes";
import {fetchRemoteTable} from "../data/remote";
import {ChartConfigModal} from "./ChartConfigModal";
import {ChartRenderer} from "./ChartRenderer";

interface Props {
	data: ChartBlockData,
	editable: boolean,
	onChange: (data: ChartBlockData) => void,
	onDelete: () => void,
	onAddBelow: () => void,
}

/**
 * The contents of one chart block.
 *
 * Rows fetched from a data server are held in component state rather than
 * written back into the block: a poll every few seconds would otherwise fill
 * the undo history and broadcast a document edit to every collaborator. The
 * copy stored in the document is the snapshot taken when the source was last
 * configured, so the block still draws when the server is unreachable.
 */
export const ChartBlockView: React.FC<Props> = ({data, editable, onChange, onDelete, onAddBelow}) => {

	const [configOpen, setConfigOpen] = useState<boolean>(false);
	const [liveRows, setLiveRows] = useState<Array<Record<string, any>> | null>(null);
	const [refreshError, setRefreshError] = useState<string>("");
	const [refreshing, setRefreshing] = useState<boolean>(false);

	const remote = data.source.kind === "remote" ? data.source.remote : undefined;
	const remoteKey = remote
		? [remote.url, remote.method, remote.path ?? "", remote.body ?? "", JSON.stringify(remote.headers)].join("|")
		: "";
	const refreshSeconds = remote?.refreshSeconds ?? 0;

	// Rows loaded from the server replace the stored snapshot, but only while
	// the block is still pointed at the same endpoint.
	const effectiveData = useMemo<ChartBlockData>(() => {
		if (liveRows == null) {
			return data;
		}
		return {...data, source: {...data.source, rows: liveRows}};
	}, [data, liveRows]);

	const mountedRef = useRef<boolean>(true);
	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const load = useRef<(() => void) | null>(null);
	load.current = () => {
		if (!remote || remote.url.trim() === "") {
			return;
		}
		setRefreshing(true);
		fetchRemoteTable(remote)
			.then((table) => {
				if (!mountedRef.current) {
					return;
				}
				setLiveRows(table.rows);
				setRefreshError("");
			})
			.catch((e: any) => {
				if (!mountedRef.current) {
					return;
				}
				setRefreshError(e?.message ?? "The data server could not be reached.");
			})
			.finally(() => {
				if (mountedRef.current) {
					setRefreshing(false);
				}
			});
	};

	// Re-fetch when the endpoint changes, then poll if a refresh interval is set.
	useEffect(() => {
		setLiveRows(null);
		setRefreshError("");
		if (remoteKey === "") {
			return;
		}
		load.current?.();
		if (refreshSeconds <= 0) {
			return;
		}
		const timer = window.setInterval(() => load.current?.(), refreshSeconds * 1000);
		return () => window.clearInterval(timer);
	}, [remoteKey, refreshSeconds]);

	const renderable = chartIsRenderable(effectiveData);

	// A top or bottom legend is laid out inside the core chart's own container,
	// below the canvas that fills it, so it spills out of the height we give
	// that container. Reserve room for it rather than letting it land on the
	// caption. The corner positions are absolutely positioned over the canvas
	// and need no reservation.
	const legendInFlow = data.options.legend &&
		(data.options.legendPosition === "top" || data.options.legendPosition === "bottom");

	return (
		<div className="blue-orange-chart-block" contentEditable={false} suppressContentEditableWarning={true}>

			<div className="blue-orange-chart-block-tools no-select">
				{data.source.kind === "remote" &&
					<div
						className={"blue-orange-chart-block-tool" + (refreshing ? " blue-orange-chart-block-tool-busy" : "")}
						title={"Refresh data"}
						onClick={() => load.current?.()}
					>
						<i className="ri-refresh-line"></i>
					</div>
				}
				{editable &&
					<div
						className="blue-orange-chart-block-tool"
						title={"Chart settings"}
						onClick={() => setConfigOpen(true)}
					>
						<i className="ri-equalizer-line"></i>
					</div>
				}
				{editable &&
					<div className="blue-orange-chart-block-tool" title={"Add block below"} onClick={onAddBelow}>
						<i className="ri-insert-row-bottom"></i>
					</div>
				}
				{editable &&
					<div className="blue-orange-chart-block-tool" title={"Delete chart"} onClick={onDelete}>
						<i className="ri-delete-bin-7-line"></i>
					</div>
				}
			</div>

			{data.title !== "" && <div className="blue-orange-chart-block-title">{data.title}</div>}

			{renderable &&
				<div
					className={"blue-orange-chart-block-canvas" + (legendInFlow ? " blue-orange-chart-block-canvas-legend" : "")}
					style={{height: data.options.height + "px"}}
				>
					<ChartRenderer data={effectiveData}></ChartRenderer>
				</div>
			}

			{!renderable &&
				<div
					className={"blue-orange-chart-block-empty" + (editable ? " blue-orange-chart-block-empty-clickable" : "")}
					onClick={() => {
						if (editable) {
							setConfigOpen(true);
						}
					}}
				>
					<i className="ri-line-chart-line"></i>
					<div className="blue-orange-chart-block-empty-title">
						{data.source.columns.length === 0 ? "No data yet" : "No series selected"}
					</div>
					<div className="blue-orange-chart-block-empty-text">
						{editable
							? "Upload a CSV or XLSX file, or point the block at a data server, then choose which columns to plot."
							: "This chart has not been configured."}
					</div>
				</div>
			}

			{refreshError !== "" &&
				<div className="blue-orange-chart-block-error">
					<i className="ri-error-warning-line"></i> {refreshError}
				</div>
			}

			{data.caption !== "" && <div className="blue-orange-chart-block-caption">{data.caption}</div>}

			{editable &&
				<ChartConfigModal
					open={configOpen}
					data={data}
					onApply={(next) => {
						setConfigOpen(false);
						onChange(next);
					}}
					onClose={() => setConfigOpen(false)}
				></ChartConfigModal>
			}
		</div>
	);
};
