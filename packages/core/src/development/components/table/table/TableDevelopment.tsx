import React, {useState} from "react";

import './TableDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
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
		<PaddedPage>
			<PageHeading>Table</PageHeading>
			<Paragraph>
				The table primitives underneath DataTable. Table wraps a THead, TBody and TFooter of Rows, and each
				column picks the cell that matches its data — text, number, currency, date, json, markdown — so the
				formatting and alignment come for free. The DATASET theme is the plain grid, OBJECT_LIST is the
				bordered list style.
			</Paragraph>

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
		</PaddedPage>
	)
}
