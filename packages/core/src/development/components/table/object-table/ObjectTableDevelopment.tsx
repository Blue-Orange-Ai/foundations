import React, {useState} from "react";

import './ObjectTableDevelopment.css'
import {Table, TableTheme} from "../../../../components/table/table/Table";
import {THead} from "../../../../components/table/thead/THead";
import {TBody} from "../../../../components/table/tbody/TBody";
import {Row} from "../../../../components/table/row/Row";
import {HeaderCell} from "../../../../components/table/cells/headercell/HeaderCell";
import {TextDataCell} from "../../../../components/table/cells/text-data-cell/TextDataCell";
import {CheckboxCell} from "../../../../components/table/cells/checkboxcell/CheckboxCell";
import {PrimaryCell} from "../../../../components/table/cells/primarycell/PrimaryCell";
import {MarkdownDataCell} from "../../../../components/table/cells/markdown-data-cell/MarkdownDataCell";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const OBJECT_TABLE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "A THead and a TBody of rows, exactly as the dataset table takes them."
	},
	{
		name: "theme",
		type: "TableTheme",
		default: "TableTheme.DATASET",
		defaultValue: TableTheme.DATASET,
		control: "select",
		value: TableTheme.OBJECT_LIST,
		options: [
			{label: "Object list", value: TableTheme.OBJECT_LIST, code: "TableTheme.OBJECT_LIST"},
			{label: "Dataset", value: TableTheme.DATASET, code: "TableTheme.DATASET"}
		],
		description: "OBJECT_LIST is what makes this a list of records — taller rows, softer rules, room for a picture."
	},
	{
		name: "containerRef",
		type: "React.Ref<HTMLDivElement>",
		description: "A handle on the scrolling container."
	},
	{
		name: "overlay",
		type: "ReactNode",
		description: "Drawn over the table — an empty state, a loading veil, a selection banner."
	},
	{
		name: "tableStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the table element itself."
	}
];

interface Props {
}

export const ObjectTableDevelopment: React.FC<Props> = ({}) => {

	const [checked, setChecked] = useState(false);

	return (
		<ComponentDoc
			title="Object Table"
			description="A list of records rather than a grid of data — the same Table primitives under TableTheme.OBJECT_LIST, which gives the rows room to carry a picture, a name and a second line. Reach for it where each row is a thing rather than a reading."
			name="Table"
			previewHeight={280}
			previewCentered={false}
			imports={["TableTheme", "THead", "TBody", "Row", "HeaderCell", "PrimaryCell", "TextDataCell"]}
			props={OBJECT_TABLE_PROPS}
			snippetChildren={() => "<THead>\n\t<tr>\n\t\t<HeaderCell>Object</HeaderCell>\n\t\t<HeaderCell>Status</HeaderCell>\n\t</tr>\n</THead>\n<TBody>\n\t<Row>\n\t\t<PrimaryCell text={\"Melbourne Depot\"} secondaryText={\"Operational since 2019\"}></PrimaryCell>\n\t\t<TextDataCell text={\"Active\"}></TextDataCell>\n\t</Row>\n</TBody>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Table theme={values.theme}>
						<THead>
							<tr>
								<HeaderCell>Object</HeaderCell>
								<HeaderCell>Status</HeaderCell>
								<HeaderCell>Description</HeaderCell>
							</tr>
						</THead>
						<TBody>
							<Row>
								<PrimaryCell
									text={"Melbourne Depot"}
									secondaryText={"Operational since 2019"}></PrimaryCell>
								<TextDataCell text={"Active"}></TextDataCell>
								<TextDataCell text={"Six bays, two of them refrigerated."}></TextDataCell>
							</Row>
							<Row>
								<PrimaryCell
									text={"Geelong Yard"}
									secondaryText={"Reduced capacity"}></PrimaryCell>
								<TextDataCell text={"Degraded"}></TextDataCell>
								<TextDataCell text={"Dispatch only until the resurfacing is done."}></TextDataCell>
							</Row>
						</TBody>
					</Table>
				</div>
			)}>
			<div className="blue-orange-object-table-development">
				<Table theme={TableTheme.OBJECT_LIST}>
					<THead>
						<tr>
							<HeaderCell>
								<div className="blue-orange-object-table-development-header">Object</div>
							</HeaderCell>
							<HeaderCell>
								<div className="blue-orange-object-table-development-header">Status</div>
							</HeaderCell>
							<HeaderCell>
								<div className="blue-orange-object-table-development-header">Flag</div>
							</HeaderCell>
							<HeaderCell>
								<div className="blue-orange-object-table-development-header">Description</div>
							</HeaderCell>
						</tr>
					</THead>
					<TBody>
						<Row>
							<PrimaryCell
								text={"Example Object"}
								secondaryText={"Secondary text"}
								src={"https://placehold.co/84x84"}
							></PrimaryCell>
							<TextDataCell text={"Active"}></TextDataCell>
							<CheckboxCell state={checked} onClick={setChecked}></CheckboxCell>
							<MarkdownDataCell text={"**Bold text** and *italic* with `inline code`"}></MarkdownDataCell>
						</Row>
						<Row>
							<PrimaryCell
								text={"Another Object"}
								secondaryText={"With markdown description"}
								src={"https://placehold.co/84x84"}
							></PrimaryCell>
							<TextDataCell text={"Pending"}></TextDataCell>
							<CheckboxCell state={!checked} onClick={() => setChecked(!checked)}></CheckboxCell>
							<MarkdownDataCell text={"[Link example](https://example.com) and ~~strikethrough~~"}></MarkdownDataCell>
						</Row>
						<Row>
							<PrimaryCell
								text={"Third Object"}
								secondaryText={"List example"}
								src={"https://placehold.co/84x84"}
							></PrimaryCell>
							<TextDataCell text={"Complete"}></TextDataCell>
							<CheckboxCell state={true} onClick={() => {}}></CheckboxCell>
							<MarkdownDataCell text={"- Item one\n- Item two\n- Item three"}></MarkdownDataCell>
						</Row>
					</TBody>
				</Table>
			</div>
		</ComponentDoc>
	)
}
