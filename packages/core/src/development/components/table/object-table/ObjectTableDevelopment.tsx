import React, {useState} from "react";

import './ObjectTableDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {Table, TableTheme} from "../../../../components/table/table/Table";
import {THead} from "../../../../components/table/thead/THead";
import {TBody} from "../../../../components/table/tbody/TBody";
import {Row} from "../../../../components/table/row/Row";
import {HeaderCell} from "../../../../components/table/cells/headercell/HeaderCell";
import {TextDataCell} from "../../../../components/table/cells/text-data-cell/TextDataCell";
import {CheckboxCell} from "../../../../components/table/cells/checkboxcell/CheckboxCell";
import {PrimaryCell} from "../../../../components/table/cells/primarycell/PrimaryCell";

interface Props {
}

export const ObjectTableDevelopment: React.FC<Props> = ({}) => {

	const [checked, setChecked] = useState(false);

	return (
		<PaddedPage>
			<PageHeading>Object Table</PageHeading>
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
						</Row>
					</TBody>
				</Table>
			</div>
		</PaddedPage>
	)
}
