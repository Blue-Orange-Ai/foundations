// @ts-ignore
import React, {useContext, useEffect, useRef, useState} from "react";

import './WorkspaceLanding.css'
import {SidebarPage} from "../../components/layouts/pages/sidebar-page/SidebarPage";
import {SideBar, SideBarState} from "../../components/layouts/sidebar/default/SideBar";
import {SideBarHeader} from "../../components/layouts/sidebar/sidebar-header/SideBarHeader";
import {SideBarHeaderItem} from "../../components/layouts/sidebar/items/sidebar-header-item/SideBarHeaderItem";
import {SideBarBody} from "../../components/layouts/sidebar/sidebar-body/SideBarBody";
import {SideBarBodyGroup} from "../../components/layouts/sidebar/items/sidebar-body-group/SideBarBodyGroup";
import {SideBarBodyLabel} from "../../components/layouts/sidebar/items/sidebar-body-label/SideBarBodyLabel";
import {SideBarBodyItem} from "../../components/layouts/sidebar/items/sidebar-body-item/SideBarBodyItem";
import {useNavigate, useParams} from "react-router-dom";
import {LineChartDevelopment} from "../components/charts/line/LineChartDevelopment";
import {ScatterChartDevelopment} from "../components/charts/scatter/ScatterChartDevelopment";
import {BarChartDevelopment} from "../components/charts/bar/BarChartDevelopment";
import {RuleEditorDevelopment} from "../components/rules/rule-editor/RuleEditorDevelopment";
import {FileSystemDevelopment} from "../components/file-system/FileSystemDevelopment";
import {RichTextDevelopment} from "../components/inputs/rich-text/RichTextDevelopment";
import {FullPageCommentsDevelopment} from "../components/comments/full-page-comments/FullPageCommentsDevelopment";
import {AdvancedTooltipDevelopment} from "../components/tooltips/advanced-tooltip/AdvancedTooltipDevelopment";

interface Props {
}


export const WorkspaceLanding: React.FC<Props> = ({}) => {

	const navigate = useNavigate();

	const { component } = useParams();

	const [sidebarState, setSidebarState] = useState(SideBarState.OPEN);

	const [sidebarGroupState, setSidebarGroupState] = useState(false);

	const [sidebarCommentState, setSidebarCommentState] = useState(false);

	const [sidebarChartState, setSidebarChartState] = useState(false);

	const [sidebarInputState, setSidebarInputState] = useState(false);

	const changeSidebarState = (state: SideBarState) => {
		setSidebarState(state);
	}

	const inactiveStyle: React.CSSProperties = {opacity: "0.8"};

	const activeStyle: React.CSSProperties = {opacity: "1"};

	return (
		<SidebarPage>
			<SideBar state={sidebarState} changeState={changeSidebarState}>
				<SideBarHeader>
					<SideBarHeaderItem label="Foundations" state={sidebarState} changeState={changeSidebarState}></SideBarHeaderItem>
				</SideBarHeader>
				<SideBarBody>
					<SideBarBodyItem
						label={"Accordion"}
						active={component == "accordion"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-expand-up-down-line"></i>}
						onClick={() => navigate("/accordion")}
					></SideBarBodyItem>
					<SideBarBodyGroup opened={sidebarGroupState}>
						<SideBarBodyLabel
							icon={sidebarGroupState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Alerts"}
							onClick={() => setSidebarGroupState(!sidebarGroupState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Toaster"}
							active={component == "alerts-toaster"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-bread-fill"></i>}
							onClick={() => navigate("/alerts-toaster")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"In Line"}
							active={component == "alerts-in-line"}
							focused={true}
							defaultStyle={inactiveStyle}
							focusedStyle={activeStyle}
							hoverEffects={true}
							onClick={() => navigate("/alerts-in-line")}
							icon={<i className="ri-alarm-warning-fill"></i>}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyItem
						label={"Avatar"}
						active={component == "avatar"}
						focused={true}
						defaultStyle={inactiveStyle}
						focusedStyle={activeStyle}
						hoverEffects={true}
						onClick={() => navigate("/avatar")}
						icon={<i className="ri-user-4-line"></i>}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Buttons"}
						active={component == "buttons"}
						focused={true}
						defaultStyle={inactiveStyle}
						focusedStyle={activeStyle}
						hoverEffects={true}
						onClick={() => navigate("/buttons")}
						icon={<i className="ri-radio-button-line"></i>}
					></SideBarBodyItem>
					<SideBarBodyGroup opened={sidebarChartState}>
						<SideBarBodyLabel
							icon={sidebarChartState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Charts"}
							onClick={() => setSidebarChartState(!sidebarChartState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Bar"}
							active={component == "charts-bar"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-bar-chart-fill"></i>}
							onClick={() => navigate("/charts-bar")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Line"}
							active={component == "charts-line"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-line-chart-line"></i>}
							onClick={() => navigate("/charts-line")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Scatter"}
							active={component == "charts-scatter"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-bubble-chart-fill"></i>}
							onClick={() => navigate("/charts-scatter")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyGroup opened={sidebarCommentState}>
						<SideBarBodyLabel
							icon={sidebarCommentState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Comments"}
							onClick={() => setSidebarCommentState(!sidebarCommentState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Full Page"}
							active={component == "comments-full-page"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-discuss-line"></i>}
							onClick={() => navigate("/comments-full-page")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Floating"}
							active={component == "comments-floating"}
							focused={true}
							defaultStyle={inactiveStyle}
							focusedStyle={activeStyle}
							hoverEffects={true}
							onClick={() => navigate("/comments-floating")}
							icon={<i className="ri-chat-4-fill"></i>}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyItem
						label={"Context Menu"}
						active={component == "context-menu"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-menu-line"></i>}
						onClick={() => navigate("/context-menu")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"File System"}
						active={component == "file-system"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-folder-6-fill"></i>}
						onClick={() => navigate("/file-system")}
					></SideBarBodyItem>
					<SideBarBodyGroup opened={sidebarInputState}>
						<SideBarBodyLabel
							icon={sidebarInputState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Inputs"}
							onClick={() => setSidebarInputState(!sidebarInputState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Address Input"}
							active={component == "inputs-address"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-map-pin-3-line"></i>}
							onClick={() => navigate("/inputs-address")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Checkbox Input"}
							active={component == "inputs-checkbox"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-checkbox-line"></i>}
							onClick={() => navigate("/inputs-checkbox")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Date Input"}
							active={component == "inputs-date"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-calendar-fill"></i>}
							onClick={() => navigate("/inputs-date")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Emoji Input"}
							active={component == "inputs-emoji"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-user-smile-line"></i>}
							onClick={() => navigate("/inputs-emoji")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"File Input"}
							active={component == "inputs-file"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-file-upload-line"></i>}
							onClick={() => navigate("/inputs-file")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Help Tooltip"}
							active={component == "inputs-help"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-question-line"></i>}
							onClick={() => navigate("/inputs-help")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"General Input"}
							active={component == "inputs-general"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-keyboard-fill"></i>}
							onClick={() => navigate("/inputs-general")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Phone Input"}
							active={component == "inputs-phone"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-cellphone-line"></i>}
							onClick={() => navigate("/inputs-phone")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Rich Text Input"}
							active={component == "inputs-rich-text"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-paragraph"></i>}
							onClick={() => navigate("/inputs-rich-text")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Search Input"}
							active={component == "inputs-search"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-search-line"></i>}
							onClick={() => navigate("/inputs-search")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Tag Input"}
							active={component == "inputs-tags"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-price-tag-3-fill"></i>}
							onClick={() => navigate("/inputs-tags")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Text Area Input"}
							active={component == "inputs-text-area"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-text-block"></i>}
							onClick={() => navigate("/inputs-text-area")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Toggle Input"}
							active={component == "inputs-toggle"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-toggle-line"></i>}
							onClick={() => navigate("/inputs-toggle")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyItem
						label={"Rules Editor"}
						active={component == "rules"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-ruler-fill"></i>}
						onClick={() => navigate("/rules")}
					></SideBarBodyItem>
					<SideBarBodyGroup opened={sidebarInputState}>
						<SideBarBodyLabel
							icon={sidebarInputState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Tooltips"}
							onClick={() => setSidebarInputState(!sidebarInputState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Advanced Tooltip"}
							active={component == "tooltips-advanced"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-question-fill"></i>}
							onClick={() => navigate("/tooltips-advanced")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
				</SideBarBody>
			</SideBar>
			{component == "charts-line" && <LineChartDevelopment></LineChartDevelopment>}
			{component == "charts-bar" && <BarChartDevelopment></BarChartDevelopment>}
			{component == "charts-scatter" && <ScatterChartDevelopment></ScatterChartDevelopment>}
			{component == "rules" && <RuleEditorDevelopment></RuleEditorDevelopment>}
			{component == "file-system" && <FileSystemDevelopment></FileSystemDevelopment>}
			{component == "inputs-rich-text" && <RichTextDevelopment></RichTextDevelopment>}
			{component == "comments-full-page" && <FullPageCommentsDevelopment></FullPageCommentsDevelopment>}
			{component == "tooltips-advanced" && <AdvancedTooltipDevelopment></AdvancedTooltipDevelopment>}
		</SidebarPage>
	)
}