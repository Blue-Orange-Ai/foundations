import React, {useState} from "react";

import './PanelDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Panel, PanelIconPos, PanelTab} from "../../../components/panel/Panel";
import {PropertiesDisplay, Property} from "../../../components/text-decorations/properties-display/PropertiesDisplay";
import {Button, ButtonType} from "../../../components/buttons/button/Button";

interface Site {
	uuid: string,
	name: string,
	icon: string,
	properties: Array<Property>
}

const SITES: Array<Site> = [
	{
		uuid: "melbourne",
		name: "Melbourne Depot",
		icon: "ri-map-pin-2-line",
		properties: [
			{label: "Name", value: "Melbourne Depot"},
			{label: "Status", value: "Operational"},
			{label: "Coordinates", value: "-37.8136, 144.9631"},
			{label: "Manager", value: "Ada Lovelace"},
			{label: "Capabilities", value: ["Storage", "Dispatch", "Maintenance", "Fuel"]},
			{label: "Last inspected", value: "12 August 2026"},
			{label: "Next inspection", value: undefined}
		]
	},
	{
		uuid: "geelong",
		name: "Geelong Yard",
		icon: "ri-map-pin-2-line",
		properties: [
			{label: "Name", value: "Geelong Yard"},
			{label: "Status", value: "Reduced capacity"},
			{label: "Coordinates", value: "-38.1499, 144.3617"},
			{label: "Manager", value: "Grace Hopper"},
			{label: "Capabilities", value: ["Storage", "Dispatch"]},
			{label: "Last inspected", value: "3 July 2026"}
		]
	},
	{
		uuid: "ballarat",
		name: "Ballarat Substation",
		icon: "ri-flashlight-line",
		properties: [
			{label: "Name", value: "Ballarat Substation"},
			{label: "Status", value: "Offline"},
			{label: "Coordinates", value: "-37.5622, 143.8503"},
			{label: "Manager", value: undefined},
			{label: "Capabilities", value: ["Transmission"]}
		]
	}
];

const siteBody = (site: Site) => (
	<PropertiesDisplay properties={site.properties} orientation="horizontal"></PropertiesDisplay>
);

const lorem = (
	<div>
		{Array.from({length: 12}).map((value, index) => (
			<p key={index} style={{marginTop: index === 0 ? 0 : "8px", marginBottom: 0}}>
				Paragraph {index + 1}. The body scrolls on its own so the panel keeps the height it
				was given no matter how much is put inside it.
			</p>
		))}
	</div>
);

interface Props {
}

export const PanelDevelopment: React.FC<Props> = ({}) => {

	const [closed, setClosed] = useState(false);

	const [selected, setSelected] = useState<Array<string>>(SITES.map(site => site.uuid));

	const [activeTab, setActiveTab] = useState("geelong");

	const selectedSites = SITES.filter(site => selected.includes(site.uuid));

	const siteTabs: Array<PanelTab> = selectedSites.map(site => ({
		uuid: site.uuid,
		label: site.name,
		icon: site.icon,
		content: siteBody(site)
	}));

	const manyTabs: Array<PanelTab> = Array.from({length: 12}).map((value, index) => ({
		uuid: "marker-" + index,
		label: "Marker " + (index + 1),
		icon: "ri-map-pin-2-line",
		disabled: index === 3,
		content: <div>Detail of marker {index + 1}. Marker 4 is disabled.</div>
	}));

	return (
		<PaddedPage>
			<PageHeading>Panel</PageHeading>
			<Description>
				The surface that opens beside an interactive component — a map marker, a table row, a
				node on a graph — to show what was clicked. The header is a prop, the body takes any
				children, and a tab strip appears when more than one item is selected at once.
			</Description>

			<GeneralHeading>Default</GeneralHeading>
			<Description>350 by 500 with 8px of body padding, and no header until one is given.</Description>
			<div className="blue-orange-panel-development-row">
				<Panel>{siteBody(SITES[0])}</Panel>
			</div>

			<GeneralHeading>Header</GeneralHeading>
			<Description>
				The header takes a string or a node. The optional icon button sits on whichever side
				iconPos names — a back arrow on the left, a close on the right.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel
					header={"Melbourne Depot"}
					icon={"ri-close-line"}
					iconLabel={"Close"}
					onIconClick={() => {setClosed(true)}}
					height={260}>
					{closed
						? <div>The close button was clicked.</div>
						: siteBody(SITES[0])}
				</Panel>
				<Panel
					header={"Back to the list"}
					icon={"ri-arrow-left-line"}
					iconPos={PanelIconPos.LEFT}
					iconLabel={"Back"}
					height={260}>
					{siteBody(SITES[1])}
				</Panel>
				<Panel
					header={
						<>
							<i className="ri-map-pin-2-line"></i>
							<span>A header node — an icon, a title and a badge of its own</span>
						</>
					}
					icon={"ri-more-2-line"}
					iconLabel={"Actions"}
					height={260}>
					{siteBody(SITES[2])}
				</Panel>
			</div>

			<GeneralHeading>Tabs</GeneralHeading>
			<Description>
				One tab per selected item. Each tab carries its own content, so the panel swaps the
				body itself; leave the content off and the panel keeps rendering its children while
				onTabClick reports the selection. Selecting and deselecting below drives the tabs the
				way a map would.
			</Description>
			<div className="blue-orange-panel-development-row">
				{SITES.map(site => (
					<Button
						key={site.uuid}
						text={site.name}
						icon={selected.includes(site.uuid) ? "ri-checkbox-line" : "ri-checkbox-blank-line"}
						buttonType={ButtonType.SECONDARY}
						onClick={() => {
							setSelected(selected.includes(site.uuid)
								? selected.filter(uuid => uuid !== site.uuid)
								: SITES.filter(item => selected.includes(item.uuid) || item.uuid === site.uuid)
									.map(item => item.uuid));
						}}
					></Button>
				))}
			</div>
			<div className="blue-orange-panel-development-row">
				<Panel
					header={selectedSites.length + " selected"}
					icon={"ri-close-line"}
					iconLabel={"Close"}
					tabs={siteTabs}
					height={320}>
					<div>Nothing is selected.</div>
				</Panel>
			</div>

			<GeneralHeading>Tabs without a header</GeneralHeading>
			<Description>
				Leave the header off and the tab strip becomes the top of the panel. An action button
				given without a header sits in the tab row rather than taking a bar of its own, so a
				headerless panel keeps every pixel it can for the body.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel tabs={siteTabs} width={300} height={280}>
					<div>Nothing is selected.</div>
				</Panel>
				<Panel tabs={siteTabs} icon={"ri-close-line"} iconLabel={"Close"} width={300} height={280}>
					<div>Nothing is selected.</div>
				</Panel>
				<Panel
					tabs={siteTabs}
					icon={"ri-arrow-left-line"}
					iconPos={PanelIconPos.LEFT}
					iconLabel={"Back"}
					width={300}
					height={280}>
					<div>Nothing is selected.</div>
				</Panel>
			</div>
			<Description>
				Icon only tabs, for a strip that has to stay narrow.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel
					tabs={SITES.map(site => ({uuid: site.uuid, icon: site.icon, content: siteBody(site)}))}
					icon={"ri-close-line"}
					iconLabel={"Close"}
					width={260}
					height={240}>
				</Panel>
			</div>

			<GeneralHeading>Controlled tabs</GeneralHeading>
			<Description>
				activeTab moves the selection from the outside — the panel follows whatever it is
				handed.
			</Description>
			<div className="blue-orange-panel-development-row">
				{SITES.map(site => (
					<Button
						key={site.uuid}
						text={"Show " + site.name}
						buttonType={activeTab === site.uuid ? ButtonType.PRIMARY : ButtonType.SECONDARY}
						onClick={() => {setActiveTab(site.uuid)}}
					></Button>
				))}
			</div>
			<div className="blue-orange-panel-development-row">
				<Panel
					header={"Controlled"}
					tabs={SITES.map(site => ({
						uuid: site.uuid,
						label: site.name,
						icon: site.icon,
						content: siteBody(site)
					}))}
					activeTab={activeTab}
					onTabClick={(uuid) => {setActiveTab(uuid)}}
					height={320}>
				</Panel>
			</div>

			<GeneralHeading>Overflowing tabs</GeneralHeading>
			<Description>
				More tabs than the panel is wide — the strip scrolls sideways without a scrollbar of
				its own, and the arrow keys walk the triggers. The fourth tab is disabled.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel header={"12 selected"} tabs={manyTabs} height={260}></Panel>
			</div>

			<GeneralHeading>Padding</GeneralHeading>
			<Description>
				The 8px default is overridden with a number of pixels or any CSS length. Zero is the
				one to reach for when the body holds a list or a table that draws its own edges.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel header={"padding={0}"} padding={0} width={240} height={220}>
					<div className="blue-orange-panel-development-flush">Flush to the edges</div>
				</Panel>
				<Panel header={"default"} width={240} height={220}>
					<div className="blue-orange-panel-development-flush">8px</div>
				</Panel>
				<Panel header={"padding={24}"} padding={24} width={240} height={220}>
					<div className="blue-orange-panel-development-flush">24px</div>
				</Panel>
				<Panel header={"padding=\"8px 16px\""} padding={"8px 16px"} width={240} height={220}>
					<div className="blue-orange-panel-development-flush">Two values</div>
				</Panel>
			</div>

			<GeneralHeading>Size</GeneralHeading>
			<Description>
				width and height override the 350 by 500 default, as a number of pixels or any CSS
				length.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel header={"220 x 200"} width={220} height={200}>{siteBody(SITES[2])}</Panel>
				<Panel header={"320 x 200"} width={320} height={200}>{siteBody(SITES[1])}</Panel>
				<Panel header={"460 x 200"} width={460} height={200}>{siteBody(SITES[0])}</Panel>
			</div>

			<GeneralHeading>Filling a container</GeneralHeading>
			<Description>
				Given 100% for both, the panel takes the size of whatever holds it — the way it would
				sit in a docked column beside a map.
			</Description>
			<div className="blue-orange-panel-development-fill">
				<Panel
					header={"Melbourne Depot"}
					icon={"ri-close-line"}
					iconLabel={"Close"}
					width={"100%"}
					height={"100%"}>
					{siteBody(SITES[0])}
				</Panel>
			</div>

			<GeneralHeading>Scrolling body</GeneralHeading>
			<Description>
				The body is the only part that scrolls — the header and the tabs stay put.
			</Description>
			<div className="blue-orange-panel-development-row">
				<Panel
					header={"A long body"}
					icon={"ri-close-line"}
					tabs={[
						{uuid: "detail", label: "Detail", icon: "ri-file-list-line", content: lorem},
						{uuid: "history", label: "History", icon: "ri-time-line", content: lorem}
					]}
					height={300}>
				</Panel>
			</div>

			<GeneralHeading>Over a map</GeneralHeading>
			<Description>
				Floated over another surface, which is what the panel is built for.
			</Description>
			<div className="blue-orange-panel-development-map">
				<div className="blue-orange-panel-development-map-float">
					<Panel
						header={"Melbourne Depot"}
						icon={"ri-close-line"}
						iconLabel={"Close"}
						width={300}
						height={260}
						style={{boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)"}}>
						{siteBody(SITES[0])}
					</Panel>
				</div>
			</div>
		</PaddedPage>
	)
}
