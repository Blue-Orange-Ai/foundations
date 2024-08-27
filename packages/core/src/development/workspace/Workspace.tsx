// @ts-ignore
import React, {useContext, useState} from "react";

import './Workspace.css'
import {Avatar as AvatarObj, Media, User, UserState} from "@blue-orange-ai/foundations-clients";
import {ToastContext} from "../../components/alerts/toast/toastcontext/ToastContext";
import {SideBar, SideBarState} from "../../components/layouts/sidebar/default/SideBar";
import {Input} from "../../components/inputs/input/Input";
import {Button, ButtonType} from "../../components/buttons/button/Button";
import {Edge, Node as GraphNode} from "@blue-orange-ai/primitives-graph";
import Cookies from "js-cookie";
import {DropdownItemObj, DropdownItemType} from "../../components/interfaces/AppInterfaces";
import {TagInput} from "../../components/inputs/tags/simple/TagInput";
import {SideBarHeader} from "../../components/layouts/sidebar/sidebar-header/SideBarHeader";
import {SideBarHeaderItem} from "../../components/layouts/sidebar/items/sidebar-header-item/SideBarHeaderItem";
import {SideBarBody} from "../../components/layouts/sidebar/sidebar-body/SideBarBody";
import {SideBarBodyGroup} from "../../components/layouts/sidebar/items/sidebar-body-group/SideBarBodyGroup";
import {SideBarBodyLabel} from "../../components/layouts/sidebar/items/sidebar-body-label/SideBarBodyLabel";
import {Badge} from "../../components/text-decorations/badge/Badge";
import {SideBarBodyItem} from "../../components/layouts/sidebar/items/sidebar-body-item/SideBarBodyItem";
import {SideBarFooter} from "../../components/layouts/sidebar/sidebar-footer/SideBarFooter";
import {SideBarBodyItemLink} from "../../components/layouts/sidebar/items/sidebar-body-item-link/SideBarBodyItemLink";
import {SidebarPage} from "../../components/layouts/pages/sidebar-page/SidebarPage";
import {PaddedPage} from "../../components/layouts/pages/padded-page/PaddedPage";
import {SplitPageMajor} from "../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {MetricWithCopy} from "../../components/metrics/metric-with-copy/MetricWithCopy";
import {MetricCard} from "../../components/metrics/metric-card/MetricCard";

interface Props {
}


Cookies.set("authorization","eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMmQ2NTRmNi05NWI3LTQzZTUtOWZjMi0xZThmZWEwZGE2NjEiLCJleHAiOjE3MjYwMTYxMjV9.UQ3pYjrSYKdiZQmSlxqi8HTO5T1gcoQd2QVec4yPIyhW9C8vAiKSheJ6Y4XDoeqMijBi6_Yhsj2phtnJ8-6NfA")

export const Workspace: React.FC<Props> = ({}) => {

	const { addToast } = useContext(ToastContext);

	const [isLoading, setIsLoading] = useState(false);

	const [tags, setTags] = useState<Array<string>>([]);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const [sidebarState, setSidebarState] = useState(SideBarState.OPEN);

	const [sidebarGroupState, setSidebarGroupState] = useState(false);

	const [username, setUsername] = useState("");

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
	const dropdownItems: Array<DropdownItemObj> = [
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

	var nodes: Array<GraphNode> =[{
		id: "123456",
		x: 80,
		y: 50,
		border: "2px solid transparent",
		borderSelected: "2px solid dodgerblue",
		borderRadius: 10,
		backgroundColour: "transparent",
		movable: true,
		deletable: true,
		html: "<div class=\"blue-orange-demo-graph-node\">\n" +
			"          <div class=\"blue-orange-demo-graph-node-heading\">This is the demo heading</div>\n" +
			"          <div class=\"blue-orange-demo-graph-node-body\">\n" +
			"              <div>\n" +
			"                <span class=\"blue-orange-demo-graph-node-body-item-heading\">Processed:</span>\n" +
			"                <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00 /s</span>\n" +
			"              </div>\n" +
			"              <div>\n" +
			"                  <span class=\"blue-orange-demo-graph-node-body-item-heading\">Errors:</span>\n" +
			"                  <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00</span>\n" +
			"              </div>\n" +
			"          </div>\n" +
			"      </div>",
		width: 250,
		height: 100
	},
		{
			id: "123457",
			x: 40,
			y: 100,
			border: "2px solid transparent",
			borderSelected: "2px solid dodgerblue",
			borderRadius: 10,
			backgroundColour: "transparent",
			movable: true,
			deletable: true,
			html: "<div class=\"blue-orange-demo-graph-node\">\n" +
				"          <div class=\"blue-orange-demo-graph-node-heading\">This is the demo heading</div>\n" +
				"          <div class=\"blue-orange-demo-graph-node-body\">\n" +
				"              <div>\n" +
				"                <span class=\"blue-orange-demo-graph-node-body-item-heading\">Processed:</span>\n" +
				"                <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00 /s</span>\n" +
				"              </div>\n" +
				"              <div>\n" +
				"                  <span class=\"blue-orange-demo-graph-node-body-item-heading\">Errors:</span>\n" +
				"                  <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00</span>\n" +
				"              </div>\n" +
				"          </div>\n" +
				"      </div>",
			width: 250,
			height: 100
		},
		{
			id: "123458",
			x: 50,
			y: 250,
			border: "2px solid transparent",
			borderSelected: "2px solid #E74C3C",
			borderRadius: 10,
			backgroundColour: "transparent",
			movable: true,
			deletable: true,
			html: "<div class=\"blue-orange-demo-graph-node\">\n" +
				"          <div class=\"blue-orange-demo-graph-node-heading\">This is the demo heading</div>\n" +
				"          <div class=\"blue-orange-demo-graph-node-body\">\n" +
				"              <div>\n" +
				"                <span class=\"blue-orange-demo-graph-node-body-item-heading\">Processed:</span>\n" +
				"                <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00 /s</span>\n" +
				"              </div>\n" +
				"              <div>\n" +
				"                  <span class=\"blue-orange-demo-graph-node-body-item-heading\">Errors:</span>\n" +
				"                  <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00</span>\n" +
				"              </div>\n" +
				"          </div>\n" +
				"      </div>",
			width: 250,
			height: 100
		},
		{
			id: "123459",
			x: 577,
			y: 50,
			border: "2px solid transparent",
			borderSelected: "2px solid #2ECC71",
			borderRadius: 10,
			backgroundColour: "transparent",
			movable: true,
			deletable: true,
			html: "<div class=\"blue-orange-demo-graph-node\">\n" +
				"          <div class=\"blue-orange-demo-graph-node-heading\">This is the demo heading</div>\n" +
				"          <div class=\"blue-orange-demo-graph-node-body\">\n" +
				"              <div>\n" +
				"                <span class=\"blue-orange-demo-graph-node-body-item-heading\">Processed:</span>\n" +
				"                <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00 /s</span>\n" +
				"              </div>\n" +
				"              <div>\n" +
				"                  <span class=\"blue-orange-demo-graph-node-body-item-heading\">Errors:</span>\n" +
				"                  <span class=\"blue-orange-demo-graph-node-body-item-value\">0.00</span>\n" +
				"              </div>\n" +
				"          </div>\n" +
				"      </div>",
			width: 250,
			height: 100
		}]


	const edges: Array<Edge> = [{
		"id": "abcdefg",
		"sourceX": 180,
		"sourceY": 190,
		"sourceAnchorPoint": "right",
		"sourceArrow": false,
		"sourceId": "123456",
		"targetX": 577,
		"targetY": 90,
		"targetAnchorPoint": "left",
		"targetArrow": true,
		"targetId": "123459",
		"label": true,
		"labelMetaData": "cdnsandkla",
		"labelText": "",
		"labelBackground": "white",
		"style": "bezier",
		"lineType": "solid",
		"lineColour": "#bdbdbd",
		"lineWidth": 2,
		"anchorFixed": false,
		"arrowHeadScale": 1.2,
		"deletable": true
	},
		{
			"id": "ghijkidfyhohidty",
			"sourceX": 140,
			"sourceY": 140,
			"sourceAnchorPoint": "right",
			"sourceArrow": false,
			"sourceId": "123457",
			"targetX": 50,
			"targetY": 290,
			"targetAnchorPoint": "left",
			"targetArrow": true,
			"targetId": "123458",
			"label": true,
			"labelMetaData": "cdnsandkla",
			"labelText": "",
			"labelBackground": "white",
			"style": "bezier",
			"lineType": "animated",
			"lineColour": "#bdbdbd",
			"lineWidth": 2,
			"anchorFixed": false,
			"arrowHeadScale": 1.2,
			"deletable": true
		}]

	return (
		// <LineChart
		// 	height={"100vh"}
		// 	width={"100%"}
		// 	gridLines={true}
		// 	xScale={"linear"}
		// 	dataset={[{
		// 	label: "Subscribers",
		// 		backgroundColor: "#BB8FCE",
		// 		borderColor: "#BB8FCE",
		// 	data: [{ x: -10, y: 0 },
		// 		{ x: 0, y: 10 },
		// 		{ x: 10, y: 5 },
		// 		{ x: 20, y: -10 },
		// 		{ x: 25, y: -5 }]
		// },{
		// 		label: "Subscribers 2",
		// 		 backgroundColor: '#E59866',
		// 		 borderColor: '#E59866',
		// 		data: [{ x: -30, y: 0 },
		// 			{ x: 30, y: 20 },
		// 			{ x: 40, y: -5 },
		// 			{ x: 50, y: -10 },
		// 			{ x: 65, y: -50 }]
		// 	}]}></LineChart>
	// <LineChart
	// 	height={"100vh"}
	// 	width={"50%"}
	// 	gridLines={true}
	// 	xScale={"category"}
	// 	labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
	// 	dataset={[{
	// 		label: "Subscribers",
	// 		backgroundColor: "#BB8FCE",
	// 		borderColor: "#BB8FCE",
	// 		data: [0, 20, -5, -10, -50]
	// 	}]}></LineChart>

	// <BarChart
	// 	indexAxis={"x"}
	// 	height={"100vh"}
	// 	width={"50%"}
	// 	gridLines={true}
	// 	xScale={"category"}
	// 	labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
	// 	dataset={[{
	// 		label: "Subscribers",
	// 		backgroundColor: "#BB8FCE",
	// 		borderColor: "#BB8FCE",
	// 		data: [0, 20, -5, -10, -50],
	// 		borderRadius: 20
	// 	}]}></BarChart>
	// 	<div>
	// 		{/*<ScatterChart*/}
	// 		{/*	height={"100vh"}*/}
	// 		{/*	width={"100%"}*/}
	// 		{/*	gridLines={true}*/}
	// 		{/*	xScale={"linear"}*/}
	// 		{/*	dataset={[{*/}
	// 		{/*		label: "Subscribers",*/}
	// 		{/*		backgroundColor: "#BB8FCE",*/}
	// 		{/*		borderColor: "#BB8FCE",*/}
	// 		{/*		data: [{ x: -10, y: 0 },*/}
	// 		{/*			{ x: 0, y: 10 },*/}
	// 		{/*			{ x: 10, y: 5 },*/}
	// 		{/*			{ x: 20, y: -10 },*/}
	// 		{/*			{ x: 25, y: -5 }]*/}
	// 		{/*	},{*/}
	// 		{/*		label: "Subscribers 2",*/}
	// 		{/*		backgroundColor: '#E59866',*/}
	// 		{/*		borderColor: '#E59866',*/}
	// 		{/*		data: [{ x: -30, y: 0 },*/}
	// 		{/*			{ x: 30, y: 20 },*/}
	// 		{/*			{ x: 40, y: -5 },*/}
	// 		{/*			{ x: 50, y: -10 },*/}
	// 		{/*			{ x: 65, y: -50 }]*/}
	// 		{/*	}]}></ScatterChart>*/}
	// 		{/*<Modal>*/}
	// 		{/*	<ModalHeader label={"Hello World I am a modal"}></ModalHeader>*/}
	// 		{/*	<ModalDescription description={"Hello modal this is a description of the modal"}></ModalDescription>*/}
	// 		{/*	<ModalBody>*/}
	// 		{/*		<div>*/}
	// 		{/*			<Input placeholder={"This is where you write your input"}></Input>*/}
	// 		{/*			<Input placeholder={"This is the second place you write your input"}></Input>*/}
	// 		{/*		</div>*/}
	// 		{/*	</ModalBody>*/}
	// 		{/*	<ModalFooter>*/}
	// 		{/*		<ModalFooterRight>*/}
	// 		{/*			<Button text={"Submit"} buttonType={ButtonType.PRIMARY}></Button>*/}
	// 		{/*		</ModalFooterRight>*/}
	// 		{/*	</ModalFooter>*/}
	// 		{/*</Modal>*/}
	// 	</div>

		<SidebarPage>
			<SideBar state={sidebarState} changeState={changeSidebarState}>
				<SideBarHeader>
					<SideBarHeaderItem label="Blue Orange Ai" state={sidebarState} media={testMedia} changeState={changeSidebarState}></SideBarHeaderItem>
				</SideBarHeader>
				<SideBarBody>
					<SideBarBodyGroup opened={sidebarGroupState}>
						<SideBarBodyLabel
							icon={sidebarGroupState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Menu"}
							onClick={() => setSidebarGroupState(!sidebarGroupState)}
							badge={<Badge backgroundColor={"red"} textColor={"white"}>10</Badge>}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Search"}
							active={false}
							focused={false}
							defaultStyle={{opacity: "0.6"}}
							activeStyle={{opacity: "1"}}
							icon={<i className={"ri-search-line"}></i>}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Search 2"}
							active={false}
							focused={true}
							defaultStyle={{opacity: "0.6"}}
							focusedStyle={{opacity: "1"}}
							hoverEffects={true}
							onClick={() => console.log("Main body item clicked")}
							hoverItems={<i className={"ri-search-line"} onClick={() => console.log("Hello World")}></i>}
							icon={<i className={"ri-search-line"}></i>}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyLabel
						label={"Menu"}
						badge={<Badge backgroundColor={"red"} textColor={"white"}>10</Badge>}
					></SideBarBodyLabel>
					<SideBarBodyItemLink
						label={"Search Google"}
						href={"https://www.google.com"}
						active={false}
						focused={false}
						defaultStyle={{opacity: "0.6"}}
						activeStyle={{opacity: "1"}}
						icon={<i className={"ri-search-line"}></i>}
					></SideBarBodyItemLink>
					<SideBarBodyItem
						label={"Search"}
						active={false}
						focused={false}
						defaultStyle={{opacity: "0.6"}}
						activeStyle={{opacity: "1"}}
						icon={<i className={"ri-search-line"}></i>}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Search 2"}
						active={false}
						focused={true}
						defaultStyle={{opacity: "0.6"}}
						focusedStyle={{opacity: "1"}}
						hoverEffects={true}
						onClick={() => console.log("Main body item clicked")}
						hoverItems={<i className={"ri-search-line"} onClick={() => console.log("Hello World")}></i>}
						icon={<i className={"ri-search-line"}></i>}
					></SideBarBodyItem>
				</SideBarBody>
				<SideBarFooter>
					<div style={{color: "white"}}>Hello World</div>
				</SideBarFooter>
			</SideBar>
			<HorizontalSplitPage>
				<SplitPageMajor>
					<PaddedPage>
						<MetricWithCopy text={"Hello world"}></MetricWithCopy>
						<Input placeholder={"Testing setting username"} onChange={(value) => {setUsername(value)}}></Input>
						<TagInput></TagInput>
						<Input></Input>
						<Button text={"Hello"} buttonType={ButtonType.PRIMARY}></Button>
						<MetricCard text={"3 Sensors"} label={"Num. Sensors"} icon={"ri-gradienter-line"}></MetricCard>
					</PaddedPage>
				</SplitPageMajor>
				<SplitPageMinor>
					<div>Minor split page item</div>
				</SplitPageMinor>
			</HorizontalSplitPage>

		</SidebarPage>

		// <div className="workspace-main-window">
		// 	<div className="workspace-display-window">
		// 		{/*<Input label={"Hello world this is label"} placeholder={"This is where you write your input"} onChange={(value: string) => {*/}
		// 		{/*	console.log("Basic Input Change")*/}
		// 		{/*	console.log(value);*/}
		// 		{/*}}></Input>*/}
		// 		{/*<AddressInput label={"Please enter you australian address"} onChange={(address: Address) => {*/}
		// 		{/*	console.log("Address Input Change")*/}
		// 		{/*	console.log(address);*/}
		// 		{/*}}></AddressInput>*/}
		// 		{/*<DateInput label={"Please enter a valid date"} onChange={(date: Date) => {*/}
		// 		{/*	console.log("Date input")*/}
		// 		{/*	console.log(date)*/}
		// 		{/*}}></DateInput>*/}
		// 		{/*<PhoneInput label={"This is the default phone input"} onChange={(value: Telephone) => {*/}
		// 		{/*	console.log("Workspace Telephone input")*/}
		// 		{/*	console.log(value)*/}
		// 		{/*}}></PhoneInput>*/}
		// 		{/*<Avatar edit={true} user={user} height={50} width={50} tooltip={true}></Avatar>*/}
		// 		{/*<AvatarList users={[user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user, user]} overlap={30}></AvatarList>*/}
		// 		{/*<Table>*/}
		// 		{/*	<THead>*/}
		// 		{/*		<Row>*/}
		// 		{/*			<CheckboxCell state={true}></CheckboxCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort ASC", icon: "ri-sort-asc", value: "SORT_ASC"}]} onDropdownSelected={(item: IContextMenuItem) => {*/}
		// 		{/*				console.log("Row Item Clicked")*/}
		// 		{/*				console.log(item)*/}
		// 		{/*			}}>Header 2</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 3</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 4</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 5</HeaderCell>*/}
		// 		{/*			<HeaderCell dropdownItems={[{label: "Sort Desc", icon: "ri-sort-desc", value: "SORT_DESC"}]}>Header 6</HeaderCell>*/}
		// 		{/*		</Row>*/}
		// 		{/*	</THead>*/}
		// 		{/*	<TBody>*/}
		// 		{/*		<Row>*/}
		// 		{/*			<CheckboxCell state={true}></CheckboxCell>*/}
		// 		{/*			<PrimaryCell src={"http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ"} text={"Demonstration Primary Cell"} secondaryText={"This is where the secondary text goes"} style={{paddingLeft: "15px", paddingRight: "15px"}}></PrimaryCell>*/}
		// 		{/*			<Cell>*/}
		// 		{/*				<EmailLink email={"toms126@gmail.com"}></EmailLink>*/}
		// 		{/*			</Cell>*/}
		// 		{/*			<Cell alignment={CellAlignment.LEFT}>*/}
		// 		{/*				<TelephoneText phone={"0402747928"} country={"AU"}></TelephoneText>*/}
		// 		{/*			</Cell>*/}
		// 		{/*			<Cell>*/}
		// 		{/*				<Percentage percent={0.1123456789} decimalPlaces={5}></Percentage>*/}
		// 		{/*			</Cell>*/}
		// 		{/*			<Cell>*/}
		// 		{/*				<Currency amount={123456.55} currency={"aud"}></Currency>*/}
		// 		{/*			</Cell>*/}
		// 		{/*		</Row>*/}
		// 		{/*	</TBody>*/}
		// 		{/*</Table>*/}
		// 		{/*<div style={{width: "200px"}}>*/}
		// 		{/*<Dropdown label={"Hello dropdown"} items={dropdownItems} filter={true} allowMultipleSelection={true} onItemsSelected={(itemsSelected: Array<DropdownItem>) => {*/}
		// 		{/*	console.log("Selected items allow multiple")*/}
		// 		{/*	console.log(itemsSelected)*/}
		// 		{/*}}></Dropdown>*/}
		// 		{/*<Dropdown label={"Hello No multiples dropdown"} items={dropdownItems} filter={true} allowMultipleSelection={false} onSelection={(item: DropdownItem) => {*/}
		// 		{/*	console.log("Selected items single item")*/}
		// 		{/*	console.log(item)*/}
		// 		{/*}}></Dropdown>*/}
		// 		{/*<TagInput label={"Hello world this is a tag input"} initialTags={tags} onChange={(tags) => {*/}
		// 		{/*	setTags(tags)*/}
		// 		{/*	console.log("workspace log")*/}
		// 		{/*	console.log(tags);*/}
		// 		{/*}}></TagInput>*/}
		// 		{/*<TextArea label={"Hello text area"} placeholder={"Type anything in the text area"} onChange={(value: string) => {*/}
		// 		{/*	console.log("Workspace Text Area")*/}
		// 		{/*	console.log(value);*/}
		// 		{/*}}></TextArea>*/}
		// 		{/*</div>*/}
		// 		{/*<Badge>Hello</Badge>*/}
		// 		{/*<Tag>Hello</Tag>*/}
		// 		{/*<DateInput displayFormat={"ddd, MMMM Do YYYY"}></DateInput>*/}
		// 		{/*<BlueOrangeMapWrapper></BlueOrangeMapWrapper>*/}
		// 		{/*<BlueOrangeGraphWrapper nodes={nodes} edges={edges}></BlueOrangeGraphWrapper>*/}
		// 		{/*<EmojiContainer></EmojiContainer>*/}
		// 		{/*<Checkbox></Checkbox>*/}
		// 		{/*<Toggle></Toggle>*/}
		// 		{/*<RichText minEditorHeight={10} onChange={(content: string, mentions: string[], attachments: Media[], filesUploading: boolean) => {*/}
		// 		{/*	console.log({*/}
		// 		{/*		content: content,*/}
		// 		{/*		mentions: mentions,*/}
		// 		{/*		attachments: attachments,*/}
		// 		{/*		filesUploading: filesUploading*/}
		// 		{/*	})*/}
		// 		{/*}}></RichText>*/}
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
		// 		{/*<YamlEditor value={""} onChange={(value: string) => {*/}
		// 		{/*	console.log(value)*/}
		// 		{/*}}></YamlEditor>*/}
		// 		{/*<JsonEditor value={"{a: b}"} onChange={(value: string) => {*/}
		// 		{/*	console.log(value);*/}
		// 		{/*}}></JsonEditor>*/}
		// 		{/*<TextEditor value={""} onChange={(value: string) => {*/}
		// 		{/*	console.log(value);*/}
		// 		{/*}}></TextEditor>*/}
		// 		{/*<DiffEditor original={"{\"hello\": true}"} modified={"{\"hello\": false}"} language={"json"}></DiffEditor>*/}
		// 		{/*<Drawer>*/}
		// 		{/*	<DrawerHeader label={"Hello drawer"}></DrawerHeader>*/}
		// 		{/*	<DrawerDescription description={"This is where the description will go"}></DrawerDescription>*/}
		// 		{/*	<DrawerBody>*/}
		// 		{/*		<InputForm paddingTop={20}>*/}
		// 		{/*			<Input label={"Hello Label 1"} placeholder={"This is where you write your input"}></Input>*/}
		// 		{/*			<Input label={"Hello Label 2"} placeholder={"This is the second place you write your input"}></Input>*/}
		// 		{/*		</InputForm>*/}
		// 		{/*	</DrawerBody>*/}
		// 		{/*	<DrawerFooter>*/}
		// 		{/*		<DrawerFooterRight>*/}
		// 		{/*			<Button text={"Submit"} buttonType={ButtonType.PRIMARY}></Button>*/}
		// 		{/*		</DrawerFooterRight>*/}
		// 		{/*	</DrawerFooter>*/}
		// 		{/*</Drawer>*/}
		// 	</div>
		//
		// </div>
	)
}