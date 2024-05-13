import React, {useState} from "react";

import './Workspace.css'
import {Table} from "../../components/table/table/Table";
import {THead} from "../../components/table/thead/THead";
import {Cell} from "../../components/table/cells/cell/Cell";
import {HeaderCell} from "../../components/table/cells/headercell/HeaderCell";
import {Row} from "../../components/table/row/Row";
import {TBody} from "../../components/table/tbody/TBody";
import {CellAlignment, DropdownItem, DropdownItemType} from "../../interfaces/AppInterfaces";
import {CheckboxCell} from "../../components/table/cells/checkboxcell/CheckboxCell";
import {Avatar} from "../../components/avatar/avatar/Avatar";
import {Avatar as AvatarObj, User} from "@blue-orange-ai/foundations-clients/lib/Passport";
import {AvatarList} from "../../components/avatar/avatarlist/AvatarList";
import {PrimaryCell} from "../../components/table/cells/primarycell/PrimaryCell";
import {DropdownBasic} from "../../components/inputs/dropdown/basic/DropdownBasic";
import {Badge} from "../../components/text-decorations/badge/Badge";
import {Tag} from "../../components/text-decorations/tag/Tag";
import {Month} from "../../components/inputs/date/datepicker/items/month/Month";
import {DateInput} from "../../components/inputs/date/datepicker/inputs/dateinput/DateInput";
import {RichText} from "../../components/inputs/richtext/default/RichText";
import {EditorContent} from "@tiptap/react";
import {EmojiContainer} from "../../components/inputs/emoji/emoji-container/EmojiContainer";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {

	const [isLoading, setIsLoading] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const avatar: AvatarObj = {
		enabled: true,
		mediaId: "",
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

	const dropdownItems: Array<DropdownItem> = [
		{
			label: "Names",
			reference: "5",
			selected: false,
			type: DropdownItemType.HEADING
		},
		{
			label: "Lisbeth",
			reference: "1",
			selected: false,
			type: DropdownItemType.TEXT
		},
		{
			label: "Aruna",
			reference: "2",
			selected: false,
			type: DropdownItemType.TEXT
		},
		{
			label: "Lauren",
			reference: "3",
			selected: false,
			disabled: true,
			type: DropdownItemType.TEXT
		},
		{
			label: "Thomas",
			reference: "4",
			selected: true,
			type: DropdownItemType.TEXT
		},
		{
			label: "Persons",
			reference: "6",
			selected: false,
			type: DropdownItemType.HEADING
		},
		{
			label: "James",
			reference: "7",
			selected: false,
			src: "http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ",
			type: DropdownItemType.IMAGE
		}
	]

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
				{/*<Avatar user={user} height={42} width={42} tooltip={true}></Avatar>*/}
				{/*<AvatarList users={[user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user]} overlap={30}></AvatarList>*/}
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
				{/*		<Row hoverBackgroundColor={"red"}>*/}
				{/*			<CheckboxCell state={true}></CheckboxCell>*/}
				{/*			<PrimaryCell src={"http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ"} text={"Demonstration Primary Cell"} secondaryText={"This is where the secondary text goes"} style={{paddingLeft: "15px", paddingRight: "15px"}}></PrimaryCell>*/}
				{/*			<Cell>Hello 3</Cell>*/}
				{/*			<Cell alignment={CellAlignment.LEFT}>Hello 4</Cell>*/}
				{/*			<Cell>Hello 5</Cell>*/}
				{/*			<Cell>Hello 6</Cell>*/}
				{/*		</Row>*/}
				{/*	</TBody>*/}
				{/*</Table>*/}
				{/*<div style={{width: "200px"}}>*/}
				{/*	<DropdownBasic items={dropdownItems} filter={true} allowMultipleSelection={true}></DropdownBasic>*/}
				{/*</div>*/}
				{/*<Badge>Hello</Badge>*/}
				{/*<Tag>Hello</Tag>*/}
				{/*<DateInput displayFormat={"ddd, MMMM Do YYYY"}></DateInput>*/}
				<EmojiContainer></EmojiContainer>
				{/*<RichText minEditorHeight={10}></RichText>*/}
			</div>
		</div>
	)
}