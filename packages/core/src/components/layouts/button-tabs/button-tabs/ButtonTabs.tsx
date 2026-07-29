import React, {useEffect, useRef, useState} from "react";

import './ButtonTabs.css'
import {ButtonTab} from "../button-tab/ButtonTab";

export enum ButtonTabsSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

interface TabMetaData {
	uuid: string,
	name: string,
	icon: string | undefined,
	disabled: boolean
}

interface TabData {
	uuid: string,
	children: React.ReactNode
}

interface Props {
	children: React.ReactNode;
	/** The selected tab. Updating it moves the selection from the outside. */
	activeTab?: string,
	size?: ButtonTabsSize,
	/** Stretches the triggers so the group fills the width of its parent. */
	fullWidth?: boolean,
	listStyle?: React.CSSProperties,
	style?: React.CSSProperties,
	onClick?: (uuid: string) => void
}

const sizeClassName: Record<ButtonTabsSize, string> = {
	[ButtonTabsSize.SMALL]: "blue-orange-button-tabs-list-sm",
	[ButtonTabsSize.MEDIUM]: "",
	[ButtonTabsSize.LARGE]: "blue-orange-button-tabs-list-lg",
};

/**
 * A segmented control style tab group — the triggers sit inside a filled track
 * and the active one is lifted out as a pill. Kept separate from Tabs, which
 * keeps its underlined header.
 */
export const ButtonTabs: React.FC<Props> = ({
												children,
												activeTab,
												size = ButtonTabsSize.MEDIUM,
												fullWidth = false,
												listStyle = {},
												style = {},
												onClick}) => {

	const tabs: TabData[] = [];

	const tabMetaData: TabMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === ButtonTab) {
				tabs.push({
					uuid: child.props.uuid as string,
					children: child.props.children
				});
				tabMetaData.push({
					uuid: child.props.uuid as string,
					name: child.props.name as string,
					icon: child.props.icon as (string | undefined),
					disabled: (child.props.disabled as boolean) ?? false
				});
			}
		}
	});

	const firstEnabled = tabMetaData.find(metaData => !metaData.disabled);

	const [active, setActive] = useState(activeTab ?? firstEnabled?.uuid ?? tabMetaData[0]?.uuid ?? "");

	const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({});

	useEffect(() => {
		if (activeTab !== undefined) {
			setActive(activeTab);
		}
	}, [activeTab]);

	const updateActiveTab = (metaData: TabMetaData) => {
		if (metaData.disabled) {
			return;
		}
		setActive(metaData.uuid);
		if (onClick) {
			onClick(metaData.uuid);
		}
	}

	/** Left/right (and home/end) move between the triggers, as a tablist should. */
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
		const selectable = tabMetaData.filter(metaData => !metaData.disabled);
		if (selectable.length === 0) {
			return;
		}
		const currentSelectableIndex = selectable.findIndex(metaData => metaData.uuid === tabMetaData[index].uuid);
		var next: TabMetaData | undefined;
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			next = selectable[(currentSelectableIndex + 1 + selectable.length) % selectable.length];
		} else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			next = selectable[(currentSelectableIndex - 1 + selectable.length) % selectable.length];
		} else if (event.key === "Home") {
			next = selectable[0];
		} else if (event.key === "End") {
			next = selectable[selectable.length - 1];
		} else if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			updateActiveTab(tabMetaData[index]);
			return;
		}
		if (next) {
			event.preventDefault();
			updateActiveTab(next);
			triggerRefs.current[next.uuid]?.focus();
		}
	}

	const generateListClassName = () => {
		var className = "blue-orange-button-tabs-list no-select";
		if (sizeClassName[size]) {
			className += " " + sizeClassName[size];
		}
		if (fullWidth) {
			className += " blue-orange-button-tabs-list-full-width";
		}
		return className;
	}

	const generateTriggerClassName = (metaData: TabMetaData) => {
		var className = "blue-orange-button-tabs-trigger";
		if (metaData.uuid === active) {
			className += " blue-orange-button-tabs-trigger-active";
		}
		if (metaData.disabled) {
			className += " blue-orange-button-tabs-trigger-disabled";
		}
		return className;
	}

	return (
		<div className="blue-orange-button-tabs-group" style={style}>
			<div className={generateListClassName()} role="tablist" style={listStyle}>
				{tabMetaData.map((metaData, index) => (
					<div
						key={metaData.uuid}
						ref={(element) => {triggerRefs.current[metaData.uuid] = element}}
						role="tab"
						aria-selected={metaData.uuid === active}
						aria-disabled={metaData.disabled}
						tabIndex={metaData.uuid === active ? 0 : -1}
						className={generateTriggerClassName(metaData)}
						onKeyDown={(event) => handleKeyDown(event, index)}
						onClick={() => updateActiveTab(metaData)}>
						{metaData.icon && <i className={metaData.icon + " blue-orange-button-tabs-trigger-icon"}></i>}
						<span>{metaData.name}</span>
					</div>
				))}
			</div>
			{tabs.map((tab) => (
				<div
					key={tab.uuid}
					role="tabpanel"
					className={tab.uuid === active
						? "blue-orange-button-tabs-panel"
						: "blue-orange-button-tabs-panel blue-orange-button-tabs-panel-hidden"}>
					{tab.children}
				</div>
			))}
		</div>
	)
}
