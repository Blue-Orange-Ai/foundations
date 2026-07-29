import React, {useState} from "react";

import './ButtonTabsDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {ButtonTabs, ButtonTabsSize} from "../../../../components/layouts/button-tabs/button-tabs/ButtonTabs";
import {ButtonTab} from "../../../../components/layouts/button-tabs/button-tab/ButtonTab";
import {Input} from "../../../../components/inputs/input/Input";

interface Props {
}

export const ButtonTabsDevelopment: React.FC<Props> = ({}) => {

	const [active, setActive] = useState("overview");

	return (
		<PaddedPage>
			<PageHeading>Button Tabs</PageHeading>
			<Description>
				A segmented control style tab group — the triggers sit in a filled track and the active
				one is lifted out as a pill. Separate from Tabs, which keeps its underlined header.
			</Description>

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
		</PaddedPage>
	)
}
