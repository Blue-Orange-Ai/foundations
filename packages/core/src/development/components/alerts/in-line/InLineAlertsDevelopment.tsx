import React from "react";

import './InLineAlertsDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {DefaultBlockAlert} from "../../../../components/alerts/in-line-block/defaultalert/DefaultBlockAlert";
import {SuccessBlockAlert} from "../../../../components/alerts/in-line-block/successalert/SuccessBlockAlert";
import {WarningBlockAlert} from "../../../../components/alerts/in-line-block/warningalert/WarningBlockAlert";
import {ErrorBlockAlert} from "../../../../components/alerts/in-line-block/erroralert/ErrorBlockAlert";
import {InfoBlockAlert} from "../../../../components/alerts/in-line-block/infoalert/InfoBlockAlert";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const DEFAULT_ALERT_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		default: "\"ri-lightbulb-fill\"",
		control: "text",
		description: "A remixicon class shown on the left."
	},
	{
		name: "className",
		type: "string",
		control: "text",
		description: "Extra class names, which is how the named alerts get their colour."
	},
	{
		name: "title",
		type: "string",
		control: "text",
		value: "Two sites are reporting late",
		description: "The bold first line. Left off, the description stands on its own and is laid out for it."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "Their last known figures are being carried forward until they report again.",
		description: "The body of the alert."
	},
	{
		name: "action",
		type: "ReactNode",
		description: "A control pinned to the right of the alert — usually the thing that resolves it."
	}
];

const NAMED_ALERT_PROPS: Array<PropSpec> = [
	{
		name: "title",
		type: "string",
		control: "text",
		value: "Two sites are reporting late",
		description: "The bold first line."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "Their last known figures are being carried forward until they report again.",
		description: "The body of the alert."
	},
	{
		name: "action",
		type: "ReactNode",
		description: "A control pinned to the right of the alert."
	}
];

interface Props {
}

export const InLineAlertsDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="In Line Alerts"
			description="A block of text set apart from the page — a note, a warning, the reason something failed. DefaultBlockAlert is the one that takes its own icon and class; the four named alerts are it with the icon and treatment already chosen."
			name="DefaultBlockAlert"
			previewHeight={160}
			previewCentered={false}
			props={DEFAULT_ALERT_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<DefaultBlockAlert
						icon={values.icon}
						title={values.title}
						description={values.description}
						className={values.className}></DefaultBlockAlert>
				</div>
			)}
			siblings={[
				{
					name: "InfoBlockAlert",
					description: "The neutral note — the default treatment with the lightbulb.",
					props: NAMED_ALERT_PROPS,
					previewHeight: 150,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<InfoBlockAlert title={values.title} description={values.description}></InfoBlockAlert>
						</div>
					)
				},
				{
					name: "SuccessBlockAlert",
					description: "Something worked. Green, with a tick.",
					props: NAMED_ALERT_PROPS,
					previewHeight: 150,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<SuccessBlockAlert title={values.title} description={values.description}></SuccessBlockAlert>
						</div>
					)
				},
				{
					name: "WarningBlockAlert",
					description: "Something to be careful of. Amber, with the alarm glyph.",
					props: NAMED_ALERT_PROPS,
					previewHeight: 150,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<WarningBlockAlert title={values.title} description={values.description}></WarningBlockAlert>
						</div>
					)
				},
				{
					name: "ErrorBlockAlert",
					description: "Something failed. Red, with the alert glyph.",
					props: NAMED_ALERT_PROPS,
					previewHeight: 150,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<ErrorBlockAlert title={values.title} description={values.description}></ErrorBlockAlert>
						</div>
					)
				}
			]}>


			{/* ── 1. Variants ───────────────────────────────────────────── */}
			<section className="blue-orange-in-line-alerts-development-section">
				<GeneralHeading>1. Variants</GeneralHeading>
				<div className="blue-orange-in-line-alerts-development">
					<DefaultBlockAlert title={"Default Alert"} description={"This is a default inline alert"}></DefaultBlockAlert>
					<InfoBlockAlert title={"Info Alert"} description={"This is an info inline alert"}></InfoBlockAlert>
					<SuccessBlockAlert title={"Success Alert"} description={"This is a success inline alert"}></SuccessBlockAlert>
					<WarningBlockAlert title={"Warning Alert"} description={"This is a warning inline alert"}></WarningBlockAlert>
					<ErrorBlockAlert title={"Error Alert"} description={"This is an error inline alert"}></ErrorBlockAlert>
				</div>
			</section>

			{/* ── 2. Title only ─────────────────────────────────────────── */}
			<section className="blue-orange-in-line-alerts-development-section">
				<GeneralHeading>2. Title only (no description)</GeneralHeading>
				<div className="blue-orange-in-line-alerts-development">
					<DefaultBlockAlert title={"A compact alert with just a title"}></DefaultBlockAlert>
					<SuccessBlockAlert title={"Saved successfully"}></SuccessBlockAlert>
					<ErrorBlockAlert title={"Something went wrong"}></ErrorBlockAlert>
				</div>
			</section>

			{/* ── 3. Description only ────────────────────────────────────── */}
			<section className="blue-orange-in-line-alerts-development-section">
				<GeneralHeading>3. Description only (no title)</GeneralHeading>
				<p className="blue-orange-in-line-alerts-development-note">
					Omit the <code>title</code> to render a compact, single-line alert with just the
					description.
				</p>
				<div className="blue-orange-in-line-alerts-development">
					<DefaultBlockAlert description={"A description-only default alert."}></DefaultBlockAlert>
					<InfoBlockAlert description={"A description-only info alert."}></InfoBlockAlert>
					<SuccessBlockAlert description={"A description-only success alert."}></SuccessBlockAlert>
					<WarningBlockAlert description={"A description-only warning alert."}></WarningBlockAlert>
					<ErrorBlockAlert description={"A description-only error alert."}></ErrorBlockAlert>
				</div>
			</section>

			{/* ── 4. With an action ─────────────────────────────────────── */}
			<section className="blue-orange-in-line-alerts-development-section">
				<GeneralHeading>4. With an action</GeneralHeading>
				<p className="blue-orange-in-line-alerts-development-note">
					Just like the toaster, any alert can render an <code>action</code> node on the
					trailing edge.
				</p>
				<div className="blue-orange-in-line-alerts-development">
					<WarningBlockAlert
						title={"Unsaved changes"}
						description={"You have changes that haven't been saved yet."}
						action={<Button text={"Save"} buttonType={ButtonType.WARNING}></Button>}
					></WarningBlockAlert>
					<ErrorBlockAlert
						title={"Payment failed"}
						description={"We couldn't process your card."}
						action={<Button text={"Retry"} buttonType={ButtonType.DANGER}></Button>}
					></ErrorBlockAlert>
					<InfoBlockAlert
						title={"New version available"}
						description={"Reload to get the latest updates."}
						action={<Button text={"Reload"} buttonType={ButtonType.SECONDARY}></Button>}
					></InfoBlockAlert>
				</div>
			</section>

			{/* ── 5. Custom icon ────────────────────────────────────────── */}
			<section className="blue-orange-in-line-alerts-development-section">
				<GeneralHeading>5. Custom icon</GeneralHeading>
				<p className="blue-orange-in-line-alerts-development-note">
					The base <code>DefaultBlockAlert</code> accepts an <code>icon</code> class name to
					override the default lightbulb icon.
				</p>
				<div className="blue-orange-in-line-alerts-development">
					<DefaultBlockAlert
						icon={"ri-rocket-2-fill"}
						title={"Custom icon"}
						description={"This alert uses a rocket icon instead of the default."}
					></DefaultBlockAlert>
				</div>
			</section>
		</ComponentDoc>
	)
}
