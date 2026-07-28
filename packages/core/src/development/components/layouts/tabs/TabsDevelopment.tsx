import React, {useState} from "react";

import './TabsDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {Tabs} from "../../../../components/layouts/tabs/tabs/Tabs";
import {Tab} from "../../../../components/layouts/tabs/tab/Tab";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {Badge} from "../../../../components/text-decorations/badge/Badge";

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
<Tabs persistInUrl={true} urlParamName="section"> ... </Tabs>`;

export const TabsDevelopment: React.FC<Props> = ({}) => {

	const [lastClicked, setLastClicked] = useState<string>("-");

	return (
		<PaddedPage>
			<PageHeading>Tabs</PageHeading>
			<Paragraph>
				Each Tab declares a uuid, a name and an optional icon, and holds the content shown when it is active.
				Tabs renders the header row itself and only mounts the active tab's children.
			</Paragraph>

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
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</PaddedPage>
	)
}
