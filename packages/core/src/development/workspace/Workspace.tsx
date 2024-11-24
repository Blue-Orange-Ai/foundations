// @ts-ignore
import React, {useContext, useEffect, useRef, useState} from "react";

import './Workspace.css'
import {ToastContext} from "../../components/alerts/toast/toastcontext/ToastContext";
import {SideBarState} from "../../components/layouts/sidebar/default/SideBar";
import {Edge, Node as GraphNode} from "@blue-orange-ai/primitives-graph";
import Cookies from "js-cookie";
import {FileSystem, IFileSystemItem, IFileSystemType} from "../../components/file-system/file-system/FileSystem";
import {FileSystemRow} from "../../components/file-system/file-system-row/FileSystemRow";
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../components/contextmenu/contextmenu/ContextMenu";
import {ContextMenuHeading} from "../../components/contextmenu/context-menu-heading/ContextMenuHeading";
import {ContextMenuItem} from "../../components/contextmenu/context-menu-item/ContextMenuItem";
import {ContextMenuSeparator} from "../../components/contextmenu/context-menu-separator/ContextMenuSeparator";
import {LineChart} from "../../components/charts/line/LineChart";

interface Props {
}


Cookies.set("authorization","eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZTliNWE3MS1jNjFjLTRiZTgtODliYS0zODI5YjEwNGJkZWMiLCJleHAiOjE3MzM3MjIzNzJ9.o8a74pFYHun6b1axiBAvrP8g2otrxYYcHYG2Am4sr3-6T8HeBfk8wBiBGzq88Oe5ez_vkbPqXINUqlPfNM_42A")

export const Workspace: React.FC<Props> = ({}) => {

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	const fileSystemItemSeed: Array<IFileSystemItem> = [
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		},
		{
			reference: "file-system-reference",
			indent: 0,
			type: IFileSystemType.FILE,
			label: "Hello World",
			icon: "ri-file-word-fill",
			showDropdown: false,
			dropdownOpen: true,
			size: 13000,
			selected: false,
			lastModified: new Date(),
			fileType: "Word"
		}
	]

	// const fileSystemItems = useRef<Array<IFileSystemItem>>(fileSystemItemSeed);
	const [fileSystemItems, setFileSystemItems] = useState<Array<IFileSystemItem>>(fileSystemItemSeed);

	const [fileSystemRowLastSelected, setFileSystemRowLastSelected] = useState(-1);

	const { addToast } = useContext(ToastContext);

	const [isLoading, setIsLoading] = useState(false);

	const [tags, setTags] = useState<Array<string>>([]);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState(false);

	const [sidebarState, setSidebarState] = useState(SideBarState.OPEN);

	const [sidebarGroupState, setSidebarGroupState] = useState(false);

	const [dataset1, setDataset1] = useState([]);

	const [dataset2, setDataset2] = useState([]);

	const interval = 5000;

	const [username, setUsername] = useState("");

	const labels = useRef<Array<string>>([])

	const values =  useRef<Array<number>>([])

	const changeSidebarState = (state: SideBarState) => {
		setSidebarState(state);
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

	const clearAllSelectedRows = (items: Array<IFileSystemItem>) => {
		for (var i=0; i<items.length; i++) {
			items[i].selected = false;
		}
		return items;
	}

	const rowClickedDefault = (item: IFileSystemItem): Array<IFileSystemItem> => {
		var newItems = fileSystemItems;
		const itemIndex = newItems.indexOf(item);
		newItems = clearAllSelectedRows(newItems);
		setFileSystemRowLastSelected(itemIndex);
		newItems[itemIndex].selected = true;
		return newItems;
	}

	const rowClickedCtrl = (item: IFileSystemItem) => {
		var newItems: Array<IFileSystemItem> = [];
		const itemIndex = fileSystemItems.indexOf(item);
		setFileSystemRowLastSelected(itemIndex);
		for (var i=0; i < fileSystemItems.length; i++) {
			if (i == itemIndex) {
				var item = fileSystemItems[i];
				item.selected = !item.selected;
				newItems.push(item);
			} else {
				newItems.push(fileSystemItems[i]);
			}
		}
		return newItems;
	}

	const rowClickedShift = (item: IFileSystemItem) => {
		var newItems: Array<IFileSystemItem> = [];
		const itemIndex = fileSystemItems.indexOf(item);
		var started = false;
		for (var i=0; i < fileSystemItems.length; i++) {
			var item = fileSystemItems[i];
			if (i == itemIndex || i == fileSystemRowLastSelected) {
				started = !started;
				item.selected = true;
				newItems.push(item);
			} else if (started) {
				item.selected = true;
				newItems.push(item);
			} else {
				item.selected = false;
				newItems.push(item);
			}
		}
		return newItems;
	}

	const rowClicked = (item: IFileSystemItem, ctrlKey: boolean, shiftKey: boolean) => {
		var newItems: Array<IFileSystemItem> = [];
		if (!ctrlKey && !shiftKey) {
			newItems = rowClickedDefault(item);
		} else if (ctrlKey) {
			newItems = rowClickedCtrl(item);
		} else if (shiftKey) {
			newItems = rowClickedShift(item);
		}
		setFileSystemItems(newItems);
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			const newDataPoint1 = {
				x: new Date().toISOString(), // Current timestamp
				y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
			};
			const newDataPoint2 = {
				x: new Date().toISOString(), // Current timestamp
				y: (Math.random() * 100).toFixed(2), // Random y value between 0 and 100
			};
			setDataset1((prevElements) => [
				...prevElements,
				newDataPoint1
			]);
			setDataset2((prevElements) => [
				...prevElements,
				newDataPoint2
			]);
		}, interval);

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, [interval]);

	return (
		// <div className="workspace-main-window">
		// 	<div className="workspace-display-window">
		// 		<FileSystem>
		// 			{fileSystemItems.map((item, index) => (
		// 				<FileSystemRow key={index} contextMenuItems={contextMenuItems} item={item} onClick={rowClicked}></FileSystemRow>
		// 			))}
		//
		// 		</FileSystem>
		// 	</div>
		// </div>



	// 	<DateInput displayFormat={"yyyy-MM-DD HH:mm:ss"} showTime={true} timePrecision={TimePrecision.SECOND} onChange={(value) => console.log(value)}></DateInput>
		<LineChart
			height={"100vh"}
			width={"100%"}
			gridLines={true}
			xLabel={"Timestamp"}
			yLabel={"Value"}
			xScale={"time"}
			xScaleTimeUnit={"second"}
			interactionType={"nearest"}
			legend={true}
			dataset={[{
			label: "Subscribers",
				backgroundColor: "#BB8FCE",
				borderColor: "#BB8FCE",
				borderWidth: 2,
				borderDash: [5, 5],
			data: dataset1
		},{
				label: "Subscribers 2",
				 backgroundColor: '#E59866',
				 borderColor: '#E59866',
				data: dataset2
			}]}></LineChart>
	//
	// 	<LineChart
	// 		height={"100vh"}
	// 		width={"100%"}
	// 		gridLines={true}
	// 		xScale={"linear"}
	// 		interactionType={"nearest"}
	// 		legend={true}
	// 		legendPosition={LegendPosition.BOTTOM_RIGHT}
	// 		dataset={[{
	// 		label: "Subscribers",
	// 			backgroundColor: "#BB8FCE",
	// 			borderColor: "#BB8FCE",
	// 		data: [{ x: -10, y: 0 },
	// 			{ x: 0, y: 10 },
	// 			{ x: 10, y: 5 },
	// 			{ x: 20, y: -10 },
	// 			{ x: 25, y: -5 }]
	// 	},{
	// 			label: "Subscribers 2",
	// 			 backgroundColor: '#E59866',
	// 			 borderColor: '#E59866',
	// 			data: [{ x: -30, y: 0 },
	// 				{ x: 30, y: 20 },
	// 				{ x: 40, y: -5 },
	// 				{ x: 50, y: -10 },
	// 				{ x: 65, y: -50 }]
	// 		}]}></LineChart>
	// <>
	// 	<p>{username}</p>
	// 	<LineChart
	// 		height={"100vh"}
	// 		width={"50%"}
	// 		gridLines={true}
	// 		xScale={"category"}
	// 		labels={labels.current}
	// 		dataset={[{
	// 			label: "Subscribers",
	// 			backgroundColor: "#BB8FCE",
	// 			borderColor: "#BB8FCE",
	// 			data: values.current
	// 		}]}></LineChart>
	// </>
	// 			<ScatterChart
	// 				height={"100vh"}
	// 				width={"100%"}
	// 				gridLines={true}
	// 				xScale={"linear"}
	// 				dataset={[{
	// 					label: "Subscribers",
	// 					backgroundColor: "#BB8FCE",
	// 					borderColor: "#BB8FCE",
	// 					data: [{ x: -10, y: 0 },
	// 						{ x: 0, y: 10 },
	// 						{ x: 10, y: 5 },
	// 						{ x: 20, y: -10 },
	// 						{ x: 25, y: -5 }]
	// 				},{
	// 					label: "Subscribers 2",
	// 					backgroundColor: '#E59866',
	// 					borderColor: '#E59866',
	// 					data: [{ x: -30, y: 0 },
	// 						{ x: 30, y: 20 },
	// 						{ x: 40, y: -5 },
	// 						{ x: 50, y: -10 },
	// 						{ x: 65, y: -50 }]
	// 				}]}></ScatterChart>
	//
	// <BarChart
	// 	indexAxis={"x"}
	// 	height={"100vh"}
	// 	width={"50%"}
	// 	gridLines={true}
	// 	xScale={"category"}
	// 	legend={false}
	// 	labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
	// 	dataset={[{
	// 		label: "Subscribers",
	// 		backgroundColor: "#BB8FCE",
	// 		borderColor: "#BB8FCE",
	// 		data: [0, 20, 5, 10, 50],
	// 		borderRadius: 4
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

		// <SidebarPage>
		// 	<SideBar state={sidebarState} changeState={changeSidebarState}>
		// 		<SideBarHeader>
		// 			<SideBarHeaderItem label="Blue Orange Ai" state={sidebarState} media={testMedia} changeState={changeSidebarState}></SideBarHeaderItem>
		// 		</SideBarHeader>
		// 		<SideBarBody>
		// 			<SideBarBodyGroup opened={sidebarGroupState}>
		// 				<SideBarBodyLabel
		// 					icon={sidebarGroupState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
		// 					label={"Menu"}
		// 					onClick={() => setSidebarGroupState(!sidebarGroupState)}
		// 					badge={<Badge backgroundColor={"red"} textColor={"white"}>10</Badge>}
		// 				></SideBarBodyLabel>
		// 				<SideBarBodyItem
		// 					label={"Search"}
		// 					active={false}
		// 					focused={false}
		// 					defaultStyle={{opacity: "0.6"}}
		// 					activeStyle={{opacity: "1"}}
		// 					icon={<i className={"ri-search-line"}></i>}
		// 				></SideBarBodyItem>
		// 				<SideBarBodyItem
		// 					label={"Search 2"}
		// 					active={false}
		// 					focused={true}
		// 					defaultStyle={{opacity: "0.6"}}
		// 					focusedStyle={{opacity: "1"}}
		// 					hoverEffects={true}
		// 					onClick={() => console.log("Main body item clicked")}
		// 					hoverItems={<i className={"ri-search-line"} onClick={() => console.log("Hello World")}></i>}
		// 					icon={<i className={"ri-search-line"}></i>}
		// 				></SideBarBodyItem>
		// 			</SideBarBodyGroup>
		// 			<SideBarBodyLabel
		// 				label={"Menu"}
		// 				badge={<Badge backgroundColor={"red"} textColor={"white"}>10</Badge>}
		// 			></SideBarBodyLabel>
		// 			<SideBarBodyItemLink
		// 				label={"Search Google"}
		// 				href={"https://www.google.com"}
		// 				active={false}
		// 				focused={false}
		// 				defaultStyle={{opacity: "0.6"}}
		// 				activeStyle={{opacity: "1"}}
		// 				icon={<i className={"ri-search-line"}></i>}
		// 			></SideBarBodyItemLink>
		// 			<SideBarBodyItem
		// 				label={"Search"}
		// 				active={false}
		// 				focused={false}
		// 				defaultStyle={{opacity: "0.6"}}
		// 				activeStyle={{opacity: "1"}}
		// 				icon={<i className={"ri-search-line"}></i>}
		// 			></SideBarBodyItem>
		// 			<SideBarBodyItem
		// 				label={"Search 2"}
		// 				active={false}
		// 				focused={true}
		// 				defaultStyle={{opacity: "0.6"}}
		// 				focusedStyle={{opacity: "1"}}
		// 				hoverEffects={true}
		// 				onClick={() => console.log("Main body item clicked")}
		// 				hoverItems={<i className={"ri-search-line"} onClick={() => console.log("Hello World")}></i>}
		// 				icon={<i className={"ri-search-line"}></i>}
		// 			></SideBarBodyItem>
		// 		</SideBarBody>
		// 		<SideBarFooter>
		// 			<div style={{color: "white"}}>Hello World</div>
		// 		</SideBarFooter>
		// 	</SideBar>
		// 	<HorizontalSplitPage>
		// 		<SplitPageMajor>
		// 			<PaddedPage>
		// 				<MetricWithCopy text={"Hello world"}></MetricWithCopy>
		// 				<InputForm>
		// 					<Dropdown style={{background: "#e0e1e2"}}>
		// 						<DropdownItemHeading label={"Hello World"} value={"heading-1"} selected={false}></DropdownItemHeading>
		// 						<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
		// 						<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
		// 						<DropdownItemIcon src={"ri-dribbble-line"} label={"Dribble"} value={"option-3"} selected={false}></DropdownItemIcon>
		// 						<DropdownItemImage src={"http://localhost:8086/files/get/rqiV_2fhSh-uRcW5I7QTPQ"} label={"James"} value={"option-4"} selected={false}></DropdownItemImage>
		// 					</Dropdown>
		// 					<Input
		// 						placeholder={"Username | Email"}
		// 						label={"Username"}
		// 						onChange={(value) => setUsername(value)}
		// 					></Input>
		// 				</InputForm>
		// 				<Input placeholder={"Testing setting username"} onChange={(value) => {setUsername(value)}}></Input>
		// 				<TagInput></TagInput>
		// 				<Input></Input>
		// 				<Button text={"Hello"} buttonType={ButtonType.PRIMARY}></Button>
		// 				<MetricCard text={"3 Sensors"} label={"Num. Sensors"} icon={"ri-gradienter-line"}></MetricCard>
		// 			</PaddedPage>
		// 		</SplitPageMajor>
		// 		<SplitPageMinor>
		// 			<div>Minor split page item</div>
		// 		</SplitPageMinor>
		// 	</HorizontalSplitPage>
		//
		// </SidebarPage>

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
		// 		<RichText minEditorHeight={10} onChange={(content: string, mentions: string[], attachments: Media[], filesUploading: boolean) => {
		// 			console.log({
		// 				content: content,
		// 				mentions: mentions,
		// 				attachments: attachments,
		// 				filesUploading: filesUploading
		// 			})
		// 		}}></RichText>
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