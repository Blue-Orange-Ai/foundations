import React, {useState} from "react";

import './ButtonDevelopment.css'
import {Paragraph} from "../../../components/text-decorations/paragraph/Paragraph";
import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {ButtonIcon} from "../../../components/buttons/button-icon/ButtonIcon";
import {ButtonIconDropdown} from "../../../components/buttons/button-icon-dropdown/ButtonIconDropdown";
import {FileUploadBtn} from "../../../components/buttons/file-upload-btn/FileUploadBtn";
import {ButtonDropdown} from "../../../components/buttons/button-dropdown/ButtonDropdown";
import {ButtonToggle, IButtonToggleOption} from "../../../components/buttons/button-toggle/ButtonToggle";
import {SuccessAnimation} from "../../../components/buttons/utils/successanimation/SuccessAnimation";
import {ErrorAnimation} from "../../../components/buttons/utils/erroranimation/ErrorAnimation";
import {DropdownItemIcon} from "../../../components/inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {DropdownItemText} from "../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {DropdownItemHeading} from "../../../components/inputs/dropdown/items/DropdownItemHeading/DropdownItemHeading";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {ComponentApiProps} from "../../framework/ComponentApi";
import {PropSpec} from "../../framework/PropSpec";

const BUTTON_TYPE_OPTIONS = [
	{label: "Primary", value: ButtonType.PRIMARY, code: "ButtonType.PRIMARY"},
	{label: "Secondary", value: ButtonType.SECONDARY, code: "ButtonType.SECONDARY"},
	{label: "Success", value: ButtonType.SUCCESS, code: "ButtonType.SUCCESS"},
	{label: "Warning", value: ButtonType.WARNING, code: "ButtonType.WARNING"},
	{label: "Danger", value: ButtonType.DANGER, code: "ButtonType.DANGER"},
	{label: "Clear", value: ButtonType.CLEAR, code: "ButtonType.CLEAR"},
	{label: "Custom", value: ButtonType.CUSTOM, code: "ButtonType.CUSTOM"}
];

const BUTTON_SIZE_OPTIONS = [
	{label: "Small", value: ButtonSize.SMALL, code: "ButtonSize.SMALL"},
	{label: "Medium", value: ButtonSize.MEDIUM, code: "ButtonSize.MEDIUM"},
	{label: "Large", value: ButtonSize.LARGE, code: "ButtonSize.LARGE"}
];

const ICON_POS_OPTIONS = [
	{label: "Left", value: ButtonIconPos.LEFT, code: "ButtonIconPos.LEFT"},
	{label: "Right", value: ButtonIconPos.RIGHT, code: "ButtonIconPos.RIGHT"}
];

/** The animation props read the same on Button and ButtonDropdown, so they are declared once. */
const resultProps = (): Array<PropSpec> => [
	{
		name: "isSuccess",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Replaces the label with a tick while it is on."
	},
	{
		name: "successClear",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Returns the button to its label once the tick has been shown."
	},
	{
		name: "successClearAnimationTime",
		type: "number",
		default: "3000",
		control: "number",
		description: "Milliseconds the tick is held for before the label comes back."
	},
	{
		name: "onSuccessAnimationComplete",
		type: "() => void",
		description: "Fires once the tick has finished playing."
	},
	{
		name: "isError",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Replaces the label with a cross while it is on."
	},
	{
		name: "errorClear",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Returns the button to its label once the cross has been shown."
	},
	{
		name: "errorClearAnimationTime",
		type: "number",
		default: "3000",
		control: "number",
		description: "Milliseconds the cross is held for before the label comes back."
	},
	{
		name: "onErrorAnimationComplete",
		type: "() => void",
		description: "Fires once the cross has finished playing."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the button element."
	}
];

const BUTTON_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "Save changes",
		description: "The label. It is replaced by the spinner while the button is loading."
	},
	{
		name: "buttonType",
		type: "ButtonType",
		required: true,
		control: "select",
		options: BUTTON_TYPE_OPTIONS,
		value: ButtonType.PRIMARY,
		description: "Which of the seven treatments the button wears. CUSTOM leaves it unstyled for `classes` to take over."
	},
	{
		name: "size",
		type: "ButtonSize",
		default: "ButtonSize.MEDIUM",
		defaultValue: ButtonSize.MEDIUM,
		control: "select",
		options: BUTTON_SIZE_OPTIONS,
		description: "Small, medium or large. The icon scales with it."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names, which is how a CUSTOM button gets its look."
	},
	{
		name: "tooltip",
		type: "string",
		control: "text",
		description: "Text shown on hover. Nothing is rendered when it is left off."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-save-line",
		description: "A remixicon class name, drawn beside the label."
	},
	{
		name: "iconPos",
		type: "ButtonIconPos",
		control: "select",
		options: ICON_POS_OPTIONS,
		value: ButtonIconPos.LEFT,
		description: "Which side of the label the icon sits on."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires on click, unless the button is disabled or loading."
	},
	{
		name: "isDisabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the button out and stops it responding."
	},
	{
		name: "isLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Swaps the label and icon for a spinner and ignores clicks."
	},
	...resultProps()
];

const BUTTON_ICON_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		required: true,
		control: "text",
		value: "ri-delete-bin-line",
		description: "The remixicon class name to draw."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Delete",
		description: "The tooltip, and what a screen reader announces the button as."
	},
	{
		name: "size",
		type: "ButtonSize",
		default: "ButtonSize.MEDIUM",
		defaultValue: ButtonSize.MEDIUM,
		control: "select",
		options: BUTTON_SIZE_OPTIONS,
		description: "Small, medium or large."
	},
	{
		name: "isDisabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the button out and stops it responding."
	},
	{
		name: "isLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Swaps the icon for a spinner and ignores clicks."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires on click, unless the button is disabled or loading."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the button element."
	},
	{
		name: "className",
		type: "string",
		control: "text",
		description: "Extra class names appended to the button's own."
	}
];

const DROPDOWN_ITEM_INTERFACE = {
	name: "Dropdown items",
	description: "The children of a dropdown button are the options it opens. Each one carries the reference that comes back from onSelection.",
	props: [
		{name: "label", type: "string", required: true, description: "What the row reads."},
		{name: "value", type: "string", required: true, description: "The reference handed to onSelection when the row is picked."},
		{name: "selected", type: "boolean", required: true, description: "Whether the row starts ticked."},
	] as Array<PropSpec>
};

const BUTTON_DROPDOWN_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
	},
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "Export",
		description: "The button's label."
	},
	{
		name: "buttonType",
		type: "ButtonType",
		required: true,
		control: "select",
		options: BUTTON_TYPE_OPTIONS,
		value: ButtonType.PRIMARY,
		description: "Which treatment the button wears, exactly as on Button."
	},
	{
		name: "size",
		type: "ButtonSize",
		default: "ButtonSize.MEDIUM",
		defaultValue: ButtonSize.MEDIUM,
		control: "select",
		options: BUTTON_SIZE_OPTIONS,
		description: "Small, medium or large."
	},
	{
		name: "tooltip",
		type: "string",
		control: "text",
		description: "Text shown on hover. It is suppressed while the popup is open."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class name drawn beside the label."
	},
	{
		name: "iconPos",
		type: "ButtonIconPos",
		control: "select",
		options: ICON_POS_OPTIONS,
		description: "Which side of the label the icon sits on."
	},
	{
		name: "filter",
		type: "boolean",
		default: "false",
		control: "toggle",
		value: true,
		description: "Puts a search box above the options."
	},
	{
		name: "allowMultiple",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets more than one option be ticked at a time."
	},
	{
		name: "contextWidth",
		type: "number | string",
		control: "text",
		value: "max-content",
		description: "Width of the popup. Left off it follows the width of the button."
	},
	{
		name: "onSelection",
		type: "(reference: string) => void",
		description: "Fires with the `value` of whichever row was picked."
	},
	{
		name: "isDisabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the button out and stops it opening."
	},
	{
		name: "isLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Swaps the label for a spinner and ignores clicks."
	},
	...resultProps()
];

const BUTTON_ICON_DROPDOWN_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The dropdown rows the icon opens."
	},
	{
		name: "icon",
		type: "string",
		required: true,
		control: "text",
		value: "ri-more-2-fill",
		description: "The remixicon class name to draw."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Actions",
		description: "The tooltip, which is hidden while the popup is open."
	},
	{
		name: "size",
		type: "ButtonSize",
		default: "ButtonSize.MEDIUM",
		defaultValue: ButtonSize.MEDIUM,
		control: "select",
		options: BUTTON_SIZE_OPTIONS,
		description: "Small, medium or large."
	},
	{
		name: "filter",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a search box above the options."
	},
	{
		name: "allowMultiple",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets more than one option be ticked at a time."
	},
	{
		name: "contextWidth",
		type: "number | string",
		default: "\"max-content\"",
		control: "text",
		description: "Width of the popup. It sizes to the option text rather than the icon button."
	},
	{
		name: "onSelection",
		type: "(reference: string) => void",
		description: "Fires with the `value` of whichever row was picked."
	},
	{
		name: "isDisabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the button out and stops it opening."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the button element."
	},
	{
		name: "className",
		type: "string",
		control: "text",
		description: "Extra class names appended to the button's own."
	}
];

const FILE_UPLOAD_PROPS: Array<PropSpec> = [
	{
		name: "accept",
		type: "string",
		required: true,
		control: "text",
		value: "image",
		description: "What the file picker will offer. `pdf`, `image` and `csv` are mapped to their mime types; anything else is passed straight through."
	},
	{
		name: "label",
		type: "string",
		default: "\"Upload File\"",
		control: "text",
		description: "The button's label."
	},
	{
		name: "icon",
		type: "boolean",
		default: "false",
		control: "toggle",
		value: true,
		description: "Draws the upload glyph beside the label."
	},
	{
		name: "size",
		type: "ButtonSize",
		default: "ButtonSize.MEDIUM",
		defaultValue: ButtonSize.MEDIUM,
		control: "select",
		options: BUTTON_SIZE_OPTIONS,
		description: "Small, medium or large."
	},
	{
		name: "isLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Swaps the label for a spinner and ignores clicks."
	},
	{
		name: "onFileSelect",
		type: "(value: File) => void",
		description: "Fires with the chosen file, once it has passed the size check."
	},
	{
		name: "maxFileMgb",
		type: "number",
		control: "number",
		description: "Largest file accepted, in megabytes. Anything bigger is rejected before onFileSelect."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the button element."
	}
];

const TOGGLE_OPTIONS: Array<IButtonToggleOption> = [
	{value: "list", label: "List", icon: "ri-list-check"},
	{value: "board", label: "Board", icon: "ri-layout-grid-line"},
	{value: "calendar", label: "Calendar", icon: "ri-calendar-line"}
];

const BUTTON_TOGGLE_PROPS: Array<PropSpec> = [
	{
		name: "options",
		type: "Array<IButtonToggleOption>",
		required: true,
		description: "One entry per segment, in the order they are shown."
	},
	{
		name: "value",
		type: "string",
		required: true,
		control: "select",
		options: TOGGLE_OPTIONS.map(option => ({label: option.label, value: option.value})),
		value: "list",
		description: "The `value` of the segment that is currently active."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		required: true,
		description: "Fires with the `value` of the segment that was clicked. Clicking the active segment does nothing."
	},
	{
		name: "size",
		type: "ButtonSize",
		default: "ButtonSize.MEDIUM",
		defaultValue: ButtonSize.MEDIUM,
		control: "select",
		options: BUTTON_SIZE_OPTIONS,
		description: "Small, medium or large."
	},
	{
		name: "isDisabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the whole group out and stops it responding."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the group element."
	}
];

const dropdownSnippetChildren = (): string =>
	"<DropdownItemHeading label={\"Actions\"} value={\"heading\"} selected={false}></DropdownItemHeading>\n"
	+ "<DropdownItemText label={\"Edit\"} value={\"edit\"} selected={false}></DropdownItemText>\n"
	+ "<DropdownItemIcon src={\"ri-delete-bin-line\"} label={\"Delete\"} value={\"delete\"} selected={false}></DropdownItemIcon>";

const demoDropdownItems = (
	<>
		<DropdownItemHeading label={"Actions"} value={"heading"} selected={false}></DropdownItemHeading>
		<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
		<DropdownItemText label={"Duplicate"} value={"duplicate"} selected={false}></DropdownItemText>
		<DropdownItemIcon src={"ri-delete-bin-line"} label={"Delete"} value={"delete"} selected={false}></DropdownItemIcon>
	</>
);

const SIBLINGS: Array<ComponentApiProps> = [
	{
		name: "ButtonIcon",
		description: "A button that is only its icon. The label becomes the tooltip and the accessible name, so it is never optional in practice.",
		props: BUTTON_ICON_PROPS,
		previewHeight: 140,
		preview: values => (
			<ButtonIcon
				icon={values.icon}
				label={values.label}
				size={values.size}
				isDisabled={values.isDisabled}
				isLoading={values.isLoading}
				className={values.className}
				onClick={() => {}}
			></ButtonIcon>
		)
	},
	{
		name: "ButtonDropdown",
		description: "A Button that opens a list instead of firing an action. It carries the same treatments, sizes and result animations, and its children are the options.",
		props: BUTTON_DROPDOWN_PROPS,
		imports: ["DropdownItemHeading", "DropdownItemText", "DropdownItemIcon"],
		interfaces: [DROPDOWN_ITEM_INTERFACE],
		previewHeight: 160,
		snippetChildren: dropdownSnippetChildren,
		preview: values => (
			<ButtonDropdown
				text={values.text}
				buttonType={values.buttonType}
				size={values.size}
				tooltip={values.tooltip}
				icon={values.icon}
				iconPos={values.iconPos}
				filter={values.filter}
				allowMultiple={values.allowMultiple}
				contextWidth={values.contextWidth}
				isDisabled={values.isDisabled}
				isLoading={values.isLoading}
				isSuccess={values.isSuccess}
				isError={values.isError}
				successClear={values.successClear}
				errorClear={values.errorClear}>
				{demoDropdownItems}
			</ButtonDropdown>
		)
	},
	{
		name: "ButtonIconDropdown",
		description: "The icon-only button with a list behind it — the overflow menu at the end of a row or a card.",
		props: BUTTON_ICON_DROPDOWN_PROPS,
		imports: ["DropdownItemHeading", "DropdownItemText", "DropdownItemIcon"],
		interfaces: [DROPDOWN_ITEM_INTERFACE],
		previewHeight: 160,
		snippetChildren: dropdownSnippetChildren,
		preview: values => (
			<ButtonIconDropdown
				icon={values.icon}
				label={values.label}
				size={values.size}
				filter={values.filter}
				allowMultiple={values.allowMultiple}
				contextWidth={values.contextWidth}
				isDisabled={values.isDisabled}
				className={values.className}>
				{demoDropdownItems}
			</ButtonIconDropdown>
		)
	},
	{
		name: "FileUploadBtn",
		description: "A button wrapped around a hidden file input, so picking a file looks like any other action in the interface.",
		props: FILE_UPLOAD_PROPS,
		previewHeight: 140,
		preview: values => (
			<FileUploadBtn
				accept={values.accept}
				label={values.label}
				icon={values.icon}
				size={values.size}
				isLoading={values.isLoading}
				maxFileMgb={values.maxFileMgb}
			></FileUploadBtn>
		)
	},
	{
		name: "ButtonToggle",
		description: "A segmented control for a choice between a handful of views. It is a controlled component — the active segment is whatever `value` names.",
		props: BUTTON_TOGGLE_PROPS,
		imports: ["IButtonToggleOption"],
		previewHeight: 140,
		preview: values => (
			<ButtonToggle
				options={TOGGLE_OPTIONS}
				value={values.value}
				size={values.size}
				isDisabled={values.isDisabled}
				onChange={() => {}}
			></ButtonToggle>
		)
	}
];

interface Props {
}

export const ButtonDevelopment: React.FC<Props> = ({}) => {

	const [toggleValue, setToggleValue] = useState<string>("list");

	// Each demo button below holds its own key in here, so several can be
	// spinning at once and each one clears on its own timer.
	const [loading, setLoading] = useState<Record<string, boolean>>({});

	const runLoading = (key: string, duration: number = 2500) => {
		setLoading(current => ({...current, [key]: true}));
		setTimeout(() => {
			setLoading(current => ({...current, [key]: false}));
		}, duration);
	};

	return (
		<ComponentDoc
			title="Buttons"
			description={
				<>
					Everything in the library that is clicked to do something: the button itself, its
					icon-only form, the two that open a dropdown instead of firing, the one that opens
					a file picker, and the segmented control. They share a set of treatments, three
					sizes, and the loading and result states that report what happened.
				</>
			}
			name="Button"
			props={BUTTON_PROPS}
			previewHeight={160}
			siblings={SIBLINGS}
			preview={values => (
				<Button
					text={values.text}
					buttonType={values.buttonType}
					size={values.size}
					classes={values.classes}
					tooltip={values.tooltip}
					icon={values.icon}
					iconPos={values.iconPos}
					isDisabled={values.isDisabled}
					isLoading={values.isLoading}
					isSuccess={values.isSuccess}
					isError={values.isError}
					successClear={values.successClear}
					successClearAnimationTime={values.successClearAnimationTime}
					errorClear={values.errorClear}
					errorClearAnimationTime={values.errorClearAnimationTime}
					onClick={() => {}}
				></Button>
			)}>

			<h3 className="blue-orange-docs-subheading">Loading state</h3>
			<Paragraph>
				Click any button in this section to put it into its loading state — the label and icon are replaced by a
				spinner, and clicks are ignored until it clears. Each one resets itself after 2.5 seconds.
			</Paragraph>
			<h4>Regular buttons</h4>
			<div className={"button-development-row"}>
				<Button text={"Primary"} buttonType={ButtonType.PRIMARY}
						isLoading={loading["primary"]} onClick={() => runLoading("primary")}></Button>
				<Button text={"Secondary"} buttonType={ButtonType.SECONDARY}
						isLoading={loading["secondary"]} onClick={() => runLoading("secondary")}></Button>
				<Button text={"Success"} buttonType={ButtonType.SUCCESS}
						isLoading={loading["success"]} onClick={() => runLoading("success")}></Button>
				<Button text={"Warning"} buttonType={ButtonType.WARNING}
						isLoading={loading["warning"]} onClick={() => runLoading("warning")}></Button>
				<Button text={"Danger"} buttonType={ButtonType.DANGER}
						isLoading={loading["danger"]} onClick={() => runLoading("danger")}></Button>
				<Button text={"Clear"} buttonType={ButtonType.CLEAR}
						isLoading={loading["clear"]} onClick={() => runLoading("clear")}></Button>
			</div>
			<h4>Regular buttons at each size</h4>
			<div className={"button-development-row"}>
				<Button text={"Small"} buttonType={ButtonType.PRIMARY} size={ButtonSize.SMALL}
						isLoading={loading["size-sm"]} onClick={() => runLoading("size-sm")}></Button>
				<Button text={"Medium"} buttonType={ButtonType.PRIMARY} size={ButtonSize.MEDIUM}
						isLoading={loading["size-md"]} onClick={() => runLoading("size-md")}></Button>
				<Button text={"Large"} buttonType={ButtonType.PRIMARY} size={ButtonSize.LARGE}
						isLoading={loading["size-lg"]} onClick={() => runLoading("size-lg")}></Button>
			</div>
			<h4>Regular buttons with an icon</h4>
			<div className={"button-development-row"}>
				<Button text={"Save"} buttonType={ButtonType.PRIMARY} icon={"ri-save-line"} iconPos={ButtonIconPos.LEFT}
						isLoading={loading["icon-left"]} onClick={() => runLoading("icon-left")}></Button>
				<Button text={"Upload"} buttonType={ButtonType.SECONDARY} icon={"ri-upload-2-line"} iconPos={ButtonIconPos.RIGHT}
						isLoading={loading["icon-right"]} onClick={() => runLoading("icon-right")}></Button>
				<Button text={"Sync"} buttonType={ButtonType.SUCCESS} icon={"ri-refresh-line"} iconPos={ButtonIconPos.LEFT}
						isLoading={loading["icon-sync"]} onClick={() => runLoading("icon-sync")}></Button>
				<Button text={"Delete"} buttonType={ButtonType.DANGER} icon={"ri-delete-bin-line"} iconPos={ButtonIconPos.LEFT}
						isLoading={loading["icon-delete"]} onClick={() => runLoading("icon-delete")}></Button>
			</div>
			<h4>Icon only buttons</h4>
			<div className={"button-development-row"}>
				<ButtonIcon icon={"ri-save-line"} label={"Save"}
							isLoading={loading["only-save"]} onClick={() => runLoading("only-save")}></ButtonIcon>
				<ButtonIcon icon={"ri-refresh-line"} label={"Sync"}
							isLoading={loading["only-sync"]} onClick={() => runLoading("only-sync")}></ButtonIcon>
				<ButtonIcon icon={"ri-delete-bin-line"} label={"Delete"}
							isLoading={loading["only-delete"]} onClick={() => runLoading("only-delete")}></ButtonIcon>
			</div>
			<h4>Icon only buttons at each size</h4>
			<div className={"button-development-row"}>
				<ButtonIcon icon={"ri-planet-fill"} label={"Small"} size={ButtonSize.SMALL}
							isLoading={loading["only-sm"]} onClick={() => runLoading("only-sm")}></ButtonIcon>
				<ButtonIcon icon={"ri-planet-fill"} label={"Medium"} size={ButtonSize.MEDIUM}
							isLoading={loading["only-md"]} onClick={() => runLoading("only-md")}></ButtonIcon>
				<ButtonIcon icon={"ri-planet-fill"} label={"Large"} size={ButtonSize.LARGE}
							isLoading={loading["only-lg"]} onClick={() => runLoading("only-lg")}></ButtonIcon>
			</div>
			<h4>All at once</h4>
			<Paragraph>Starts every button in this section together, so the spinners can be compared side by side.</Paragraph>
			<div className={"button-development-row"}>
				<Button text={"Run all"} buttonType={ButtonType.PRIMARY} icon={"ri-play-line"} iconPos={ButtonIconPos.LEFT}
						onClick={() => {
							[
								"primary", "secondary", "success", "warning", "danger", "clear",
								"size-sm", "size-md", "size-lg",
								"icon-left", "icon-right", "icon-sync", "icon-delete",
								"only-save", "only-sync", "only-delete",
								"only-sm", "only-md", "only-lg",
							].forEach(key => runLoading(key, 4000));
						}}></Button>
			</div>

			<h3 className="blue-orange-docs-subheading">Every treatment</h3>
			<div className={"button-development-row"}>
				<Button text={"Primary"} buttonType={ButtonType.PRIMARY}></Button>
				<Button text={"Secondary"} buttonType={ButtonType.SECONDARY}></Button>
				<Button text={"Success"} buttonType={ButtonType.SUCCESS}></Button>
				<Button text={"Warning"} buttonType={ButtonType.WARNING}></Button>
				<Button text={"Danger"} buttonType={ButtonType.DANGER}></Button>
				<Button text={"Clear"} buttonType={ButtonType.CLEAR}></Button>
				<Button text={"Custom"} buttonType={ButtonType.CUSTOM}></Button>
			</div>

			<h3 className="blue-orange-docs-subheading">Sizes</h3>
			<div className={"button-development-row"}>
				<Button text={"Small"} buttonType={ButtonType.PRIMARY} size={ButtonSize.SMALL}></Button>
				<Button text={"Medium (default)"} buttonType={ButtonType.PRIMARY} size={ButtonSize.MEDIUM}></Button>
				<Button text={"Large"} buttonType={ButtonType.PRIMARY} size={ButtonSize.LARGE}></Button>
			</div>
			<div className={"button-development-row"}>
				<Button text={"Small"} buttonType={ButtonType.SECONDARY} size={ButtonSize.SMALL} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
				<Button text={"Medium"} buttonType={ButtonType.SECONDARY} size={ButtonSize.MEDIUM} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
				<Button text={"Large"} buttonType={ButtonType.SECONDARY} size={ButtonSize.LARGE} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
			</div>

			<h3 className="blue-orange-docs-subheading">Custom classes</h3>
			<Paragraph>
				A CUSTOM button brings no treatment of its own, so whatever `classes` names is the
				whole of its look.
			</Paragraph>
			<div className={"button-development-row"}>
				<Button text={"Custom Class Button"} buttonType={ButtonType.CUSTOM} classes={"button-development-custom-class"}></Button>
				<Button text={"Custom Class Large"} buttonType={ButtonType.CUSTOM} size={ButtonSize.LARGE} classes={"button-development-custom-class"}></Button>
			</div>

			<h3 className="blue-orange-docs-subheading">Icon position</h3>
			<div className={"button-development-row"}>
				<Button text={"Icon left"} buttonType={ButtonType.PRIMARY} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
				<Button text={"Icon right"} buttonType={ButtonType.PRIMARY} icon={"ri-planet-fill"} iconPos={ButtonIconPos.RIGHT}></Button>
				<ButtonIcon label={"Only icon"} icon={"ri-planet-fill"}></ButtonIcon>
			</div>
			<div className={"button-development-row"}>
				<ButtonIcon label={"Small"} icon={"ri-planet-fill"} size={ButtonSize.SMALL}></ButtonIcon>
				<ButtonIcon label={"Medium (default)"} icon={"ri-planet-fill"} size={ButtonSize.MEDIUM}></ButtonIcon>
				<ButtonIcon label={"Large"} icon={"ri-planet-fill"} size={ButtonSize.LARGE}></ButtonIcon>
			</div>

			<h3 className="blue-orange-docs-subheading">Dropdown buttons</h3>
			<div className={"button-development-row"}>
				<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Options"} filter={true}
									 onSelection={(ref) => console.log("selected", ref)}>
					<DropdownItemHeading label={"Actions"} value={"heading-1"} selected={false}></DropdownItemHeading>
					<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Duplicate"} value={"duplicate"} selected={false}></DropdownItemText>
					<DropdownItemIcon src={"ri-delete-bin-line"} label={"Delete"} value={"delete"} selected={false}></DropdownItemIcon>
				</ButtonIconDropdown>
				<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Small"} size={ButtonSize.SMALL}>
					<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Delete"} value={"delete"} selected={false}></DropdownItemText>
				</ButtonIconDropdown>
				<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Large"} size={ButtonSize.LARGE}>
					<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Delete"} value={"delete"} selected={false}></DropdownItemText>
				</ButtonIconDropdown>
			</div>
			<div className={"button-development-row"}>
				<ButtonDropdown text={"Primary Button"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY}>
					<DropdownItemHeading label={"Hello World"} value={"heading-1"} selected={false}></DropdownItemHeading>
					<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
					<DropdownItemIcon src={"ri-dribbble-line"} label={"Dribble"} value={"option-3"} selected={false}></DropdownItemIcon>
				</ButtonDropdown>
				<ButtonDropdown text={"Small"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY} size={ButtonSize.SMALL}>
					<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				</ButtonDropdown>
				<ButtonDropdown text={"Large"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY} size={ButtonSize.LARGE}>
					<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				</ButtonDropdown>
			</div>

			<h3 className="blue-orange-docs-subheading">File upload</h3>
			<div className={"button-development-row"}>
				<FileUploadBtn accept={"*"} label={"File Upload Button"} icon={true}></FileUploadBtn>
				<FileUploadBtn accept={"*"} label={"Small"} icon={true} size={ButtonSize.SMALL}></FileUploadBtn>
				<FileUploadBtn accept={"*"} label={"Large"} icon={true} size={ButtonSize.LARGE}></FileUploadBtn>
			</div>

			<h3 className="blue-orange-docs-subheading">Button toggle</h3>
			<div className={"button-development-row"}>
				<ButtonToggle options={TOGGLE_OPTIONS} value={toggleValue} onChange={setToggleValue}></ButtonToggle>
			</div>
			<div className={"button-development-row"}>
				<ButtonToggle options={TOGGLE_OPTIONS} value={toggleValue} onChange={setToggleValue}
							  size={ButtonSize.SMALL}></ButtonToggle>
				<ButtonToggle options={TOGGLE_OPTIONS} value={toggleValue} onChange={setToggleValue}
							  size={ButtonSize.LARGE}></ButtonToggle>
			</div>
			<div className={"button-development-row"}>
				<ButtonToggle options={TOGGLE_OPTIONS} value={toggleValue} onChange={setToggleValue}
							  isDisabled={true}></ButtonToggle>
			</div>

			<h3 className="blue-orange-docs-subheading">Result animations</h3>
			<div className={"button-development-row"}>
				<Button text={"Saved"} buttonType={ButtonType.SUCCESS} isSuccess={true}></Button>
				<Button text={"Failed"} buttonType={ButtonType.DANGER} isError={true}></Button>
				<div className={"button-development-animation"}><SuccessAnimation></SuccessAnimation></div>
				<div className={"button-development-animation"}><ErrorAnimation></ErrorAnimation></div>
			</div>
		</ComponentDoc>
	)
}
