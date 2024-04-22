import React, {useState} from "react";

import './Workspace.css'
import {Table} from "../../components/table/table/Table";
import {THead} from "../../components/table/thead/THead";
import {Cell} from "../../components/table/cells/cell/Cell";
import {HeaderCell} from "../../components/table/cells/headercell/HeaderCell";
import {Row} from "../../components/table/row/Row";
import {TBody} from "../../components/table/tbody/TBody";
import {CellAlignment} from "../../interfaces/AppInterfaces";
import {CheckboxCell} from "../../components/table/cells/checkboxcell/CheckboxCell";
import {Avatar} from "../../components/avatar/avatar/Avatar";
import {PassportAvatar, User} from "@blue-orange-ai/foundations-clients/lib/Passport";
import {AvatarList} from "../../components/avatar/avatarlist/AvatarList";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {

	const [isLoading, setIsLoading] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const avatar: PassportAvatar = {
		enabled: true,
		mediaId: 1,
		uri: "http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ"
	}

	const user: User = {
		address: undefined,
		avatar: avatar,
		color: "",
		created: new Date(),
		defaultUser: false,
		disabled: false,
		domain: "internal",
		email: "tom@blueorange.ai",
		forcePasswordReset: false,
		lastActive: new Date(),
		locked: false,
		name: "Tom Seneviratne",
		notes: "",
		serviceUser: false,
		telephone: undefined,
		username: "tom"

	}

	const btnClick = () => {
		setError(true);
	}

	const finishSuccess = () => {
		setSuccess(false);
	}

	const finishError = () => {
		setError(false);
	}

	return (
		<div className="workspace-main-window">
			<div className="workspace-display-window">
				<Avatar user={user} height={42} width={42} tooltip={true}></Avatar>
				<AvatarList users={[user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user]} overlap={30}></AvatarList>
				{/*<Table>*/}
				{/*	<THead>*/}
				{/*		<Row>*/}
				{/*			<CheckboxCell state={true}></CheckboxCell>*/}
				{/*			<HeaderCell dropdownItems={[{label: "Sort ASC", icon: "ri-sort-asc", value: "SORT_ASC"}]}>Header 2</HeaderCell>*/}
				{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 3</HeaderCell>*/}
				{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 4</HeaderCell>*/}
				{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 5</HeaderCell>*/}
				{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 6</HeaderCell>*/}
				{/*		</Row>*/}
				{/*	</THead>*/}
				{/*	<TBody>*/}
				{/*		<Row>*/}
				{/*			<CheckboxCell state={true}></CheckboxCell>*/}
				{/*			<Cell alignment={CellAlignment.RIGHT}>Hello 2</Cell>*/}
				{/*			<Cell>Hello 3</Cell>*/}
				{/*			<Cell alignment={CellAlignment.LEFT}>Hello 4</Cell>*/}
				{/*			<Cell>Hello 5</Cell>*/}
				{/*			<Cell>Hello 6</Cell>*/}
				{/*		</Row>*/}
				{/*	</TBody>*/}
				{/*</Table>*/}
			</div>
		</div>
	)
}