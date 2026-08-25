import React, {useState} from "react";

import './ButtonTabsDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {ButtonTabs, ButtonTabsSize} from "../../../../components/layouts/button-tabs/button-tabs/ButtonTabs";
import {ButtonTab} from "../../../../components/layouts/button-tabs/button-tab/ButtonTab";
import {Input} from "../../../../components/inputs/input/Input";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const BUTTON_TABS_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The ButtonTab entries, in the order they sit in the track."
	},
	{
		name: "activeTab",
		type: "string",
		control: "text",
		description: "The uuid of the selected tab. Setting it moves the selection from the outside."
	},
	{
		name: "size",
		type: "ButtonTabsSize",
		default: "ButtonTabsSize.MEDIUM",
		defaultValue: ButtonTabsSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: ButtonTabsSize.SMALL, code: "ButtonTabsSize.SMALL"},
			{label: "Medium", value: ButtonTabsSize.MEDIUM, code: "ButtonTabsSize.MEDIUM"},
			{label: "Large", value: ButtonTabsSize.LARGE, code: "ButtonTabsSize.LARGE"}
		],
		description: "How large the triggers are."
	},
	{
		name: "fullWidth",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stretches the triggers so the group fills the width of its parent."
	},
	{
		name: "listStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the track the triggers sit in."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the group."
	},
	{
		name: "onClick",
		type: "(uuid: string) => void",
		description: "Fires with the uuid of the tab that was selected."
	}
];

const BUTTON_TAB_PROPS: Array<PropSpec> = [
	{
		name: "uuid",
		type: "string",
		required: true,
		description: "Identifies the tab, and is what activeTab and onClick speak in."
	},
	{
		name: "name",
		type: "string",
		required: true,
		control: "text",
		value: "List",
		description: "What the trigger reads."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-list-check",
		description: "A remixicon class shown before the name."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the trigger out and takes it out of the keyboard order."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "What the group shows while this tab is selected."
	}
];

interface Props {
}

export const ButtonTabsDevelopment: React.FC<Props> = ({}) => {

	const [active, setActive] = useState("overview");

	return (
		<ComponentDoc
			title="Button Tabs"
			description="A segmented control style tab group — the triggers sit in a filled track and the active one is lifted out as a pill. Kept separate from Tabs, which keeps its underlined header."
			name="ButtonTabs"
			previewHeight={200}
			previewCentered={false}
			imports={["ButtonTab", "ButtonTabsSize"]}
			props={BUTTON_TABS_PROPS}
			snippetChildren={() => "<ButtonTab uuid={\"list\"} name={\"List\"} icon={\"ri-list-check\"}>\n\t<p>The list view.</p>\n</ButtonTab>\n<ButtonTab uuid={\"board\"} name={\"Board\"} icon={\"ri-layout-grid-line\"}>\n\t<p>The board view.</p>\n</ButtonTab>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<ButtonTabs
						size={values.size}
						fullWidth={values.fullWidth}
						onClick={() => {}}>
						<ButtonTab uuid="list" name="List" icon="ri-list-check">
							<p>The list view.</p>
						</ButtonTab>
						<ButtonTab uuid="board" name="Board" icon="ri-layout-grid-line">
							<p>The board view.</p>
						</ButtonTab>
						<ButtonTab uuid="calendar" name="Calendar" icon="ri-calendar-line">
							<p>The calendar view.</p>
						</ButtonTab>
					</ButtonTabs>
				</div>
			)}
			siblings={[
				{
					name: "ButtonTab",
					description: "Declares one tab. Like Tab it renders nothing itself — ButtonTabs reads its props and its children.",
					props: BUTTON_TAB_PROPS,
					previewHeight: 160,
					previewCentered: false,
					imports: ["ButtonTabs"],
					snippetChildren: () => "<p>The list view.</p>",
					preview: values => (
						<div style={{width: "100%"}}>
							<ButtonTabs>
								<ButtonTab
									uuid="list"
									name={values.name}
									icon={values.icon}
									disabled={values.disabled}>
									<p>The list view.</p>
								</ButtonTab>
								<ButtonTab uuid="board" name="Board">
									<p>The board view.</p>
								</ButtonTab>
							</ButtonTabs>
						</div>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<ButtonTabs>
				<ButtonTab uuid="account" name="Account">
					<div className="blue-orange-button-tabs-development-panel">
						<Input label="Name" value="Tom"></Input>
					</div>
				</ButtonTab>
				<ButtonTab uuid="password" name="Password">
					<div className="blue-orange-button-tabs-development-panel">
						<Input label="Current password" isPassword={true}></Input>
					</div>
				</ButtonTab>
			</ButtonTabs>

			<GeneralHeading>With icons</GeneralHeading>
			<ButtonTabs>
				<ButtonTab uuid="grid" name="Grid" icon="ri-grid-line">
					<div className="blue-orange-button-tabs-development-panel">Grid view.</div>
				</ButtonTab>
				<ButtonTab uuid="list" name="List" icon="ri-list-unordered">
					<div className="blue-orange-button-tabs-development-panel">List view.</div>
				</ButtonTab>
				<ButtonTab uuid="board" name="Board" icon="ri-layout-column-line" disabled={true}>
					<div className="blue-orange-button-tabs-development-panel">Board view.</div>
				</ButtonTab>
			</ButtonTabs>

			<GeneralHeading>Sizes</GeneralHeading>
			<div className="blue-orange-button-tabs-development-stack">
				<ButtonTabs size={ButtonTabsSize.SMALL}>
					<ButtonTab uuid="small-a" name="Small"></ButtonTab>
					<ButtonTab uuid="small-b" name="Tabs"></ButtonTab>
				</ButtonTabs>
				<ButtonTabs size={ButtonTabsSize.MEDIUM}>
					<ButtonTab uuid="medium-a" name="Medium"></ButtonTab>
					<ButtonTab uuid="medium-b" name="Tabs"></ButtonTab>
				</ButtonTabs>
				<ButtonTabs size={ButtonTabsSize.LARGE}>
					<ButtonTab uuid="large-a" name="Large"></ButtonTab>
					<ButtonTab uuid="large-b" name="Tabs"></ButtonTab>
				</ButtonTabs>
			</div>

			<GeneralHeading>Full width</GeneralHeading>
			<ButtonTabs fullWidth={true}>
				<ButtonTab uuid="week" name="Week"></ButtonTab>
				<ButtonTab uuid="month" name="Month"></ButtonTab>
				<ButtonTab uuid="year" name="Year"></ButtonTab>
			</ButtonTabs>

			<GeneralHeading>Controlled</GeneralHeading>
			<Description>{"The active tab is " + active + "."}</Description>
			<ButtonTabs activeTab={active} onClick={setActive}>
				<ButtonTab uuid="overview" name="Overview">
					<div className="blue-orange-button-tabs-development-panel">Overview content.</div>
				</ButtonTab>
				<ButtonTab uuid="activity" name="Activity">
					<div className="blue-orange-button-tabs-development-panel">Activity content.</div>
				</ButtonTab>
				<ButtonTab uuid="settings" name="Settings">
					<div className="blue-orange-button-tabs-development-panel">Settings content.</div>
				</ButtonTab>
			</ButtonTabs>
		</ComponentDoc>
	)
}
