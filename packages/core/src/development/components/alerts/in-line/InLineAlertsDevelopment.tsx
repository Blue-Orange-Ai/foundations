import React from "react";

import './InLineAlertsDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {DefaultBlockAlert} from "../../../../components/alerts/in-line-block/defaultalert/DefaultBlockAlert";
import {SuccessBlockAlert} from "../../../../components/alerts/in-line-block/successalert/SuccessBlockAlert";
import {WarningBlockAlert} from "../../../../components/alerts/in-line-block/warningalert/WarningBlockAlert";
import {ErrorBlockAlert} from "../../../../components/alerts/in-line-block/erroralert/ErrorBlockAlert";
import {InfoBlockAlert} from "../../../../components/alerts/in-line-block/infoalert/InfoBlockAlert";

interface Props {
}

export const InLineAlertsDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>In Line Alerts</PageHeading>

			<p className="blue-orange-in-line-alerts-development-intro">
				Inline block alerts share the <strong>same internal layout and colours as the toaster</strong> —
				an icon column, a text group (bold title + muted description) and an optional action —
				but they sit in normal document flow: <strong>no box shadow, no floating</strong>, full
				width. Default and info use a white background with a border equal to the text colour;
				success, warning and error use the tinted toaster background with a darker outline equal
				to the title colour. All five variants accept the same options: <code>title</code>,
				<code>description</code> and <code>action</code> — and <code>title</code> is optional,
				so any variant can be description-only.
			</p>

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
		</PaddedPage>
	)
}
