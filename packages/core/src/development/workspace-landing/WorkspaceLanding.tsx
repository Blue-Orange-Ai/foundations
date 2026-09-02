// @ts-ignore
import React, {useContext, useEffect, useRef, useState} from "react";

import './WorkspaceLanding.css'
import {SidebarPage} from "../../components/layouts/pages/sidebar-page/SidebarPage";
import {SideBar, SideBarState} from "../../components/layouts/sidebar/default/SideBar";
import {SideBarHeader} from "../../components/layouts/sidebar/sidebar-header/SideBarHeader";
import {SideBarHeaderItem} from "../../components/layouts/sidebar/items/sidebar-header-item/SideBarHeaderItem";
import {SideBarBody} from "../../components/layouts/sidebar/sidebar-body/SideBarBody";
import {SideBarFooter} from "../../components/layouts/sidebar/sidebar-footer/SideBarFooter";
import {ThemeSwitch} from "./theme-switch/ThemeSwitch";
import {SideBarBodyGroup} from "../../components/layouts/sidebar/items/sidebar-body-group/SideBarBodyGroup";
import {SideBarBodyLabel} from "../../components/layouts/sidebar/items/sidebar-body-label/SideBarBodyLabel";
import {SideBarBodyItem} from "../../components/layouts/sidebar/items/sidebar-body-item/SideBarBodyItem";
import {useNavigate, useParams} from "react-router-dom";
import {LineChartDevelopment} from "../components/charts/line/LineChartDevelopment";
import {ScatterChartDevelopment} from "../components/charts/scatter/ScatterChartDevelopment";
import {BarChartDevelopment} from "../components/charts/bar/BarChartDevelopment";
import {RuleEditorDevelopment} from "../components/rules/rule-editor/RuleEditorDevelopment";
import {FileSystemDevelopment} from "../components/file-system/FileSystemDevelopment";
import {ModalDevelopment} from "../components/layouts/modal/ModalDevelopment";
import {DrawerDevelopment} from "../components/layouts/drawer/DrawerDevelopment";
import {TabsDevelopment} from "../components/layouts/tabs/TabsDevelopment";
import {PagesDevelopment} from "../components/layouts/pages/PagesDevelopment";
import {SideBarDevelopment} from "../components/layouts/sidebar/SideBarDevelopment";
import {LoadingDevelopment} from "../components/loading/LoadingDevelopment";
import {MediaDevelopment} from "../components/media/MediaDevelopment";
import {MetricsDevelopment} from "../components/metrics/metrics/MetricsDevelopment";
import {TableDevelopment} from "../components/table/table/TableDevelopment";
import {TimeInputDevelopment} from "../components/inputs/time-input/TimeInputDevelopment";
import {EmailRecipientDevelopment} from "../components/inputs/email-recipient/EmailRecipientDevelopment";
import {RichTextDevelopment} from "../components/inputs/rich-text/RichTextDevelopment";
import {FullPageCommentsDevelopment} from "../components/comments/full-page-comments/FullPageCommentsDevelopment";
import {AdvancedTooltipDevelopment} from "../components/tooltips/advanced-tooltip/AdvancedTooltipDevelopment";
import {SimpleTooltipDevelopment} from "../components/tooltips/simple-tooltip/SimpleTooltipDevelopment";
import {RichTextPromptDevelopment} from "../components/inputs/rich-text-prompt/RichTextPromptDevelopment";
import Cookies from "js-cookie";
import {FloatingCommentsDevelopment} from "../components/comments/floating-comments/FloatingCommentsDevelopment";
import {SocketWorkspace} from "../socket-workspace/SocketWorkspace";
import {ButtonDevelopment} from "../components/buttons/ButtonDevelopment";
import {ColorPickerDevelopment} from "../components/inputs/color-picker/ColorPickerDevelopment";
import {IconSelectorDevelopment} from "../components/inputs/icon-selector/IconSelectorDevelopment";
import {DataTableDevelopment} from "../components/table/data-table/DataTableDevelopment";
import {ContextMenuDevelopment} from "../components/contextmenu/ContextMenuDevelopment";
import {AddressInputDevelopment} from "../components/inputs/address-input/AddressInputDevelopment";
import {CheckboxInputDevelopment} from "../components/inputs/checkbox-input/CheckboxInputDevelopment";
import {DateInputDevelopment} from "../components/inputs/date-input/DateInputDevelopment";
import {DropdownInputDevelopment} from "../components/inputs/dropdown-input/DropdownInputDevelopment";
import {EmojiInputDevelopment} from "../components/inputs/emoji-input/EmojiInputDevelopment";
import {PhoneInputDevelopment} from "../components/inputs/phone-input/PhoneInputDevelopment";
import {PhraseInputDevelopment} from "../components/inputs/phrase-input/PhraseInputDevelopment";
import {TagInputDevelopment} from "../components/inputs/tag-input/TagInputDevelopment";
import {PassportTagInputDevelopment} from "../components/inputs/passport-tag-input/PassportTagInputDevelopment";
import {GeneralInputDevelopment} from "../components/inputs/general-input/GeneralInputDevelopment";
import {TextAreaDevelopment} from "../components/inputs/textarea/TextAreaDevelopment";
import {ToggleInputDevelopment} from "../components/inputs/toggle-input/ToggleInputDevelopment";
import {AccordionDevelopment} from "../components/accordion/AccordionDevelopment";
import {CodeBlockDevelopment} from "../components/text-decorations/code-block/CodeBlockDevelopment";
import {BadgeDevelopment} from "../components/text-decorations/badge/BadgeDevelopment";
import {CompoundBadgeDevelopment} from "../components/text-decorations/compound-badge/CompoundBadgeDevelopment";
import {CurrencyDevelopment} from "../components/text-decorations/currency/CurrencyDevelopment";
import {DatesDevelopment} from "../components/text-decorations/dates/DatesDevelopment";
import {DescriptionDevelopment} from "../components/text-decorations/description/DescriptionDevelopment";
import {DotifiedTextDevelopment} from "../components/text-decorations/dotified-text/DotifiedTextDevelopment";
import {EmailLinkDevelopment} from "../components/text-decorations/email-link/EmailLinkDevelopment";
import {FormHeadingDevelopment} from "../components/text-decorations/form-heading/FormHeadingDevelopment";
import {GeneralHeadingDevelopment} from "../components/text-decorations/general-heading/GeneralHeadingDevelopment";
import {JsonObjectTextDevelopment} from "../components/text-decorations/json-object-text/JsonObjectTextDevelopment";
import {NumberTextDevelopment} from "../components/text-decorations/number-text/NumberTextDevelopment";
import {NumberUnitsDevelopment} from "../components/text-decorations/number-units/NumberUnitsDevelopment";
import {PageHeadingDevelopment} from "../components/text-decorations/page-heading/PageHeadingDevelopment";
import {ParagraphDevelopment} from "../components/text-decorations/paragraph/ParagraphDevelopment";
import {PercentageDevelopment} from "../components/text-decorations/percentage/PercentageDevelopment";
import {CopyableTextDevelopment} from "../components/text-decorations/copyable-text/CopyableTextDevelopment";
import {PropertiesDisplayDevelopment} from "../components/text-decorations/properties-display/PropertiesDisplayDevelopment";
import {PropertyHistogramDevelopment} from "../components/text-decorations/property-histogram/PropertyHistogramDevelopment";
import {RenderHtmlDevelopment} from "../components/text-decorations/render-html/RenderHtmlDevelopment";
import {CompoundTagDevelopment} from "../components/text-decorations/compound-tag/CompoundTagDevelopment";
import {TagDevelopment} from "../components/text-decorations/tag/TagDevelopment";
import {TelephoneTextDevelopment} from "../components/text-decorations/telephone-text/TelephoneTextDevelopment";
import {TruncatedTextDevelopment} from "../components/text-decorations/truncated-text/TruncatedTextDevelopment";
import {MarkdownTextDevelopment} from "../components/text-decorations/markdown-text/MarkdownTextDevelopment";
import {CopyInputDevelopment} from "../components/inputs/copy-input/CopyInputDevelopment";
import {ComboChartDevelopment} from "../components/charts/combo/ComboChartDevelopment";
import {SearchInputDevelopment} from "../components/inputs/search-input/SearchInputDevelopment";
import {ToasterDevelopment} from "../components/alerts/toaster/ToasterDevelopment";
import {InLineAlertsDevelopment} from "../components/alerts/in-line/InLineAlertsDevelopment";
import {AvatarDevelopment} from "../components/avatar/AvatarDevelopment";
import {FileInputDevelopment} from "../components/inputs/file-input/FileInputDevelopment";
import {HelpTooltipDevelopment} from "../components/inputs/help-tooltip/HelpTooltipDevelopment";
import {ObjectTableDevelopment} from "../components/table/object-table/ObjectTableDevelopment";
import {SearchQueryEditorDevelopment} from "../components/search/search-query-editor/SearchQueryEditorDevelopment";
import {SchemaEditorDevelopment} from "../components/search/schema-editor/SchemaEditorDevelopment";
import {ArrayInputDevelopment} from "../components/inputs/array-input/ArrayInputDevelopment";
import {ObjectArrayInputDevelopment} from "../components/inputs/object-array-input/ObjectArrayInputDevelopment";
import {JsonSchemaEditorDevelopment} from "../components/inputs/json-schema-editor/JsonSchemaEditorDevelopment";
import {
    SearchQueryEditorSmallDevelopment
} from "../components/search/search-query-editor-small/SearchQueryEditorSmallDevelopment";
import {FileUploadTableDevelopment} from "../components/inputs/file-upload-table/FileUploadTableDevelopment";
import {BreadcrumbsDevelopment} from "../components/breadcrumbs/BreadcrumbsDevelopment";
import {SearchPlaygroundDevelopment} from "../components/search/search-playground/SearchPlaygroundDevelopment";
import {MetricsGroupDevelopment} from "../components/metrics/metrics-group/MetricsGroupDevelopment";
import {ValidationDevelopment} from "../components/inputs/validation/ValidationDevelopment";
import {FormGroupDevelopment} from "../components/inputs/form-group/FormGroupDevelopment";
import {CardDevelopment} from "../components/card/CardDevelopment";
import {CarouselDevelopment} from "../components/carousel/CarouselDevelopment";
import {CommandDevelopment} from "../components/command/CommandDevelopment";
import {EmptyDevelopment} from "../components/empty/EmptyDevelopment";
import {MenubarDevelopment} from "../components/menubar/MenubarDevelopment";
import {NavigationMenuDevelopment} from "../components/navigation-menu/NavigationMenuDevelopment";
import {PaginationDevelopment} from "../components/pagination/PaginationDevelopment";
import {PanelDevelopment} from "../components/panel/PanelDevelopment";
import {SpinnerDevelopment} from "../components/loading/spinner/SpinnerDevelopment";
import {SliderDevelopment} from "../components/inputs/slider/SliderDevelopment";
import {OTPInputDevelopment} from "../components/inputs/otp-input/OTPInputDevelopment";
import {KbdDevelopment} from "../components/text-decorations/kbd/KbdDevelopment";
import {IconTextDevelopment} from "../components/text-decorations/icon-text/IconTextDevelopment";
import {SeparatorDevelopment} from "../components/layouts/separator/SeparatorDevelopment";
import {ButtonTabsDevelopment} from "../components/layouts/button-tabs/ButtonTabsDevelopment";
import {FilterPillsDevelopment} from "../components/filters/filter-pills/FilterPillsDevelopment";
import {OptionCardsDevelopment} from "../components/inputs/option-cards/OptionCardsDevelopment";
import {HoverCardDevelopment} from "../components/tooltips/hover-card/HoverCardDevelopment";
import {StepperDevelopment} from "../components/stepper/StepperDevelopment";
import {QuestionnaireDevelopment} from "../components/questionnaire/QuestionnaireDevelopment";
import {TimelineDevelopment} from "../components/timeline/TimelineDevelopment";
import {WizardDevelopment} from "../components/wizard/WizardDevelopment";

interface Props {
}

Cookies.set("authorization","eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2Y1ODdiNy00YTY3LTQzN2YtOGMyNS1hY2NiOGRlNWUyN2MiLCJleHAiOjE3NzAxMTY4ODh9.5-9nogPXF6rtUbRxfsloavMkgHxf8SWWe-qL1h4s4BK5gyfI5RV_pXLVPs2vcpls7j2G2IO791qM-sLox8-KeQ")

export const WorkspaceLanding: React.FC<Props> = ({}) => {

	const navigate = useNavigate();

	const { component } = useParams();

	const [sidebarState, setSidebarState] = useState(SideBarState.OPEN);

	const [darkMode, setDarkMode] = useState(Cookies.get("theme") === "dark");

	useEffect(() => {
		document.body.classList.toggle("dark", darkMode);
		Cookies.set("theme", darkMode ? "dark" : "light");
		return () => {
			document.body.classList.remove("dark");
		}
	}, [darkMode]);

	const [sidebarGroupState, setSidebarGroupState] = useState(false);

	const [sidebarCommentState, setSidebarCommentState] = useState(false);

	const [sidebarChartState, setSidebarChartState] = useState(false);

	const [sidebarInputState, setSidebarInputState] = useState(false);

    const [sidebarSearchState, setSidebarSearchState] = useState(false);

	const [sidebarTextDecorationState, setSidebarTextDecorationState] = useState(false);

	const [sidebarTooltipState, setSidebarTooltipState] = useState(false);

	const [sidebarTableState, setSidebarTableState] = useState(false);

	const [sidebarLayoutState, setSidebarLayoutState] = useState(false);

	const changeSidebarState = (state: SideBarState) => {
		setSidebarState(state);
	}

	const inactiveStyle: React.CSSProperties = {opacity: "0.8"};

	const activeStyle: React.CSSProperties = {opacity: "1"};

	return (
		<SidebarPage>
			<SideBar state={sidebarState} changeState={changeSidebarState}>
				<SideBarHeader>
					<SideBarHeaderItem
                        label="Foundations"
                        media={{
                            uuid: "asdasdasads",
                            location: "",
                            filename: "foundations-logo",
                            folder: "",
                            bucketname: "",
                            mediaType: "image",
                            dateCreated: new Date(),
                            url: "/foundations-logo.png",
                            mediaPublic: true,
                            fragments: []
                        }}
                        state={sidebarState}
                        changeState={changeSidebarState}></SideBarHeaderItem>
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
					<SideBarBodyGroup opened={sidebarGroupState} onOpenedChange={setSidebarGroupState}>
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
						label={"Breadcrumbs"}
						active={component == "breadcrumbs"}
						focused={true}
						defaultStyle={inactiveStyle}
						focusedStyle={activeStyle}
						hoverEffects={true}
						onClick={() => navigate("/breadcrumbs")}
						icon={<i className="ri-arrow-right-double-fill"></i>}
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
					<SideBarBodyItem
						label={"Card"}
						active={component == "card"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-square-line"></i>}
						onClick={() => navigate("/card")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Carousel"}
						active={component == "carousel"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-slideshow-line"></i>}
						onClick={() => navigate("/carousel")}
					></SideBarBodyItem>
					<SideBarBodyGroup opened={sidebarChartState} openOnActiveChild={true} onOpenedChange={setSidebarChartState}>
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
							label={"Combo"}
							active={component == "charts-combo"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-bar-chart-fill"></i>}
							onClick={() => navigate("/charts-combo")}
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
					<SideBarBodyGroup opened={sidebarCommentState} openOnActiveChild={true} onOpenedChange={setSidebarCommentState}>
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
						label={"Command"}
						active={component == "command"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-terminal-box-line"></i>}
						onClick={() => navigate("/command")}
					></SideBarBodyItem>
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
						label={"Empty"}
						active={component == "empty"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-inbox-line"></i>}
						onClick={() => navigate("/empty")}
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
					<SideBarBodyGroup opened={sidebarInputState} openOnActiveChild={true} onOpenedChange={setSidebarInputState}>
						<SideBarBodyLabel
							icon={sidebarInputState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Inputs"}
							onClick={() => setSidebarInputState(!sidebarInputState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Validation (overview)"}
							active={component == "inputs-validation"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-shield-check-line"></i>}
							onClick={() => navigate("/inputs-validation")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Form Group"}
							active={component == "inputs-form-group"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-survey-line"></i>}
							onClick={() => navigate("/inputs-form-group")}
						></SideBarBodyItem>
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
							label={"Array Input"}
							active={component == "inputs-array"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-list-ordered-2"></i>}
							onClick={() => navigate("/inputs-array")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Object Array Input"}
							active={component == "inputs-object-array"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-list-unordered"></i>}
							onClick={() => navigate("/inputs-object-array")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Json Schema Editor"}
							active={component == "inputs-json-schema"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-braces-line"></i>}
							onClick={() => navigate("/inputs-json-schema")}
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
							label={"Color Picker"}
							active={component == "inputs-color"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={< i className="ri-palette-line"></i>}
							onClick={() => navigate("/inputs-color")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Copy Input"}
							active={component == "inputs-copy"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={< i className="ri-file-copy-fill"></i>}
							onClick={() => navigate("/inputs-copy")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Date Picker"}
							active={component == "inputs-date"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-calendar-2-line"></i>}
							onClick={() => navigate("/inputs-date")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Icon Selector"}
							active={component == "inputs-icon"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-remixicon-line"></i>}
							onClick={() => navigate("/inputs-icon")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Dropdown Input"}
							active={component == "inputs-dropdown"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-dropdown-list"></i>}
							onClick={() => navigate("/inputs-dropdown")}
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
							label={"File Upload Table"}
							active={component == "inputs-file-upload-table"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-upload-cloud-2-line"></i>}
							onClick={() => navigate("/inputs-file-upload-table")}
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
							label={"Option Cards"}
							active={component == "inputs-option-cards"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-checkbox-multiple-blank-line"></i>}
							onClick={() => navigate("/inputs-option-cards")}
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
							label={"Phrase Input"}
							active={component == "inputs-phrase"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-input-cursor-move"></i>}
							onClick={() => navigate("/inputs-phrase")}
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
							label={"Rich Text Prompt Input"}
							active={component == "inputs-rich-text-prompt"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-terminal-line"></i>}
							onClick={() => navigate("/inputs-rich-text-prompt")}
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
							label={"Passport Tag Input"}
							active={component == "inputs-passport-tags"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-user-search-line"></i>}
							onClick={() => navigate("/inputs-passport-tags")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Time Input"}
							active={component == "inputs-time"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-time-line"></i>}
							onClick={() => navigate("/inputs-time")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Email Recipients"}
							active={component == "inputs-email-recipients"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-mail-line"></i>}
							onClick={() => navigate("/inputs-email-recipients")}
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
						<SideBarBodyItem
							label={"OTP Input"}
							active={component == "inputs-otp"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-shield-keyhole-line"></i>}
							onClick={() => navigate("/inputs-otp")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Slider Input"}
							active={component == "inputs-slider"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-equalizer-line"></i>}
							onClick={() => navigate("/inputs-slider")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyGroup opened={sidebarLayoutState} openOnActiveChild={true} onOpenedChange={setSidebarLayoutState}>
						<SideBarBodyLabel
							icon={sidebarLayoutState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Layouts"}
							onClick={() => setSidebarLayoutState(!sidebarLayoutState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Modal"}
							active={component == "layouts-modal"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-checkbox-multiple-blank-line"></i>}
							onClick={() => navigate("/layouts-modal")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Drawer"}
							active={component == "layouts-drawer"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-side-bar-line"></i>}
							onClick={() => navigate("/layouts-drawer")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Tabs"}
							active={component == "layouts-tabs"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-layout-top-line"></i>}
							onClick={() => navigate("/layouts-tabs")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Button Tabs"}
							active={component == "layouts-button-tabs"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-layout-row-line"></i>}
							onClick={() => navigate("/layouts-button-tabs")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Separator"}
							active={component == "layouts-separator"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-separator"></i>}
							onClick={() => navigate("/layouts-separator")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Pages & Splits"}
							active={component == "layouts-pages"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-layout-grid-line"></i>}
							onClick={() => navigate("/layouts-pages")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Side Bar"}
							active={component == "layouts-sidebar"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-side-bar-fill"></i>}
							onClick={() => navigate("/layouts-sidebar")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyItem
						label={"Filter Pills"}
						active={component == "filter-pills"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-filter-3-line"></i>}
						onClick={() => navigate("/filter-pills")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Metrics Group"}
						active={component == "metrics-group"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-dashboard-3-line"></i>}
						onClick={() => navigate("/metrics-group")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Metrics"}
						active={component == "metrics"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-bar-chart-box-line"></i>}
						onClick={() => navigate("/metrics")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Loading"}
						active={component == "loading"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-loader-4-line"></i>}
						onClick={() => navigate("/loading")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Spinner"}
						active={component == "spinner"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-loader-2-line"></i>}
						onClick={() => navigate("/spinner")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Menubar"}
						active={component == "menubar"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-menu-2-line"></i>}
						onClick={() => navigate("/menubar")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Navigation Menu"}
						active={component == "navigation-menu"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-navigation-line"></i>}
						onClick={() => navigate("/navigation-menu")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Pagination"}
						active={component == "pagination"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-more-line"></i>}
						onClick={() => navigate("/pagination")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Panel"}
						active={component == "panel"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-layout-right-line"></i>}
						onClick={() => navigate("/panel")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Stepper"}
						active={component == "stepper"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-guide-line"></i>}
						onClick={() => navigate("/stepper")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Questionnaire"}
						active={component == "questionnaire"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-questionnaire-line"></i>}
						onClick={() => navigate("/questionnaire")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Timeline"}
						active={component == "timeline"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-history-line"></i>}
						onClick={() => navigate("/timeline")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Wizard"}
						active={component == "wizard"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-magic-line"></i>}
						onClick={() => navigate("/wizard")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Media"}
						active={component == "media"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-image-line"></i>}
						onClick={() => navigate("/media")}
					></SideBarBodyItem>
					<SideBarBodyItem
						label={"Rules Editor"}
						active={component == "rules"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-ruler-fill"></i>}
						onClick={() => navigate("/rules")}
					></SideBarBodyItem>
                    <SideBarBodyGroup opened={sidebarSearchState} openOnActiveChild={true} onOpenedChange={setSidebarSearchState}>
                        <SideBarBodyLabel
                            icon={sidebarSearchState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
                            label={"Search"}
                            onClick={() => setSidebarSearchState(!sidebarSearchState)}
                        ></SideBarBodyLabel>
                        <SideBarBodyItem
                            label={"Search Query Editor"}
                            active={component == "search-query"}
                            focused={false}
                            defaultStyle={inactiveStyle}
                            activeStyle={activeStyle}
                            icon={<i className="ri-search-line"></i>}
                            onClick={() => navigate("/search-query")}

                        ></SideBarBodyItem>
                        <SideBarBodyItem
                            label={"Search Query Editor Small"}
                            active={component == "search-query-small"}
                            focused={false}
                            defaultStyle={inactiveStyle}
                            activeStyle={activeStyle}
                            icon={<i className="ri-search-line"></i>}
                            onClick={() => navigate("/search-query-small")}

                        ></SideBarBodyItem>
                        <SideBarBodyItem
                            label={"Schema Editor"}
                            active={component == "schema-editor"}
                            focused={false}
                            defaultStyle={inactiveStyle}
                            activeStyle={activeStyle}
                            icon={<i className="ri-braces-fill"></i>}
                            onClick={() => navigate("/schema-editor")}
                        ></SideBarBodyItem>
                        <SideBarBodyItem
                            label={"Search Playground"}
                            active={component == "search-playground"}
                            focused={false}
                            defaultStyle={inactiveStyle}
                            activeStyle={activeStyle}
                            icon={<i className="ri-git-repository-fill"></i>}
                            onClick={() => navigate("/search-playground")}
                        ></SideBarBodyItem>
                    </SideBarBodyGroup>
					<SideBarBodyGroup opened={sidebarTooltipState} openOnActiveChild={true} onOpenedChange={setSidebarTooltipState}>
						<SideBarBodyLabel
							icon={sidebarTooltipState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Tooltips"}
							onClick={() => setSidebarTooltipState(!sidebarTooltipState)}
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
						<SideBarBodyItem
							label={"Hover Card"}
							active={component == "tooltips-hover-card"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-profile-line"></i>}
							onClick={() => navigate("/tooltips-hover-card")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Simple Tooltip"}
							active={component == "tooltips-simple"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-question-line"></i>}
							onClick={() => navigate("/tooltips-simple")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyGroup opened={sidebarTableState} openOnActiveChild={true} onOpenedChange={setSidebarTableState}>
						<SideBarBodyLabel
							icon={sidebarTableState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Tables"}
							onClick={() => setSidebarTableState(!sidebarTableState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Data Table"}
							active={component == "table-data"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-grid-fill"></i>}
							onClick={() => navigate("/table-data")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Object Table"}
							active={component == "table-objects"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-square-fill"></i>}
							onClick={() => navigate("/table-objects")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Table (primitives)"}
							active={component == "table-primitives"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-table-line"></i>}
							onClick={() => navigate("/table-primitives")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
					<SideBarBodyItem
						label={"Sockets"}
						active={component == "sockets"}
						focused={false}
						defaultStyle={inactiveStyle}
						activeStyle={activeStyle}
						icon={<i className="ri-link"></i>}
						onClick={() => navigate("/sockets")}
					></SideBarBodyItem>
					<SideBarBodyGroup opened={sidebarTextDecorationState} openOnActiveChild={true} onOpenedChange={setSidebarTextDecorationState}>
						<SideBarBodyLabel
							icon={sidebarTextDecorationState ? <i className={"ri-arrow-down-s-fill"}></i> : <i className={"ri-arrow-right-s-fill"}></i>}
							label={"Text Decorations"}
							onClick={() => setSidebarTextDecorationState(!sidebarTextDecorationState)}
						></SideBarBodyLabel>
						<SideBarBodyItem
							label={"Badge"}
							active={component == "text-decoration-badge"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-price-tag-2-line"></i>}
							onClick={() => navigate("/text-decoration-badge")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Compound Badge"}
							active={component == "text-decoration-compound-badge"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-price-tag-2-line"></i>}
							onClick={() => navigate("/text-decoration-compound-badge")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Icon Text"}
							active={component == "text-decoration-icon-text"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-text-block"></i>}
							onClick={() => navigate("/text-decoration-icon-text")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Kbd"}
							active={component == "text-decoration-kbd"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-keyboard-box-line"></i>}
							onClick={() => navigate("/text-decoration-kbd")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Code Block"}
							active={component == "text-decoration-code-block"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-code-box-line"></i>}
							onClick={() => navigate("/text-decoration-code-block")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Copyable Text"}
							active={component == "text-decoration-copyable-text"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-file-copy-line"></i>}
							onClick={() => navigate("/text-decoration-copyable-text")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Currency"}
							active={component == "text-decoration-currency"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-money-dollar-circle-line"></i>}
							onClick={() => navigate("/text-decoration-currency")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Dates"}
							active={component == "text-decoration-dates"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-calendar-line"></i>}
							onClick={() => navigate("/text-decoration-dates")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Description"}
							active={component == "text-decoration-description"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-file-text-line"></i>}
							onClick={() => navigate("/text-decoration-description")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Dotified Text"}
							active={component == "text-decoration-dotified-text"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-more-line"></i>}
							onClick={() => navigate("/text-decoration-dotified-text")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Email Link"}
							active={component == "text-decoration-email-link"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-mail-line"></i>}
							onClick={() => navigate("/text-decoration-email-link")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Form Heading"}
							active={component == "text-decoration-form-heading"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-input-field"></i>}
							onClick={() => navigate("/text-decoration-form-heading")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"General Heading"}
							active={component == "text-decoration-general-heading"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-heading"></i>}
							onClick={() => navigate("/text-decoration-general-heading")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"JSON Object"}
							active={component == "text-decoration-json-object"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-braces-line"></i>}
							onClick={() => navigate("/text-decoration-json-object")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Number Text"}
							active={component == "text-decoration-number-text"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-hashtag"></i>}
							onClick={() => navigate("/text-decoration-number-text")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Number Units"}
							active={component == "text-decoration-number-units"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-ruler-2-line"></i>}
							onClick={() => navigate("/text-decoration-number-units")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Page Heading"}
							active={component == "text-decoration-page-heading"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-h-1"></i>}
							onClick={() => navigate("/text-decoration-page-heading")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Paragraph"}
							active={component == "text-decoration-paragraph"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-paragraph"></i>}
							onClick={() => navigate("/text-decoration-paragraph")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Percentage"}
							active={component == "text-decoration-percentage"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-percent-line"></i>}
							onClick={() => navigate("/text-decoration-percentage")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Properties Display"}
							active={component == "text-decoration-properties-display"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-list-check-2"></i>}
							onClick={() => navigate("/text-decoration-properties-display")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Property Histogram"}
							active={component == "text-decoration-property-histogram"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-bar-chart-grouped-fill"></i>}
							onClick={() => navigate("/text-decoration-property-histogram")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Render HTML"}
							active={component == "text-decoration-render-html"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-html5-line"></i>}
							onClick={() => navigate("/text-decoration-render-html")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Compound Tag"}
							active={component == "text-decoration-compound-tag"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-price-tag-3-line"></i>}
							onClick={() => navigate("/text-decoration-compound-tag")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Tag"}
							active={component == "text-decoration-tag"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-price-tag-3-line"></i>}
							onClick={() => navigate("/text-decoration-tag")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Telephone Text"}
							active={component == "text-decoration-telephone"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-phone-line"></i>}
							onClick={() => navigate("/text-decoration-telephone")}
						></SideBarBodyItem>
						<SideBarBodyItem
							label={"Truncated Text"}
							active={component == "text-decoration-truncated-text"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-text-wrap"></i>}
							onClick={() => navigate("/text-decoration-truncated-text")}
						></SideBarBodyItem>
							<SideBarBodyItem
							label={"Markdown Text"}
							active={component == "text-decoration-markdown"}
							focused={false}
							defaultStyle={inactiveStyle}
							activeStyle={activeStyle}
							icon={<i className="ri-markdown-line"></i>}
							onClick={() => navigate("/text-decoration-markdown")}
						></SideBarBodyItem>
					</SideBarBodyGroup>
				</SideBarBody>
				<SideBarFooter>
					<ThemeSwitch dark={darkMode} state={sidebarState} onChange={setDarkMode}></ThemeSwitch>
				</SideBarFooter>
			</SideBar>
			{component == "breadcrumbs" && <BreadcrumbsDevelopment></BreadcrumbsDevelopment>}
			{component == "buttons" && <ButtonDevelopment></ButtonDevelopment>}
			{component == "charts-line" && <LineChartDevelopment></LineChartDevelopment>}
			{component == "charts-bar" && <BarChartDevelopment></BarChartDevelopment>}
			{component == "charts-combo" && <ComboChartDevelopment></ComboChartDevelopment>}
			{component == "charts-scatter" && <ScatterChartDevelopment></ScatterChartDevelopment>}
			{component == "rules" && <RuleEditorDevelopment></RuleEditorDevelopment>}
			{component == "metrics-group" && <MetricsGroupDevelopment></MetricsGroupDevelopment>}
			{component == "search-query" && <SearchQueryEditorDevelopment></SearchQueryEditorDevelopment>}
			{component == "search-query-small" && <SearchQueryEditorSmallDevelopment></SearchQueryEditorSmallDevelopment>}
			{component == "schema-editor" && <SchemaEditorDevelopment></SchemaEditorDevelopment>}
            {component == "search-playground" && <SearchPlaygroundDevelopment></SearchPlaygroundDevelopment>}
			{component == "file-system" && <FileSystemDevelopment></FileSystemDevelopment>}
			{component == "layouts-modal" && <ModalDevelopment></ModalDevelopment>}
			{component == "layouts-drawer" && <DrawerDevelopment></DrawerDevelopment>}
			{component == "layouts-tabs" && <TabsDevelopment></TabsDevelopment>}
			{component == "layouts-pages" && <PagesDevelopment></PagesDevelopment>}
			{component == "layouts-sidebar" && <SideBarDevelopment></SideBarDevelopment>}
			{component == "loading" && <LoadingDevelopment></LoadingDevelopment>}
			{component == "media" && <MediaDevelopment></MediaDevelopment>}
			{component == "metrics" && <MetricsDevelopment></MetricsDevelopment>}
			{component == "table-primitives" && <TableDevelopment></TableDevelopment>}
			{component == "inputs-time" && <TimeInputDevelopment></TimeInputDevelopment>}
			{component == "inputs-email-recipients" && <EmailRecipientDevelopment></EmailRecipientDevelopment>}
			{component == "inputs-color" && <ColorPickerDevelopment></ColorPickerDevelopment>}
			{component == "inputs-icon" && <IconSelectorDevelopment></IconSelectorDevelopment>}
			{component == "inputs-option-cards" && <OptionCardsDevelopment></OptionCardsDevelopment>}
			{component == "inputs-rich-text" && <RichTextDevelopment></RichTextDevelopment>}
			{component == "inputs-rich-text-prompt" && <RichTextPromptDevelopment></RichTextPromptDevelopment>}
			{component == "comments-full-page" && <FullPageCommentsDevelopment></FullPageCommentsDevelopment>}
			{component == "comments-floating" && <FloatingCommentsDevelopment></FloatingCommentsDevelopment>}
			{component == "tooltips-advanced" && <AdvancedTooltipDevelopment></AdvancedTooltipDevelopment>}
			{component == "tooltips-simple" && <SimpleTooltipDevelopment></SimpleTooltipDevelopment>}
			{component == "table-data" && <DataTableDevelopment></DataTableDevelopment>}
			{component == "context-menu" && <ContextMenuDevelopment></ContextMenuDevelopment>}
			{component == "sockets" && <SocketWorkspace></SocketWorkspace>}
			{component == "inputs-validation" && <ValidationDevelopment></ValidationDevelopment>}
			{component == "inputs-form-group" && <FormGroupDevelopment></FormGroupDevelopment>}
			{component == "inputs-address" && <AddressInputDevelopment></AddressInputDevelopment>}
			{component == "inputs-array" && <ArrayInputDevelopment></ArrayInputDevelopment>}
			{component == "inputs-object-array" && <ObjectArrayInputDevelopment></ObjectArrayInputDevelopment>}
			{component == "inputs-json-schema" && <JsonSchemaEditorDevelopment></JsonSchemaEditorDevelopment>}
			{component == "inputs-checkbox" && <CheckboxInputDevelopment></CheckboxInputDevelopment>}
			{component == "inputs-date" && <DateInputDevelopment></DateInputDevelopment>}
			{component == "inputs-dropdown" && <DropdownInputDevelopment></DropdownInputDevelopment>}
			{component == "inputs-emoji" && <EmojiInputDevelopment></EmojiInputDevelopment>}
			{component == "inputs-phone" && <PhoneInputDevelopment></PhoneInputDevelopment>}
			{component == "inputs-phrase" && <PhraseInputDevelopment></PhraseInputDevelopment>}
			{component == "inputs-tags" && <TagInputDevelopment></TagInputDevelopment>}
			{component == "inputs-passport-tags" && <PassportTagInputDevelopment></PassportTagInputDevelopment>}
			{component == "inputs-general" && <GeneralInputDevelopment></GeneralInputDevelopment>}
			{component == "inputs-text-area" && <TextAreaDevelopment></TextAreaDevelopment>}
			{component == "inputs-toggle" && <ToggleInputDevelopment></ToggleInputDevelopment>}
			{component == "accordion" && <AccordionDevelopment></AccordionDevelopment>}
			{component == "text-decoration-badge" && <BadgeDevelopment></BadgeDevelopment>}
			{component == "text-decoration-compound-badge" && <CompoundBadgeDevelopment></CompoundBadgeDevelopment>}
			{component == "text-decoration-code-block" && <CodeBlockDevelopment></CodeBlockDevelopment>}
			{component == "text-decoration-currency" && <CurrencyDevelopment></CurrencyDevelopment>}
			{component == "text-decoration-dates" && <DatesDevelopment></DatesDevelopment>}
			{component == "text-decoration-description" && <DescriptionDevelopment></DescriptionDevelopment>}
			{component == "text-decoration-dotified-text" && <DotifiedTextDevelopment></DotifiedTextDevelopment>}
			{component == "text-decoration-email-link" && <EmailLinkDevelopment></EmailLinkDevelopment>}
			{component == "text-decoration-form-heading" && <FormHeadingDevelopment></FormHeadingDevelopment>}
			{component == "text-decoration-general-heading" && <GeneralHeadingDevelopment></GeneralHeadingDevelopment>}
			{component == "text-decoration-json-object" && <JsonObjectTextDevelopment></JsonObjectTextDevelopment>}
			{component == "text-decoration-number-text" && <NumberTextDevelopment></NumberTextDevelopment>}
			{component == "text-decoration-number-units" && <NumberUnitsDevelopment></NumberUnitsDevelopment>}
			{component == "text-decoration-page-heading" && <PageHeadingDevelopment></PageHeadingDevelopment>}
			{component == "text-decoration-paragraph" && <ParagraphDevelopment></ParagraphDevelopment>}
			{component == "text-decoration-percentage" && <PercentageDevelopment></PercentageDevelopment>}
			{component == "text-decoration-copyable-text" && <CopyableTextDevelopment></CopyableTextDevelopment>}
			{component == "text-decoration-properties-display" && <PropertiesDisplayDevelopment></PropertiesDisplayDevelopment>}
			{component == "text-decoration-property-histogram" && <PropertyHistogramDevelopment></PropertyHistogramDevelopment>}
			{component == "text-decoration-render-html" && <RenderHtmlDevelopment></RenderHtmlDevelopment>}
			{component == "text-decoration-compound-tag" && <CompoundTagDevelopment></CompoundTagDevelopment>}
			{component == "text-decoration-tag" && <TagDevelopment></TagDevelopment>}
			{component == "text-decoration-telephone" && <TelephoneTextDevelopment></TelephoneTextDevelopment>}
			{component == "text-decoration-truncated-text" && <TruncatedTextDevelopment></TruncatedTextDevelopment>}
			{component == "text-decoration-markdown" && <MarkdownTextDevelopment></MarkdownTextDevelopment>}
			{component == "inputs-copy" && <CopyInputDevelopment></CopyInputDevelopment>}
            {component == "inputs-search" && <SearchInputDevelopment></SearchInputDevelopment>}
			{component == "alerts-toaster" && <ToasterDevelopment></ToasterDevelopment>}
			{component == "alerts-in-line" && <InLineAlertsDevelopment></InLineAlertsDevelopment>}
			{component == "avatar" && <AvatarDevelopment></AvatarDevelopment>}
			{component == "inputs-file" && <FileInputDevelopment></FileInputDevelopment>}
			{component == "inputs-file-upload-table" && <FileUploadTableDevelopment></FileUploadTableDevelopment>}
			{component == "inputs-help" && <HelpTooltipDevelopment></HelpTooltipDevelopment>}
			{component == "table-objects" && <ObjectTableDevelopment></ObjectTableDevelopment>}
			{component == "card" && <CardDevelopment></CardDevelopment>}
			{component == "carousel" && <CarouselDevelopment></CarouselDevelopment>}
			{component == "command" && <CommandDevelopment></CommandDevelopment>}
			{component == "empty" && <EmptyDevelopment></EmptyDevelopment>}
			{component == "menubar" && <MenubarDevelopment></MenubarDevelopment>}
			{component == "navigation-menu" && <NavigationMenuDevelopment></NavigationMenuDevelopment>}
			{component == "pagination" && <PaginationDevelopment></PaginationDevelopment>}
			{component == "panel" && <PanelDevelopment></PanelDevelopment>}
			{component == "spinner" && <SpinnerDevelopment></SpinnerDevelopment>}
			{component == "inputs-slider" && <SliderDevelopment></SliderDevelopment>}
			{component == "inputs-otp" && <OTPInputDevelopment></OTPInputDevelopment>}
			{component == "text-decoration-kbd" && <KbdDevelopment></KbdDevelopment>}
			{component == "text-decoration-icon-text" && <IconTextDevelopment></IconTextDevelopment>}
			{component == "layouts-separator" && <SeparatorDevelopment></SeparatorDevelopment>}
			{component == "layouts-button-tabs" && <ButtonTabsDevelopment></ButtonTabsDevelopment>}
			{component == "filter-pills" && <FilterPillsDevelopment></FilterPillsDevelopment>}
			{component == "tooltips-hover-card" && <HoverCardDevelopment></HoverCardDevelopment>}
			{component == "stepper" && <StepperDevelopment></StepperDevelopment>}
			{component == "questionnaire" && <QuestionnaireDevelopment></QuestionnaireDevelopment>}
			{component == "timeline" && <TimelineDevelopment></TimelineDevelopment>}
			{component == "wizard" && <WizardDevelopment></WizardDevelopment>}
		</SidebarPage>
	)
}