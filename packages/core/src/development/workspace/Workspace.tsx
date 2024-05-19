import React, {useContext, useState} from "react";

import './Workspace.css'
import {DropdownItem, DropdownItemType} from "../../interfaces/AppInterfaces";
import {Avatar as AvatarObj, User} from "@blue-orange-ai/foundations-clients/lib/Passport";
import {ToastContext, ToastLocation, ToastProvider} from "../../components/alerts/toast/toastcontext/ToastContext";
import {Button, ButtonType} from "../../components/buttons/button/Button";

import {ToasterType} from "../../components/alerts/toast/toaster/Toaster";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {

	const { addToast } = useContext(ToastContext);

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
				{/*<EmojiContainer></EmojiContainer>*/}
				{/*<RichText minEditorHeight={10}></RichText>*/}
				{/*<Pdf src={"https://d8d6949rstsxl.cloudfront.net/public/BO-PDF-499ffd3b-f619-4522-9c4e-bdae1bee9f4c-Academic%20Test%201%20-%20Prompt%203%20-%20Measures%20of%20Poverty.pdf"}></Pdf>*/}
				{/*<Toaster heading={"Hello world this is a toaster"}></Toaster>*/}
				<Button text={"Test Toaster"} buttonType={ButtonType.PRIMARY} onClick={() => addToast({
					id: "abcdefghi",
					heading: "This is a test toaster",
					description: "This is where the description will go",
					location: ToastLocation.BOTTOM_RIGHT,
					toastType: ToasterType.DEFAULT,
					ttl: 5000
				})}></Button>

			</div>

		</div>
	)
}