import React from "react";

import './DocsTheme.css'
import './PropsTable.css'
import {PropSpec} from "./PropSpec";
import {Table} from "../../components/table/table/Table";
import {THead} from "../../components/table/thead/THead";
import {TBody} from "../../components/table/tbody/TBody";
import {Row} from "../../components/table/row/Row";
import {HeaderCell} from "../../components/table/cells/headercell/HeaderCell";
import {Cell} from "../../components/table/cells/cell/Cell";

interface Props {
	props: Array<PropSpec>;
}

/**
 * The interface as documentation — every prop with the type it is declared
 * with, what it falls back to, and what it does. Required props are marked
 * rather than reordered, so the table reads in the order of the interface.
 */
export const PropsTable: React.FC<Props> = ({props}) => {

	const documented = props.filter(spec => !spec.hideFromTable);

	if (documented.length === 0) {
		return <></>;
	}

	return (
		<div className="blue-orange-docs-props-table">
			<Table>
				<THead>
					<Row hoverEffect={false}>
						<HeaderCell>Prop</HeaderCell>
						<HeaderCell>Type</HeaderCell>
						<HeaderCell>Default</HeaderCell>
						<HeaderCell>Description</HeaderCell>
					</Row>
				</THead>
				<TBody>
					{documented.map(spec => (
						<Row key={spec.name} hoverEffect={false}>
							<Cell>
								<span className="blue-orange-docs-props-name">{spec.name}</span>
								{spec.required
									? <span className="blue-orange-docs-props-required">required</span>
									: <></>}
							</Cell>
							<Cell>
								<code className="blue-orange-docs-props-type">{spec.type}</code>
							</Cell>
							<Cell>
								{spec.default
									? <code className="blue-orange-docs-props-default">{spec.default}</code>
									: <span className="blue-orange-docs-props-empty">—</span>}
							</Cell>
							<Cell>
								<span className="blue-orange-docs-props-description">{spec.description}</span>
							</Cell>
						</Row>
					))}
				</TBody>
			</Table>
		</div>
	)
}
