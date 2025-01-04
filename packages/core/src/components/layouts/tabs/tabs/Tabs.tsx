import React, {useState} from "react";

import './Tabs.css'
import {Tab} from "../tab/Tab";
import {Button, ButtonIconPos, ButtonType} from "../../../buttons/button/Button";

interface TabMetaData {
	name: string,
	icon: string | undefined,
	uuid: string
}

interface TabData {
	uuid: string,
	children: React.ReactNode[]
}

interface Props {
	children: React.ReactNode;
	activeTab?: string,
	headerStyle?: React.CSSProperties,
	headerActiveStyle?: React.CSSProperties,
	headerInActiveStyle?: React.CSSProperties,
	onClick?: (uuid: string) => void,
}

export const Tabs: React.FC<Props> = ({children, activeTab, headerStyle = {}, headerActiveStyle, headerInActiveStyle, onClick}) => {

	const tabs: TabData[] = [];

	const tabMetaData: TabMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === Tab) {
				tabs.push({
					uuid: child.props.uuid,
					children: child.props.children
				});
				tabMetaData.push({
					name: child.props.name as string,
					icon: child.props.icon as (string | undefined),
					uuid: child.props.uuid as string
				})
			}
		}
	});

	const [active, setActive] = useState(activeTab ?? tabMetaData[0].uuid);

	const tabHeaderInActiveStyle: React.CSSProperties = headerInActiveStyle ? headerInActiveStyle : {
		color: "#393939",
		opacity: "0.6",
		borderBottom: "2px solid transparent",
		borderRadius: "0px",
		marginBottom: "-2px"
	}

	const tabHeaderActiveStyle: React.CSSProperties = headerActiveStyle ? headerActiveStyle : {
		color: "#393939",
		opacity: "1",
		borderBottom: "2px solid black",
		borderRadius: "0px",
		marginBottom: "-2px"
	}

	const updateActiveTab = (uuid: string) => {
		if (onClick) {
			onClick(uuid)
		}
		setActive(uuid)
	}

	return (
		<div className="blue-orange-tabs-group">
			<div className="blue-orange-tab-header" style={headerStyle}>
				{tabMetaData.map((metaData, index) => (
					<Button
						text={metaData.name}
						buttonType={ButtonType.CUSTOM}
						icon={metaData.icon}
						iconPos={ButtonIconPos.LEFT}
						style={metaData.uuid == active ? tabHeaderActiveStyle : tabHeaderInActiveStyle}
						onClick={() => {updateActiveTab(metaData.uuid)}}
					></Button>
				))}
			</div>
			{tabs.map((child, index) => (
				<div
					key={child.uuid}
					className={child.uuid == active ? "blue-orange-tab" : "blue-orange-tab blue-orange-tab-hidden"}>
					{child.children}
				</div>
			))}
		</div>
	)
}