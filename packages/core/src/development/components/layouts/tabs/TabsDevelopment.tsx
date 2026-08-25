import React, {useState} from "react";

import './TabsDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {Tabs} from "../../../../components/layouts/tabs/tabs/Tabs";
import {Tab} from "../../../../components/layouts/tabs/tab/Tab";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {Badge} from "../../../../components/text-decorations/badge/Badge";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const TABS_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The Tab entries, in the order they sit in the header."
	},
	{
		name: "activeTab",
		type: "string",
		control: "text",
		description: "The uuid of the selected tab. Setting it moves the selection from the outside."
	},
	{
		name: "headerStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the header row."
	},
	{
		name: "headerActiveStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the active trigger."
	},
	{
		name: "headerInActiveStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the triggers that are not active."
	},
	{
		name: "onClick",
		type: "(uuid: string) => void",
		description: "Fires with the uuid of the tab that was selected."
	},
	{
		name: "persistInUrl",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Keeps the selected tab in the query string, so a reload or a shared link comes back to it."
	},
	{
		name: "urlParamName",
		type: "string",
		default: "\"tab\"",
		control: "text",
		description: "Which query parameter the selection is kept in."
	},
	{
		name: "collapseOverflow",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Moves the tabs that do not fit the header width into a more dropdown, instead of letting them wrap."
	},
	{
		name: "overflowLabel",
		type: "string",
		default: "\"More\"",
		control: "text",
		description: "What that dropdown reads."
	},
	{
		name: "overflowIcon",
		type: "string",
		default: "\"ri-arrow-down-s-line\"",
		control: "text",
		description: "The remixicon class on the dropdown."
	}
];

const TAB_PROPS: Array<PropSpec> = [
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
		value: "Overview",
		description: "What the trigger reads."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-dashboard-line",
		description: "A remixicon class shown before the name."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content shown while this tab is active. It is mounted only then."
	}
];

interface Props {
}

const USAGE = `<Tabs activeTab="overview" onClick={(uuid) => console.log(uuid)}>
    <Tab uuid="overview" name="Overview" icon="ri-dashboard-line">
        <p>Anything you like.</p>
    </Tab>
    <Tab uuid="activity" name="Activity" icon="ri-history-line">
        <p>Only the active tab's children are rendered.</p>
    </Tab>
</Tabs>

// persistInUrl writes the active tab into the query string so a
// refresh or a shared link lands on the same tab
<Tabs persistInUrl={true} urlParamName="section"> ... </Tabs>

// tabs that do not fit the header are collapsed into a dropdown,
// which follows the container as it is resized. Turn it off with
// collapseOverflow, or rename the button with overflowLabel
<Tabs collapseOverflow={false}> ... </Tabs>
<Tabs overflowLabel="Others" overflowIcon="ri-more-line"> ... </Tabs>`;

export const TabsDevelopment: React.FC<Props> = ({}) => {

	const [lastClicked, setLastClicked] = useState<string>("-");

	return (
		<ComponentDoc
			title="Tabs"
			description="Each Tab declares a uuid, a name and an optional icon, and holds the content shown while it is active. Tabs renders the header row itself, only mounts the active tab's children, and can move the tabs that do not fit into a more dropdown."
			name="Tabs"
			previewHeight={240}
			previewCentered={false}
			imports={["Tab"]}
			props={TABS_PROPS}
			snippetChildren={() => "<Tab uuid={\"overview\"} name={\"Overview\"} icon={\"ri-dashboard-line\"}>\n\t<p>The overview.</p>\n</Tab>\n<Tab uuid={\"activity\"} name={\"Activity\"} icon={\"ri-history-line\"}>\n\t<p>The activity feed.</p>\n</Tab>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Tabs
						collapseOverflow={values.collapseOverflow}
						overflowLabel={values.overflowLabel}
						overflowIcon={values.overflowIcon}
						persistInUrl={values.persistInUrl}
						urlParamName={values.urlParamName}
						onClick={() => {}}>
						<Tab uuid="overview" name="Overview" icon="ri-dashboard-line">
							<p>The overview.</p>
						</Tab>
						<Tab uuid="activity" name="Activity" icon="ri-history-line">
							<p>The activity feed.</p>
						</Tab>
						<Tab uuid="settings" name="Settings" icon="ri-settings-3-line">
							<p>The settings.</p>
						</Tab>
					</Tabs>
				</div>
			)}
			siblings={[
				{
					name: "Tab",
					description: "Declares one tab. It renders nothing itself — Tabs reads its props, and its children are mounted only while it is the active tab.",
					props: TAB_PROPS,
					previewHeight: 200,
					previewCentered: false,
					imports: ["Tabs"],
					snippetChildren: () => "<p>The overview.</p>",
					preview: values => (
						<div style={{width: "100%"}}>
							<Tabs>
								<Tab uuid="overview" name={values.name} icon={values.icon}>
									<p>The overview.</p>
								</Tab>
								<Tab uuid="activity" name="Activity">
									<p>The activity feed.</p>
								</Tab>
							</Tabs>
						</div>
					)
				}
			]}>

			<div className="tabs-dev-section">
				<FormHeading label="With icons"></FormHeading>
				<Tabs activeTab="overview" onClick={setLastClicked}>
					<Tab uuid="overview" name="Overview" icon="ri-dashboard-line">
						<div className="tabs-dev-panel">
							<Paragraph>The first tab is active unless activeTab says otherwise.</Paragraph>
						</div>
					</Tab>
					<Tab uuid="activity" name="Activity" icon="ri-history-line">
						<div className="tabs-dev-panel">
							<Paragraph>Switching tabs unmounts the previous panel.</Paragraph>
						</div>
					</Tab>
					<Tab uuid="settings" name="Settings" icon="ri-settings-3-line">
						<div className="tabs-dev-panel">
							<Paragraph>Any component can live inside a tab.</Paragraph>
							<Badge style={{marginTop: "10px"}}>Nested content</Badge>
						</div>
					</Tab>
				</Tabs>
				<div className="tabs-dev-output">Last onClick uuid: {lastClicked}</div>
			</div>

			<div className="tabs-dev-section">
				<FormHeading label="Without icons"></FormHeading>
				<Tabs>
					<Tab uuid="one" name="First">
						<div className="tabs-dev-panel">First panel</div>
					</Tab>
					<Tab uuid="two" name="Second">
						<div className="tabs-dev-panel">Second panel</div>
					</Tab>
				</Tabs>
			</div>

			<div className="tabs-dev-section">
				<FormHeading label="Remembered in the url"></FormHeading>
				<Paragraph>
					This set writes ?section= into the address bar, so a refresh reopens the same tab.
				</Paragraph>
				<Tabs persistInUrl={true} urlParamName="section">
					<Tab uuid="details" name="Details" icon="ri-file-list-line">
						<div className="tabs-dev-panel">Reload the page and this stays selected.</div>
					</Tab>
					<Tab uuid="history" name="History" icon="ri-time-line">
						<div className="tabs-dev-panel">So does this one.</div>
					</Tab>
				</Tabs>
			</div>

			<div className="tabs-dev-section">
				<FormHeading label="More than fits"></FormHeading>
				<Paragraph>
					Drag the bottom right corner of the box to narrow it. The tabs that no longer fit move into
					a More dropdown, and come back as soon as there is room for them again. Selecting a tab from
					the dropdown marks the More button as active.
				</Paragraph>
				<div className="tabs-dev-resizable">
					<Tabs>
						<Tab uuid="summary" name="Summary" icon="ri-dashboard-line">
							<div className="tabs-dev-panel">Summary panel</div>
						</Tab>
						<Tab uuid="members" name="Members" icon="ri-team-line">
							<div className="tabs-dev-panel">Members panel</div>
						</Tab>
						<Tab uuid="billing" name="Billing" icon="ri-bank-card-line">
							<div className="tabs-dev-panel">Billing panel</div>
						</Tab>
						<Tab uuid="integrations" name="Integrations" icon="ri-plug-line">
							<div className="tabs-dev-panel">Integrations panel</div>
						</Tab>
						<Tab uuid="notifications" name="Notifications" icon="ri-notification-3-line">
							<div className="tabs-dev-panel">Notifications panel</div>
						</Tab>
						<Tab uuid="audit" name="Audit log" icon="ri-file-list-3-line">
							<div className="tabs-dev-panel">Audit log panel</div>
						</Tab>
						<Tab uuid="advanced" name="Advanced" icon="ri-settings-3-line">
							<div className="tabs-dev-panel">Advanced panel</div>
						</Tab>
					</Tabs>
				</div>
			</div>

			<div className="tabs-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
