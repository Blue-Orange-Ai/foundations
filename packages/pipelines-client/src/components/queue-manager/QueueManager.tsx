import React from "react";

import './QueueManager.css'
import {
	ButtonIcon, Cell,
	Description,
	HeaderCell,
	PageHeading, PrimaryCell,
	Row,
	SearchInput,
	Table,
	TableTheme, TBody,
	THead, TimeDisplay
} from "@blue-orange-ai/foundations-core";

interface Props {
}

export const QueueManager: React.FC<Props> = ({}) => {


	return (
		<div className="blue-orange-pipeline-queue-manager">
			<div className="blue-orange-pipeline-queue-manager-internal-cont">
				<div className="blue-orange-pipeline-queue-manager-page-heading">
					<PageHeading>Queues</PageHeading>
					<ButtonIcon icon={"ri-add-line"} label={"Create Queue"}></ButtonIcon>
				</div>
				<div className="blue-orange-pipeline-queue-manager-search">
					<div className="blue-orange-pipeline-queue-manager-search-input">
						<SearchInput></SearchInput>
					</div>
					<div className="blue-orange-pipeline-queue-manager-metrics"><Description>250 queues</Description></div>
				</div>
				<div className="blue-orange-pipeline-queue-table">
					<Table theme={TableTheme.OBJECT_LIST}>
						<THead>
							<Row>
								<HeaderCell>Name</HeaderCell>
								<HeaderCell>Created</HeaderCell>
								<HeaderCell>Last Seen</HeaderCell>
							</Row>
						</THead>
						<TBody>
							<Row>
								<PrimaryCell text={"Name of the Queue"} secondaryText={"Secondary Text"}></PrimaryCell>
								<Cell><Description><TimeDisplay targetDate={new Date()} timeFormat={"12hr"} dateFormat={"dd/mm/yyyy"}></TimeDisplay></Description></Cell>
								<Cell><Description><TimeDisplay targetDate={new Date()} timeFormat={"12hr"} dateFormat={"dd/mm/yyyy"}></TimeDisplay></Description></Cell>
							</Row>
						</TBody>
					</Table>
				</div>
			</div>

		</div>
	)
}