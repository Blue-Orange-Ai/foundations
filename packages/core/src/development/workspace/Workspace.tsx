import React, {useContext, useState} from "react";

import './Workspace.css'
import {Avatar as AvatarObj, User, UserState} from "@blue-orange-ai/foundations-clients/lib/Passport";
import {ToastContext} from "../../components/alerts/toast/toastcontext/ToastContext";
import {SideBar, SideBarState} from "../../components/layouts/sidebar/default/SideBar";
import {SideBarHeader} from "../../components/layouts/sidebar/sidebar-header/SideBarHeader";
import {SideBarFooter} from "../../components/layouts/sidebar/sidebar-footer/SideBarFooter";
import {SideBarHeaderItem} from "../../components/layouts/sidebar/items/sidebar-header-item/SideBarHeaderItem";
import {Media} from "@blue-orange-ai/foundations-clients";
import {LineChart} from "../../components/charts/line/LineChart";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {

	const { addToast } = useContext(ToastContext);

	const [isLoading, setIsLoading] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const [sidebarState, setSidebarState] = useState(SideBarState.OPEN);

	const changeSidebarState = (state: SideBarState) => {
		setSidebarState(state);
	}

	const avatar: AvatarObj = {
		enabled: true,
		mediaId: 4,
		uri: "http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ"
	}

	const testMedia: Media = {
		"id": 4,
		"uuid": "zzAA2ixtQEOw6TMafUP6Uw",
		"location": "FILE",
		"filename": "jimmy-fermin-bqe0J0b26RQ-unsplash.jpg",
		"folder": "",
		"bucketname": "null",
		"mediaType": "IMAGE",
		"dateCreated": new Date(),
		"url": "http://localhost:8086/files/get/presigned/26nErnPuTIqy4zIR2xiaNg",
		"mediaPublic": false,
		"fragments": [
			{
				"id": 1,
				"height": 50,
				"width": 50,
				"referenceId": 1,
				"referenceUuid": "irgKuUubRjGlQ3woLsioJQ",
				"referenceUrl": "http://localhost:8086/files/get/presigned/Z8RzhPfRQvODtQofqKcWLg"
			},
			{
				"id": 2,
				"height": 250,
				"width": 250,
				"referenceId": 2,
				"referenceUuid": "_EE7afSSSICacYXNeOBJFw",
				"referenceUrl": "http://localhost:8086/files/get/presigned/JbrgVTagTou-dJ22vMa_XA"
			},
			{
				"id": 3,
				"height": 500,
				"width": 500,
				"referenceId": 3,
				"referenceUuid": "fYPJeyLRQpy2jDek-taS3A",
				"referenceUrl": "http://localhost:8086/files/get/presigned/YMua1wMETwCs99r4kvo_CA"
			}
		]
	}

	const user: User = {
		address: undefined,
		avatar: avatar,
		color: "",
		created: new Date(),
		defaultUser: false,
		domain: "internal",
		email: "tom@blueorange.ai",
		forcePasswordReset: false,
		lastActive: new Date(),
		name: "Tom Seneviratne",
		notes: "",
		serviceUser: false,
		telephone: undefined,
		username: "tom",
		state: UserState.ACTIVE
	}
	//
	// const dropdownItems: Array<DropdownItem> = [
	// 	{
	// 		label: "Names",
	// 		reference: "5",
	// 		selected: false,
	// 		type: DropdownItemType.HEADING
	// 	},
	// 	{
	// 		label: "Lisbeth",
	// 		reference: "1",
	// 		selected: false,
	// 		type: DropdownItemType.TEXT
	// 	},
	// 	{
	// 		label: "Aruna",
	// 		reference: "2",
	// 		selected: false,
	// 		type: DropdownItemType.TEXT
	// 	},
	// 	{
	// 		label: "Lauren",
	// 		reference: "3",
	// 		selected: false,
	// 		disabled: true,
	// 		type: DropdownItemType.TEXT
	// 	},
	// 	{
	// 		label: "Thomas",
	// 		reference: "4",
	// 		selected: true,
	// 		type: DropdownItemType.TEXT
	// 	},
	// 	{
	// 		label: "Persons",
	// 		reference: "6",
	// 		selected: false,
	// 		type: DropdownItemType.HEADING
	// 	},
	// 	{
	// 		label: "James",
	// 		reference: "7",
	// 		selected: false,
	// 		src: "http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ",
	// 		type: DropdownItemType.IMAGE
	// 	}
	// ]

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
		<LineChart labels={["January", "February", "March", "April"]} height={300} gridLines={true} dataset={[{
			label: "Subscribers",
			data: [1000,5000,4000,9000]
		},{
			label: "Something Else",
			data: [5000,3000,7000,2000]
		}]}></LineChart>
		// <SideBar state={sidebarState} changeState={changeSidebarState}>
		// 	<SideBarHeader>
		// 		<SideBarHeaderItem label="Blue Orange Ai" state={sidebarState} media={testMedia} changeState={changeSidebarState}></SideBarHeaderItem>
		// 	</SideBarHeader>
		// 	<SideBarFooter>
		// 		<div style={{color: "white"}}>Hello World</div>
		// 	</SideBarFooter>
		// </SideBar>
		// <div className="workspace-main-window">
		// 	<div className="workspace-display-window">
		// 		<Avatar user={user} height={350} width={350} tooltip={true}></Avatar>
		// 		{/*<AvatarList users={[user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user]} overlap={30}></AvatarList>*/}
		// 		{/*<Table>*/}
		// 		{/*	<THead>*/}
		// 		{/*		<Row>*/}
		// 		{/*			<CheckboxCell state={true}></CheckboxCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort ASC", icon: "ri-sort-asc", value: "SORT_ASC"}]}>Header 2</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 3</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 4</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 5</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 6</HeaderCell>*/}
		// 		{/*		</Row>*/}
		// 		{/*	</THead>*/}
		// 		{/*	<TBody>*/}
		// 		{/*		<Row hoverBackgroundColor={"red"}>*/}
		// 		{/*			<CheckboxCell state={true}></CheckboxCell>*/}
		// 		{/*			<PrimaryCell src={"http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ"} text={"Demonstration Primary Cell"} secondaryText={"This is where the secondary text goes"} style={{paddingLeft: "15px", paddingRight: "15px"}}></PrimaryCell>*/}
		// 		{/*			<Cell>Hello 3</Cell>*/}
		// 		{/*			<Cell alignment={CellAlignment.LEFT}>Hello 4</Cell>*/}
		// 		{/*			<Cell>Hello 5</Cell>*/}
		// 		{/*			<Cell>Hello 6</Cell>*/}
		// 		{/*		</Row>*/}
		// 		{/*	</TBody>*/}
		// 		{/*</Table>*/}
		// 		{/*<div style={{width: "200px"}}>*/}
		// 		{/*	<DropdownBasic items={dropdownItems} filter={true} allowMultipleSelection={true}></DropdownBasic>*/}
		// 		{/*</div>*/}
		// 		{/*<Badge>Hello</Badge>*/}
		// 		{/*<Tag>Hello</Tag>*/}
		// 		{/*<DateInput displayFormat={"ddd, MMMM Do YYYY"}></DateInput>*/}
		// 		{/*<EmojiContainer></EmojiContainer>*/}
		// 		{/*<RichText minEditorHeight={10}></RichText>*/}
		// 		{/*<Pdf src={"https://d8d6949rstsxl.cloudfront.net/public/BO-PDF-499ffd3b-f619-4522-9c4e-bdae1bee9f4c-Academic%20Test%201%20-%20Prompt%203%20-%20Measures%20of%20Poverty.pdf"}></Pdf>*/}
		// 		{/*<Toaster heading={"Hello world this is a toaster"}></Toaster>*/}
		// 		{/*<Button text={"Test Toaster"} buttonType={ButtonType.PRIMARY} onClick={() => addToast({*/}
		// 		{/*	id: "abcdefghi",*/}
		// 		{/*	heading: "This is a test toaster",*/}
		// 		{/*	description: "This is where the description will go",*/}
		// 		{/*	location: ToastLocation.BOTTOM_RIGHT,*/}
		// 		{/*	toastType: ToasterType.DEFAULT,*/}
		// 		{/*	ttl: 5000*/}
		// 		{/*})}></Button>*/}
		// 		{/*<SimpleTag*/}
		// 		{/*	placeholder={"Enter Tags"}*/}
		// 		{/*	initialTags={[]}*/}
		// 		{/*	whitelist={["Hello", "world", "basketball"]}*/}
		// 		{/*	onChange={(tags) => {}}></SimpleTag>*/}
		// 		{/*<JsonEditor value={""}></JsonEditor>*/}
		// 		{/*<JsonEditor value={"{a: b}"}></JsonEditor>*/}
		// 		{/*<TextEditor value={""}></TextEditor>*/}
		// 		{/*<DiffEditor original={"hello: true"} modified={"hello: false"} language={"yaml"}></DiffEditor>*/}
		//
		// 	</div>
		//
		// </div>
	)
}