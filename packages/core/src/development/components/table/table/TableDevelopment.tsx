import React, {useState} from "react";

import './TableDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Table, TableTheme} from "../../../../components/table/table/Table";
import {THead} from "../../../../components/table/thead/THead";
import {TBody} from "../../../../components/table/tbody/TBody";
import {TFooter} from "../../../../components/table/tfooter/TFooter";
import {Row} from "../../../../components/table/row/Row";
import {HeaderCell} from "../../../../components/table/cells/headercell/HeaderCell";
import {PrimaryCell} from "../../../../components/table/cells/primarycell/PrimaryCell";
import {CheckboxCell} from "../../../../components/table/cells/checkboxcell/CheckboxCell";
import {TextDataCell} from "../../../../components/table/cells/text-data-cell/TextDataCell";
import {NumberDataCell} from "../../../../components/table/cells/number-data-cell/NumberDataCell";
import {CurrencyDataCell} from "../../../../components/table/cells/currency-data-cell/CurrencyDataCell";
import {DateDataCell} from "../../../../components/table/cells/date-data-cell/DateDataCell";
import {JsonObjDataCell} from "../../../../components/table/cells/json-obj-data-cell/JsonObjDataCell";
import {MarkdownDataCell} from "../../../../components/table/cells/markdown-data-cell/MarkdownDataCell";
import {LoadingCell} from "../../../../components/table/cells/loading-cell/LoadingCell";
import {Cell} from "../../../../components/table/cells/cell/Cell";
import {CellAlignment} from "../../../../components/interfaces/AppInterfaces";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {Badge} from "../../../../components/text-decorations/badge/Badge";

const DEMO_ROWS = [
	{site: "Melbourne Depot", status: "Operational", throughput: 12840},
	{site: "Geelong Yard", status: "Reduced capacity", throughput: 4120},
	{site: "Ballarat Substation", status: "Offline", throughput: 0}
];

const ALIGNMENT_OPTIONS = [
	{label: "Left", value: CellAlignment.LEFT, code: "CellAlignment.LEFT"},
	{label: "Center", value: CellAlignment.CENTER, code: "CellAlignment.CENTER"},
	{label: "Right", value: CellAlignment.RIGHT, code: "CellAlignment.RIGHT"}
];

const CELL_COMMON_PROPS: Array<PropSpec> = [
	{
		name: "multipleValues",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Takes an array rather than a single value, and renders each entry as its own tag."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the cell is clicked."
	},
	{
		name: "dropdownItems",
		type: "Array<IContextMenuItem>",
		description: "Rows for the cell's own context menu."
	},
	{
		name: "onDropdownSelected",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with whichever context menu row was picked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the cell."
	},
	{
		name: "tdProps",
		type: "React.TdHTMLAttributes<HTMLTableCellElement>",
		description: "Attributes passed through to the underlying td."
	}
];

const TABLE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "A THead, a TBody and — where there is one — a TFooter."
	},
	{
		name: "containerRef",
		type: "React.Ref<HTMLDivElement>",
		description: "A handle on the scrolling container, for a table that has to be scrolled from the outside."
	},
	{
		name: "overlay",
		type: "ReactNode",
		description: "Drawn over the table — an empty state, a loading veil, a selection banner."
	},
	{
		name: "tableStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the table element itself, rather than on its container."
	},
	{
		name: "theme",
		type: "TableTheme",
		default: "TableTheme.DATASET",
		defaultValue: TableTheme.DATASET,
		control: "select",
		options: [
			{label: "Dataset", value: TableTheme.DATASET, code: "TableTheme.DATASET"},
			{label: "Object list", value: TableTheme.OBJECT_LIST, code: "TableTheme.OBJECT_LIST"}
		],
		description: "DATASET is the dense grid for data; OBJECT_LIST is the roomier treatment for a list of records."
	}
];

const SECTION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "The rows in the section."
	}
];

const ROW_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "The cells of the row."
	},
	{
		name: "background",
		type: "string",
		default: "\"transparent\"",
		control: "color",
		description: "The row's resting background."
	},
	{
		name: "hoverEffect",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether the row lights up under the pointer. Off for a header row."
	},
	{
		name: "hoverBackgroundColor",
		type: "string",
		control: "color",
		description: "The hover background. Left off it follows the light and dark themes."
	},
	{
		name: "onClick",
		type: "(id: string) => void",
		description: "Fires with the row's id when it is clicked."
	},
	{
		name: "id",
		type: "string",
		description: "Identifies the row. One is generated when it is left off."
	},
	{
		name: "rowRef",
		type: "React.Ref<HTMLTableRowElement>",
		description: "A handle on the tr, for scrolling a row into view."
	}
];

const HEADER_CELL_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Site",
		hideFromSnippet: true,
		description: "The column's heading."
	},
	{
		name: "dropdownItems",
		type: "Array<IContextMenuItem>",
		default: "[]",
		description: "Rows for the column's own dropdown."
	},
	{
		name: "resizable",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a drag handle on the column's trailing edge."
	},
	{
		name: "sorted",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks the column as the one the table is sorted by."
	},
	{
		name: "sortAsc",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Which way that sort runs."
	},
	{
		name: "hover",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Forces the hover treatment on, for a header driven from the outside."
	},
	{
		name: "rowId",
		type: "string",
		default: "\"\"",
		description: "Handed back through onClick."
	},
	{
		name: "onClick",
		type: "(rowId: string) => void",
		description: "Fires when the heading is clicked — usually what changes the sort."
	},
	{
		name: "onMouseDown",
		type: "(e: React.MouseEvent) => void",
		description: "Fires on mouse down, which is where column reordering starts."
	},
	{
		name: "onResizeMouseDown",
		type: "(e: React.MouseEvent) => void",
		description: "Fires on mouse down over the resize handle."
	},
	{
		name: "onDropdownSelected",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with whichever dropdown row was picked."
	},
	{
		name: "cellRef",
		type: "(el: HTMLTableCellElement | null) => void",
		description: "A handle on the th, used for measuring columns."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the heading."
	},
	{
		name: "tdProps",
		type: "React.TdHTMLAttributes<HTMLTableCellElement>",
		description: "Attributes passed through to the underlying cell."
	}
];

const CELL_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "Whatever the cell should show."
	},
	{
		name: "alignment",
		type: "CellAlignment",
		default: "CellAlignment.LEFT",
		defaultValue: CellAlignment.LEFT,
		control: "select",
		options: ALIGNMENT_OPTIONS,
		description: "Which way the content is aligned."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the cell is clicked."
	},
	{
		name: "dropdownItems",
		type: "Array<IContextMenuItem>",
		description: "Rows for the cell's own context menu."
	},
	{
		name: "onDropdownSelected",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with whichever context menu row was picked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the cell."
	}
];

const TEXT_CELL_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "any",
		required: true,
		control: "text",
		value: "Melbourne Depot",
		description: "The string to show, or an array of them when multipleValues is on."
	},
	{
		name: "alignment",
		type: "CellAlignment",
		default: "CellAlignment.LEFT",
		defaultValue: CellAlignment.LEFT,
		control: "select",
		options: ALIGNMENT_OPTIONS,
		description: "Which way the content is aligned."
	},
	...CELL_COMMON_PROPS
];

const NUMBER_CELL_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "any",
		required: true,
		control: "number",
		value: 1284000,
		description: "The number to show."
	},
	{
		name: "decimalPlaces",
		type: "number",
		control: "number",
		description: "Pins the output to this many decimal places."
	},
	{
		name: "pretty",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Locale-formats the number with thousands separators. Off, the digits are shown as they are."
	},
	{
		name: "alignment",
		type: "CellAlignment",
		default: "CellAlignment.CENTER",
		defaultValue: CellAlignment.CENTER,
		control: "select",
		options: ALIGNMENT_OPTIONS,
		description: "Which way the content is aligned."
	},
	...CELL_COMMON_PROPS
];

const CURRENCY_CELL_PROPS: Array<PropSpec> = [
	{
		name: "amount",
		type: "any",
		required: true,
		control: "number",
		value: 1284.5,
		description: "The amount, in whole currency units."
	},
	{
		name: "currency",
		type: "string",
		default: "\"AUD\"",
		control: "select",
		options: [
			{label: "AUD", value: "AUD"},
			{label: "USD", value: "USD"},
			{label: "EUR", value: "EUR"},
			{label: "GBP", value: "GBP"}
		],
		description: "An ISO 4217 code."
	},
	{
		name: "alignment",
		type: "CellAlignment",
		default: "CellAlignment.CENTER",
		defaultValue: CellAlignment.CENTER,
		control: "select",
		options: ALIGNMENT_OPTIONS,
		description: "Which way the content is aligned."
	},
	...CELL_COMMON_PROPS
];

const DATE_CELL_PROPS: Array<PropSpec> = [
	{
		name: "date",
		type: "any",
		required: true,
		control: "text",
		value: "2026-08-25T14:30:00",
		description: "The date to show."
	},
	{
		name: "dateformat",
		type: "string",
		control: "select",
		options: [
			{label: "ISO", value: ""},
			{label: "DD MMM YYYY", value: "DD MMM YYYY"},
			{label: "DD/MM/YYYY", value: "DD/MM/YYYY"},
			{label: "MMM Do, YYYY", value: "MMM Do, YYYY"}
		],
		description: "A moment format string."
	},
	{
		name: "alignment",
		type: "CellAlignment",
		default: "CellAlignment.CENTER",
		defaultValue: CellAlignment.CENTER,
		control: "select",
		options: ALIGNMENT_OPTIONS,
		description: "Which way the content is aligned."
	},
	...CELL_COMMON_PROPS
];

const PRIMARY_CELL_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "any",
		required: true,
		control: "text",
		value: "Melbourne Depot",
		description: "The row's name."
	},
	{
		name: "secondaryText",
		type: "any",
		control: "text",
		value: "Operational since 2019",
		description: "The muted second line."
	},
	{
		name: "src",
		type: "string",
		description: "A picture shown before the text."
	},
	{
		name: "imgHeight",
		type: "number",
		default: "42",
		control: "slider",
		min: 24,
		max: 72,
		step: 2,
		description: "How large that picture is."
	},
	{
		name: "multipleValues",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Takes an array rather than a single value."
	},
	{
		name: "hover",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Forces the hover treatment on."
	},
	{
		name: "rowId",
		type: "string",
		default: "\"\"",
		description: "Handed back through onClick."
	},
	{
		name: "dropdownItems",
		type: "Array<IContextMenuItem>",
		description: "Rows for the cell's own context menu."
	},
	{
		name: "onDropdownSelected",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with whichever context menu row was picked."
	},
	{
		name: "onClick",
		type: "(rowId: string) => void",
		description: "Fires with the row's id when the cell is clicked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the cell."
	}
];

const CHECKBOX_CELL_PROPS: Array<PropSpec> = [
	{
		name: "state",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Whether the row is selected."
	},
	{
		name: "onClick",
		type: "(state: boolean) => void",
		description: "Fires with what the selection has become."
	},
	{
		name: "rowId",
		type: "string",
		default: "\"\"",
		description: "Identifies the row the checkbox belongs to."
	},
	{
		name: "dropdownItems",
		type: "Array<IContextMenuItem>",
		description: "Rows for the cell's own context menu."
	},
	{
		name: "onDropdownSelected",
		type: "(item: IContextMenuItem) => void",
		description: "Fires with whichever context menu row was picked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the cell."
	}
];

const LOADING_CELL_PROPS: Array<PropSpec> = [
	{
		name: "headerCell",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Styles the placeholder as a heading rather than a body cell."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the cell."
	}
];

interface Props {
}

interface DemoRow {
	id: string,
	name: string,
	owner: string,
	seats: number,
	spend: number,
	renews: Date,
	meta: object,
	notes: string,
}

const ROWS: Array<DemoRow> = [
	{
		id: "acme",
		name: "Acme Corp",
		owner: "Ada Lovelace",
		seats: 128,
		spend: 48210.5,
		renews: new Date(2026, 10, 14),
		meta: {plan: "enterprise", sso: true},
		notes: "**Priority** support — see the [runbook](#)",
	},
	{
		id: "orbit",
		name: "Orbit Labs",
		owner: "Grace Hopper",
		seats: 24,
		spend: 3120,
		renews: new Date(2026, 8, 1),
		meta: {plan: "team", sso: false},
		notes: "Trial converted in `March`",
	},
	{
		id: "northwind",
		name: "Northwind",
		owner: "Alan Turing",
		seats: 9,
		spend: 480.25,
		renews: new Date(2026, 7, 30),
		meta: {plan: "starter", sso: false},
		notes: "Self serve signup",
	},
];

const USAGE = `<Table theme={TableTheme.OBJECT_LIST}>
    <THead>
        <Row>
            <HeaderCell>Account</HeaderCell>
            <HeaderCell>Seats</HeaderCell>
        </Row>
    </THead>
    <TBody>
        <Row onClick={(id) => open(id)} id="acme">
            <PrimaryCell text="Acme Corp" secondaryText="Ada Lovelace"></PrimaryCell>
            <NumberDataCell value={128} alignment={CellAlignment.RIGHT}></NumberDataCell>
        </Row>
    </TBody>
    <TFooter>
        <Row><Cell>3 accounts</Cell></Row>
    </TFooter>
</Table>`;

export const TableDevelopment: React.FC<Props> = ({}) => {

	const [selected, setSelected] = useState<Array<string>>([]);

	const [lastClicked, setLastClicked] = useState<string>("-");

	const toggleSelected = (id: string) => {
		setSelected((previous) => previous.includes(id)
			? previous.filter((entry) => entry !== id)
			: [...previous, id]);
	}

	return (
		<ComponentDoc
			title="Table"
			description="The table primitives underneath DataTable. Table wraps a THead, TBody and TFooter of Rows, and each column picks the cell that matches its data — text, number, currency, date, json, markdown — so a table can be assembled by hand where DataTable's schema is not the right fit."
			name="Table"
			previewHeight={260}
			previewCentered={false}
			imports={["THead", "TBody", "Row", "HeaderCell", "TextDataCell", "TableTheme"]}
			props={TABLE_PROPS}
			snippetChildren={() => "<THead>\n\t<Row>\n\t\t<HeaderCell>Site</HeaderCell>\n\t\t<HeaderCell>Status</HeaderCell>\n\t</Row>\n</THead>\n<TBody>\n\t<Row>\n\t\t<TextDataCell text={\"Melbourne Depot\"}></TextDataCell>\n\t\t<TextDataCell text={\"Operational\"}></TextDataCell>\n\t</Row>\n</TBody>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Table theme={values.theme}>
						<THead>
							<Row hoverEffect={false}>
								<HeaderCell>Site</HeaderCell>
								<HeaderCell>Status</HeaderCell>
								<HeaderCell>Throughput</HeaderCell>
							</Row>
						</THead>
						<TBody>
							{DEMO_ROWS.map(row => (
								<Row key={row.site}>
									<TextDataCell text={row.site}></TextDataCell>
									<TextDataCell text={row.status}></TextDataCell>
									<NumberDataCell value={row.throughput} pretty={true}></NumberDataCell>
								</Row>
							))}
						</TBody>
					</Table>
				</div>
			)}
			siblings={[
				{
					name: "Row",
					description: "One row. Its hover treatment is on by default and can be recoloured, or turned off for a header row.",
					props: ROW_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "TextDataCell"],
					snippetChildren: () => "<TextDataCell text={\"Melbourne Depot\"}></TextDataCell>",
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={values.hoverEffect} background={values.background}>
										<TextDataCell text="Melbourne Depot"></TextDataCell>
										<TextDataCell text="Operational"></TextDataCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "HeaderCell",
					description: "A column heading. It carries the sort arrows, the resize handle and the column's own dropdown.",
					props: HEADER_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "THead", "Row"],
					snippetChildren: () => "Site",
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<THead>
									<Row hoverEffect={false}>
										<HeaderCell
											resizable={values.resizable}
											sorted={values.sorted}
											sortAsc={values.sortAsc}>{values.children}</HeaderCell>
										<HeaderCell>Status</HeaderCell>
									</Row>
								</THead>
							</Table>
						</div>
					)
				},
				{
					name: "Cell",
					description: "The plain cell, for content the typed cells do not cover. Everything inside it is yours to render.",
					props: CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row", "CellAlignment"],
					snippetChildren: () => "<Badge>Operational</Badge>",
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<Cell alignment={values.alignment}><Badge>Operational</Badge></Cell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "TextDataCell",
					description: "A string. With multipleValues on it takes an array and renders each one as its own tag.",
					props: TEXT_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<TextDataCell
											text={values.multipleValues ? ["Storage", "Dispatch"] : values.text}
											multipleValues={values.multipleValues}
											alignment={values.alignment}></TextDataCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "NumberDataCell",
					description: "A number, right aligned by default. `pretty` turns on the locale's thousands separators.",
					props: NUMBER_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<NumberDataCell
											value={values.value}
											decimalPlaces={values.decimalPlaces}
											pretty={values.pretty}
											alignment={values.alignment}></NumberDataCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "CurrencyDataCell",
					description: "An amount of money, formatted for the currency it is in.",
					props: CURRENCY_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<CurrencyDataCell
											amount={values.amount}
											currency={values.currency}
											alignment={values.alignment}></CurrencyDataCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "DateDataCell",
					description: "A date, in whatever moment format the column asks for.",
					props: DATE_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<DateDataCell
											date={values.date}
											dateformat={values.dateformat}
											alignment={values.alignment}></DateDataCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "PrimaryCell",
					description: "The identifying column of a row: a picture, a name, and a second line under it.",
					props: PRIMARY_CELL_PROPS,
					previewHeight: 150,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<PrimaryCell
											text={values.text}
											secondaryText={values.secondaryText}
											imgHeight={values.imgHeight}></PrimaryCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "CheckboxCell",
					description: "The selection column at the head of a row.",
					props: CHECKBOX_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<CheckboxCell state={values.state}></CheckboxCell>
										<TextDataCell text="Melbourne Depot"></TextDataCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "LoadingCell",
					description: "A shimmering placeholder in the shape of a cell, for the rows a table draws while it waits.",
					props: LOADING_CELL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["Table", "TBody", "Row"],
					preview: values => (
						<div style={{width: "100%"}}>
							<Table>
								<TBody>
									<Row hoverEffect={false}>
										<LoadingCell headerCell={values.headerCell}></LoadingCell>
										<LoadingCell headerCell={values.headerCell}></LoadingCell>
									</Row>
								</TBody>
							</Table>
						</div>
					)
				},
				{
					name: "THead",
					description: "The header section. It is a plain thead with the library's styling.",
					props: SECTION_PROPS,
					previewHeight: 120,
					previewCentered: false,
					snippetChildren: () => "<Row>\n\t<HeaderCell>Site</HeaderCell>\n</Row>",
					preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>A section wrapper — see the Table demo above.</span>)
				},
				{
					name: "TBody",
					description: "The body section, holding the rows.",
					props: SECTION_PROPS,
					previewHeight: 120,
					previewCentered: false,
					snippetChildren: () => "<Row>\n\t<TextDataCell text={\"Melbourne Depot\"}></TextDataCell>\n</Row>",
					preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>A section wrapper — see the Table demo above.</span>)
				},
				{
					name: "TFooter",
					description: "The footer section, for totals and the like.",
					props: SECTION_PROPS,
					previewHeight: 120,
					previewCentered: false,
					snippetChildren: () => "<Row>\n\t<TextDataCell text={\"3 sites\"}></TextDataCell>\n</Row>",
					preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>A section wrapper — see the Table demo above.</span>)
				}
			]}>

			<div className="table-dev-section">
				<FormHeading label="Object list theme, one of every cell"></FormHeading>
				<Table theme={TableTheme.OBJECT_LIST}>
					<THead>
						<Row>
							<HeaderCell style={{width: "40px"}}>{""}</HeaderCell>
							<HeaderCell>Account</HeaderCell>
							<HeaderCell>Owner</HeaderCell>
							<HeaderCell>Seats</HeaderCell>
							<HeaderCell>Spend</HeaderCell>
							<HeaderCell>Renews</HeaderCell>
							<HeaderCell>Metadata</HeaderCell>
							<HeaderCell>Notes</HeaderCell>
						</Row>
					</THead>
					<TBody>
						{ROWS.map((row) => (
							<Row key={row.id} id={row.id} onClick={(id) => setLastClicked(id)}>
								<CheckboxCell
									state={selected.includes(row.id)}
									rowId={row.id}
									onClick={() => toggleSelected(row.id)}></CheckboxCell>
								<PrimaryCell text={row.name} secondaryText={row.owner}></PrimaryCell>
								<TextDataCell text={row.owner}></TextDataCell>
								<NumberDataCell value={row.seats} alignment={CellAlignment.RIGHT}></NumberDataCell>
								<CurrencyDataCell amount={row.spend} currency="GBP"
												  alignment={CellAlignment.RIGHT}></CurrencyDataCell>
								<DateDataCell date={row.renews} dateformat="DD/MM/YYYY"></DateDataCell>
								<JsonObjDataCell obj={row.meta}></JsonObjDataCell>
								<MarkdownDataCell text={row.notes}></MarkdownDataCell>
							</Row>
						))}
					</TBody>
					<TFooter>
						<Row hoverEffect={false}>
							<Cell>{""}</Cell>
							<Cell>{ROWS.length} accounts</Cell>
							<Cell>{""}</Cell>
							<Cell>{ROWS.reduce((total, row) => total + row.seats, 0)} seats</Cell>
							<Cell>{""}</Cell>
							<Cell>{""}</Cell>
							<Cell>{""}</Cell>
							<Cell>{""}</Cell>
						</Row>
					</TFooter>
				</Table>
				<div className="table-dev-output">
					Last row clicked: {lastClicked} — selected: {selected.length ? selected.join(", ") : "none"}
				</div>
			</div>

			<div className="table-dev-section">
				<FormHeading label="Dataset theme with sortable headers"></FormHeading>
				<Table theme={TableTheme.DATASET}>
					<THead>
						<Row>
							<HeaderCell
								dropdownItems={[
									{label: "Sort ascending", icon: "ri-sort-asc", value: "ASC", type: 0},
									{label: "Sort descending", icon: "ri-sort-desc", value: "DESC", type: 0},
								]}
								onDropdownSelected={(item) => setLastClicked(String(item.value))}>Account</HeaderCell>
							<HeaderCell>Owner</HeaderCell>
							<HeaderCell>Seats</HeaderCell>
						</Row>
					</THead>
					<TBody>
						{ROWS.map((row) => (
							<Row key={row.id}>
								<TextDataCell text={row.name}></TextDataCell>
								<TextDataCell text={row.owner}></TextDataCell>
								<NumberDataCell value={row.seats} alignment={CellAlignment.RIGHT}></NumberDataCell>
							</Row>
						))}
					</TBody>
				</Table>
			</div>

			<div className="table-dev-section">
				<FormHeading label="Loading state"></FormHeading>
				<Table theme={TableTheme.OBJECT_LIST}>
					<THead>
						<Row>
							<LoadingCell headerCell={true}></LoadingCell>
							<LoadingCell headerCell={true}></LoadingCell>
							<LoadingCell headerCell={true}></LoadingCell>
						</Row>
					</THead>
					<TBody>
						{[0, 1, 2, 3].map((index) => (
							<Row key={index} hoverEffect={false}>
								<LoadingCell></LoadingCell>
								<LoadingCell></LoadingCell>
								<LoadingCell></LoadingCell>
							</Row>
						))}
					</TBody>
				</Table>
			</div>

			<div className="table-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
