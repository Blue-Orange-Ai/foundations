import React, {useState} from "react";

import './CopyableTextDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {CopyableText} from "../../../../components/text-decorations/copyable-text/CopyableText";
import {ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../../../components/alerts/toast/toaster/Toaster";
import {Badge} from "../../../../components/text-decorations/badge/Badge";

interface Props {
}

export const CopyableTextDevelopment: React.FC<Props> = ({}) => {

	const [lastCopied, setLastCopied] = useState<string>("");

	return (
		<PaddedPage>
			<PageHeading>Copyable Text</PageHeading>
			<Description>Text that copies itself to the clipboard when clicked. Shows a tick confirmation and,
				optionally, a toast.</Description>

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
		</PaddedPage>
	)
}
