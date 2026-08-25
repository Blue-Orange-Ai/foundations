import React, {useState} from "react";

import './CopyableTextDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {CopyableText} from "../../../../components/text-decorations/copyable-text/CopyableText";
import {ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../../../components/alerts/toast/toaster/Toaster";
import {Badge} from "../../../../components/text-decorations/badge/Badge";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const COPYABLE_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		control: "text",
		value: "ada@blueorange.ai",
		hideFromSnippet: true,
		description: "What is shown. Optional when iconOnly is set and copyValue supplies the clipboard value."
	},
	{
		name: "copyValue",
		type: "string",
		control: "text",
		description: "Text placed on the clipboard. It falls back to the children when those are a plain string or number."
	},
	{
		name: "toast",
		type: "boolean | CopyToastOptions",
		default: "false",
		control: "toggle",
		description: "Raises a toast on a successful copy. True takes the defaults; an object overrides them."
	},
	{
		name: "confirmationTime",
		type: "number",
		default: "1500",
		control: "number",
		description: "Milliseconds the tick stands in for the copy icon after a copy."
	},
	{
		name: "showIcon",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the copy icon beside the text."
	},
	{
		name: "iconOnHover",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Holds the copy icon back until the text is hovered."
	},
	{
		name: "iconOnly",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Renders the icon on its own. The children — or copyValue — still supply what is copied."
	},
	{
		name: "title",
		type: "string",
		default: "\"Click to copy\"",
		control: "text",
		description: "The hover title on the copy target."
	},
	{
		name: "onCopy",
		type: "(value: string) => void",
		description: "Fires with whatever was put on the clipboard."
	},
	{
		name: "onError",
		type: "(error: unknown) => void",
		description: "Fires when the clipboard write is refused — an insecure origin, or a denied permission."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the wrapper."
	}
];

interface Props {
}

export const CopyableTextDevelopment: React.FC<Props> = ({}) => {

	const [lastCopied, setLastCopied] = useState<string>("");

	return (
		<ComponentDoc
			title="Copyable Text"
			description="Text that puts itself on the clipboard when it is clicked — an email address, an identifier, a key. It shows a tick where the copy icon was, and can raise a toast as well."
			name="CopyableText"
			previewHeight={140}
			snippetChildren={values => values.children}
			props={COPYABLE_TEXT_PROPS}
			preview={values => (
				<CopyableText
					copyValue={values.copyValue}
					toast={values.toast}
					confirmationTime={values.confirmationTime}
					showIcon={values.showIcon}
					iconOnHover={values.iconOnHover}
					iconOnly={values.iconOnly}
					title={values.title}>
					{values.children}
				</CopyableText>
			)}>

			<GeneralHeading>Default</GeneralHeading>
			<CopyableText onCopy={setLastCopied}>ada@blueorange.ai</CopyableText>

			<GeneralHeading>With Toast</GeneralHeading>
			<CopyableText toast={true} onCopy={setLastCopied}>Copy me and watch the bottom right</CopyableText>

			<GeneralHeading>Custom Toast</GeneralHeading>
			<CopyableText
				toast={{
					location: ToastLocation.CENTRE_TOP,
					heading: "API key copied",
					description: "Keep it somewhere safe.",
					toastType: ToasterType.WARNING,
					ttl: 3000
				}}
				onCopy={setLastCopied}
			>sk-live-2f9a7c41d8e0</CopyableText>

			<GeneralHeading>Separate Copy Value</GeneralHeading>
			<Description>The rendered text and the clipboard value can differ.</Description>
			<CopyableText copyValue="0d5f8b12-4c3a-4f7e-9a11-77b6c0d2e4a9" toast={true} onCopy={setLastCopied}>
				0d5f8b12...e4a9
			</CopyableText>

			<GeneralHeading>Icon On Hover</GeneralHeading>
			<CopyableText iconOnHover={true} toast={true} onCopy={setLastCopied}>Hover to reveal the copy icon</CopyableText>

			<GeneralHeading>Icon Only</GeneralHeading>
			<Description>Renders just the copy icon. The value comes from children or copyValue, neither of which
				is displayed.</Description>
			<div style={{display: "flex", alignItems: "center", gap: "6px"}}>
				<span>0d5f8b12-4c3a-4f7e-9a11-77b6c0d2e4a9</span>
				<CopyableText
					iconOnly={true}
					copyValue="0d5f8b12-4c3a-4f7e-9a11-77b6c0d2e4a9"
					toast={true}
					title="Copy record ID"
					onCopy={setLastCopied}
				></CopyableText>
			</div>

			<GeneralHeading>No Icon</GeneralHeading>
			<CopyableText showIcon={false} toast={true} onCopy={setLastCopied}>No icon, still copies</CopyableText>

			<GeneralHeading>Wrapping A Node</GeneralHeading>
			<Description>Non text children need an explicit copyValue.</Description>
			<CopyableText copyValue="ACTIVE" toast={true} onCopy={setLastCopied}>
				<Badge>ACTIVE</Badge>
			</CopyableText>

			<GeneralHeading>Callback Output</GeneralHeading>
			<div className="copyable-text-development-callback">
				{lastCopied ? `Copied: ${lastCopied}` : "Nothing copied yet."}
			</div>
		</ComponentDoc>
	)
}
