import React, {useRef, useState} from "react";

import {
	Button,
	ButtonIcon,
	ButtonSize,
	ButtonType,
	Input,
	Spinner,
	SpinnerSize,
	TextArea,
} from "@blue-orange-ai/foundations-core";
import {
	ChartBlockData,
	ChartDataTable,
	ChartRemoteSource,
	emptyRemoteSource,
} from "../ChartBlockTypes";
import {applyTable} from "../chartConfigOps";
import {CHART_UPLOAD_ACCEPT, parseUploadedFile} from "../data/upload";
import {fetchRemoteTable} from "../data/remote";
import {ChartSelect} from "./ChartSelect";

interface Props {
	data: ChartBlockData,
	onChange: (data: ChartBlockData) => void,
}

const PREVIEW_ROWS = 5;

const SOURCE_KINDS: Array<{kind: "inline" | "remote", label: string, icon: string}> = [
	{kind: "inline", label: "Uploaded file", icon: "ri-file-excel-2-line"},
	{kind: "remote", label: "Data server", icon: "ri-server-line"},
];

const REMOTE_FORMAT_EXAMPLE = `{
  "columns": ["month", "revenue", "margin"],
  "rows": [
    ["Jan", 120400, 0.31],
    ["Feb", 138200, 0.34]
  ]
}`;

/** Upload / data-server configuration plus the x-axis column picker. */
export const ChartDataPanel: React.FC<Props> = ({data, onChange}) => {

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	// Every sheet of the workbook that was uploaded in this session, so
	// switching sheets does not need a re-upload. Deliberately not stored in
	// the block: a multi-sheet workbook would bloat the document.
	const sheetsRef = useRef<Record<string, ChartDataTable> | null>(null);

	const [busy, setBusy] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [notice, setNotice] = useState<string>("");

	const source = data.source;
	const remote: ChartRemoteSource = source.remote ?? emptyRemoteSource();

	const setRemote = (patch: Partial<ChartRemoteSource>) => {
		onChange({
			...data,
			source: {...data.source, remote: {...remote, ...patch}},
		});
	};

	const handleFile = async (file: File | null | undefined) => {
		if (!file) {
			return;
		}
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const result = await parseUploadedFile(file);
			sheetsRef.current = result.sheets ?? null;
			onChange(
				applyTable(
					{...data, source: {...data.source, kind: "inline"}},
					result.table,
					{
						fileName: result.fileName,
						sheetName: result.sheetName,
						sheetNames: result.sheetNames,
					}
				)
			);
			setNotice(
				result.table.rows.length + " rows and " + result.table.columns.length + " columns loaded."
			);
		} catch (e: any) {
			setError(e?.message ?? "The file could not be read.");
		} finally {
			setBusy(false);
		}
	};

	const handleSheetChange = (sheetName: string) => {
		const sheets = sheetsRef.current;
		if (!sheets || !sheets[sheetName]) {
			return;
		}
		onChange(applyTable(data, sheets[sheetName], {sheetName: sheetName}));
		setNotice("Switched to " + sheetName + ".");
	};

	const handleFetch = async () => {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const table = await fetchRemoteTable(remote);
			onChange(
				applyTable(
					{...data, source: {...data.source, kind: "remote", remote: remote}},
					table,
					{fileName: undefined, sheetName: undefined, sheetNames: undefined}
				)
			);
			setNotice(table.rows.length + " rows and " + table.columns.length + " columns returned.");
		} catch (e: any) {
			setError(e?.message ?? "The data server could not be reached.");
		} finally {
			setBusy(false);
		}
	};

	const setSourceKind = (kind: "inline" | "remote") => {
		onChange({
			...data,
			source: {
				...data.source,
				kind: kind,
				remote: kind === "remote" ? (data.source.remote ?? emptyRemoteSource()) : data.source.remote,
			},
		});
	};

	const previewRows = source.rows.slice(0, PREVIEW_ROWS);

	return (
		<div className="blue-orange-chart-config-panel">

			<div className="blue-orange-chart-config-section">
				<div className="blue-orange-chart-config-section-title">Where the data comes from</div>
				<div className="blue-orange-chart-source-switch">
					{SOURCE_KINDS.map((option) => (
						<button
							key={option.kind}
							type="button"
							className={
								"blue-orange-chart-choice blue-orange-chart-choice-inline" +
								(source.kind === option.kind ? " blue-orange-chart-choice-active" : "")
							}
							onClick={() => setSourceKind(option.kind)}
						>
							<i className={option.icon}></i>
							<span>{option.label}</span>
						</button>
					))}
				</div>
			</div>

			{source.kind === "inline" &&
				<div className="blue-orange-chart-config-section">
					<div className="blue-orange-chart-config-section-title">Spreadsheet</div>
					<input
						ref={fileInputRef}
						type="file"
						style={{display: "none"}}
						accept={CHART_UPLOAD_ACCEPT}
						onChange={(event) => {
							const file = event.target.files ? event.target.files[0] : null;
							// Clearing the value lets the same file be picked twice in a row.
							event.target.value = "";
							handleFile(file);
						}}
					/>
					<div className="blue-orange-chart-upload-row">
						<Button
							text={source.fileName ? "Replace file" : "Upload CSV or XLSX"}
							icon={"ri-upload-2-line"}
							size={ButtonSize.SMALL}
							isLoading={busy}
							buttonType={ButtonType.SECONDARY}
							onClick={() => fileInputRef.current?.click()}
						></Button>
						{source.fileName &&
							<span className="blue-orange-chart-config-hint">
								{source.fileName}{source.sheetName ? " · " + source.sheetName : ""}
							</span>
						}
					</div>
					{sheetsRef.current && source.sheetNames && source.sheetNames.length > 1 &&
						<ChartSelect
							label={"Sheet"}
							value={source.sheetName ?? source.sheetNames[0]}
							options={source.sheetNames.map((name) => ({value: name, label: name}))}
							onChange={handleSheetChange}
						></ChartSelect>
					}
					<div className="blue-orange-chart-config-hint">
						CSV, TSV and XLSX files are read in the browser — nothing is uploaded to a server.
					</div>
				</div>
			}

			{source.kind === "remote" &&
				<div className="blue-orange-chart-config-section">
					<div className="blue-orange-chart-config-section-title">Data server</div>
					<Input
						label={"URL"}
						value={remote.url}
						placeholder={"https://api.example.com/reports/revenue"}
						onChange={(value) => setRemote({url: value})}
					></Input>
					<div className="blue-orange-chart-config-row">
						<ChartSelect
							label={"Method"}
							value={remote.method}
							options={[{value: "GET", label: "GET"}, {value: "POST", label: "POST"}]}
							onChange={(value) => setRemote({method: value === "POST" ? "POST" : "GET"})}
						></ChartSelect>
						<Input
							label={"Response path"}
							value={remote.path ?? ""}
							placeholder={"data.series"}
							onChange={(value) => setRemote({path: value})}
						></Input>
					</div>
					{remote.method === "POST" &&
						<TextArea
							label={"Request body"}
							value={remote.body ?? ""}
							placeholder={'{"range": "last-12-months"}'}
							onChange={(value) => setRemote({body: value})}
						></TextArea>
					}
					<ChartHeadersEditor
						headers={remote.headers}
						onChange={(headers) => setRemote({headers: headers})}
					></ChartHeadersEditor>
					<div className="blue-orange-chart-config-row">
						<Input
							label={"Refresh every (seconds)"}
							value={String(remote.refreshSeconds)}
							isNumber={true}
							onChange={(value) => setRemote({refreshSeconds: Math.max(0, Number(value) || 0)})}
						></Input>
						<div className="blue-orange-chart-config-inline-action">
							<Button
								text={"Fetch data"}
								icon={"ri-download-cloud-2-line"}
								size={ButtonSize.SMALL}
								isLoading={busy}
								buttonType={ButtonType.SECONDARY}
								onClick={handleFetch}
							></Button>
						</div>
					</div>
					<div className="blue-orange-chart-config-hint">
						The endpoint must return JSON in this shape (or an array of row objects). Set a
						response path when the rows are nested inside a wrapper object. A refresh of 0
						fetches only when the block is opened.
					</div>
					<pre className="blue-orange-chart-config-code">{REMOTE_FORMAT_EXAMPLE}</pre>
				</div>
			}

			{busy && <div className="blue-orange-chart-config-status">
				<Spinner size={SpinnerSize.SMALL} label={"Reading data…"}></Spinner>
			</div>}
			{error !== "" && <div className="blue-orange-chart-config-error">{error}</div>}
			{error === "" && notice !== "" && <div className="blue-orange-chart-config-notice">{notice}</div>}

			{source.columns.length > 0 &&
				<div className="blue-orange-chart-config-section">
					<div className="blue-orange-chart-config-section-title">Columns</div>
					<ChartSelect
						label={"X axis / labels"}
						value={data.labelColumn}
						filter={source.columns.length > 8}
						options={[{value: "", label: "Row number"}].concat(
							source.columns.map((column) => ({value: column, label: column}))
						)}
						onChange={(value) => onChange({...data, labelColumn: value})}
					></ChartSelect>
					<div className="blue-orange-chart-preview">
						<table>
							<thead>
							<tr>
								{source.columns.map((column) => (
									<th key={column}>{column}</th>
								))}
							</tr>
							</thead>
							<tbody>
							{previewRows.map((row, index) => (
								<tr key={index}>
									{source.columns.map((column) => (
										<td key={column}>{row[column] == null ? "" : String(row[column])}</td>
									))}
								</tr>
							))}
							</tbody>
						</table>
					</div>
					<div className="blue-orange-chart-config-hint">
						Showing {previewRows.length} of {source.rows.length} rows.
					</div>
				</div>
			}
		</div>
	);
};

interface HeadersProps {
	headers: Record<string, string>,
	onChange: (headers: Record<string, string>) => void,
}

/**
 * Key/value editor for the request headers sent to the data server.
 *
 * The rows live in local state rather than being derived from the stored
 * object: a header is only stored once it has a name, so a freshly added
 * (still empty) row has nowhere to live in the parent's value.
 */
const ChartHeadersEditor: React.FC<HeadersProps> = ({headers, onChange}) => {

	const [rows, setRows] = useState<Array<[string, string]>>(
		() => Object.keys(headers).map((key) => [key, headers[key]] as [string, string])
	);

	const apply = (next: Array<[string, string]>) => {
		setRows(next);
		const out: Record<string, string> = {};
		for (const [key, value] of next) {
			if (key.trim() !== "") {
				out[key.trim()] = value;
			}
		}
		onChange(out);
	};

	return (
		<div className="blue-orange-chart-headers">
			<div className="blue-orange-chart-config-label">Headers</div>
			{rows.map(([key, value], index) => (
				<div className="blue-orange-chart-header-row" key={index}>
					<Input
						value={key}
						placeholder={"Header"}
						onChange={(next) => {
							const copy = rows.slice();
							copy[index] = [next, value];
							apply(copy);
						}}
					></Input>
					<Input
						value={value}
						placeholder={"Value"}
						onChange={(next) => {
							const copy = rows.slice();
							copy[index] = [key, next];
							apply(copy);
						}}
					></Input>
					<ButtonIcon
						icon={"ri-delete-bin-7-line"}
						size={ButtonSize.SMALL}
						onClick={() => apply(rows.filter((_e, i) => i !== index))}
					></ButtonIcon>
				</div>
			))}
			<Button
				text={"Add header"}
				icon={"ri-add-line"}
				size={ButtonSize.SMALL}
				buttonType={ButtonType.CLEAR}
				onClick={() => apply(rows.concat([["", ""]]))}
			></Button>
		</div>
	);
};
