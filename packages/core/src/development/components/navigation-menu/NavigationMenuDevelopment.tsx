import React, {useState} from "react";

import './NavigationMenuDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {NavigationMenu, NavigationMenuAlign} from "../../../components/navigation-menu/navigation-menu/NavigationMenu";
import {NavigationMenuItem} from "../../../components/navigation-menu/navigation-menu-item/NavigationMenuItem";
import {NavigationMenuLink} from "../../../components/navigation-menu/navigation-menu-link/NavigationMenuLink";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const NAVIGATION_MENU_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The NavigationMenuItem entries, in the order they sit in the bar."
	},
	{
		name: "align",
		type: "NavigationMenuAlign",
		default: "NavigationMenuAlign.START",
		defaultValue: NavigationMenuAlign.START,
		control: "select",
		options: [
			{label: "Start", value: NavigationMenuAlign.START, code: "NavigationMenuAlign.START"},
			{label: "Center", value: NavigationMenuAlign.CENTER, code: "NavigationMenuAlign.CENTER"},
			{label: "End", value: NavigationMenuAlign.END, code: "NavigationMenuAlign.END"}
		],
		description: "Where the panel sits relative to the entry that opened it."
	},
	{
		name: "openOnHover",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Opens a panel as soon as the pointer rests on its trigger, rather than waiting for a click."
	},
	{
		name: "openDelay",
		type: "number",
		default: "100",
		control: "slider",
		min: 0,
		max: 600,
		step: 25,
		description: "How long the pointer has to rest on a trigger before it opens, in milliseconds."
	},
	{
		name: "closeDelay",
		type: "number",
		default: "200",
		control: "slider",
		min: 0,
		max: 800,
		step: 25,
		description: "How long the panel stays open after the pointer leaves, in milliseconds — enough to move onto it."
	},
	{
		name: "panelWidth",
		type: "number",
		default: "420",
		control: "slider",
		min: 240,
		max: 720,
		step: 20,
		description: "Width of the drop down panels, in pixels."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the bar."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the bar."
	}
];

const NAVIGATION_MENU_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Products",
		description: "The text shown in the bar."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class shown before the label."
	},
	{
		name: "href",
		type: "string",
		control: "text",
		description: "Turns the entry into a plain link. Ignored once the entry has children of its own."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the entry out and stops it opening."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the entry is clicked."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The panel the entry opens. Without it the entry is a link."
	}
];

const NAVIGATION_MENU_LINK_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Search",
		description: "The bold first line."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "Query everything you have indexed.",
		description: "The muted second line."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-search-line",
		description: "A remixicon class shown before the text."
	},
	{
		name: "href",
		type: "string",
		control: "text",
		description: "Where the row goes."
	},
	{
		name: "active",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks the row as the page currently being viewed."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the row is clicked."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Replaces the label and description pair entirely."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the row."
	}
];

interface Props {
}

export const NavigationMenuDevelopment: React.FC<Props> = ({}) => {

	const [visited, setVisited] = useState("");

	return (
		<ComponentDoc
			title="Navigation Menu"
			description="A site navigation bar whose entries can drop a panel of links. An entry with no panel is rendered as a plain link, so a bar can mix the two."
			name="NavigationMenu"
			previewHeight={200}
			previewCentered={false}
			imports={["NavigationMenuItem", "NavigationMenuLink"]}
			props={NAVIGATION_MENU_PROPS}
			snippetChildren={() => "<NavigationMenuItem label={\"Products\"}>\n\t<NavigationMenuLink icon={\"ri-search-line\"} label={\"Search\"} description={\"Query everything you have indexed.\"}></NavigationMenuLink>\n\t<NavigationMenuLink icon={\"ri-flow-chart\"} label={\"Pipelines\"} description={\"Build and monitor data flows.\"}></NavigationMenuLink>\n</NavigationMenuItem>\n<NavigationMenuItem label={\"Pricing\"} href={\"/pricing\"}></NavigationMenuItem>"}
			preview={values => (
				<NavigationMenu
					align={values.align}
					openOnHover={values.openOnHover}
					openDelay={values.openDelay}
					closeDelay={values.closeDelay}
					panelWidth={values.panelWidth}>
					<NavigationMenuItem label="Products">
						<div className="blue-orange-navigation-menu-development-grid">
							<NavigationMenuLink
								icon="ri-search-line"
								label="Search"
								description="Query everything you have indexed."></NavigationMenuLink>
							<NavigationMenuLink
								icon="ri-flow-chart"
								label="Pipelines"
								description="Build and monitor data flows."></NavigationMenuLink>
						</div>
					</NavigationMenuItem>
					<NavigationMenuItem label="Pricing" href="/pricing"></NavigationMenuItem>
					<NavigationMenuItem label="Docs" href="/docs"></NavigationMenuItem>
				</NavigationMenu>
			)}
			siblings={[
				{
					name: "NavigationMenuItem",
					description: "One entry in the bar. Give it children and it becomes a trigger with a panel; leave them off and it is a link.",
					props: NAVIGATION_MENU_ITEM_PROPS,
					previewHeight: 160,
					previewCentered: false,
					snippetChildren: () => "<NavigationMenuLink label={\"Search\"}></NavigationMenuLink>",
					imports: ["NavigationMenu", "NavigationMenuLink"],
					preview: values => (
						<NavigationMenu>
							<NavigationMenuItem
								label={values.label}
								icon={values.icon}
								href={values.href}
								disabled={values.disabled}>
								<div className="blue-orange-navigation-menu-development-grid">
									<NavigationMenuLink icon="ri-search-line" label="Search" description="Query everything you have indexed."></NavigationMenuLink>
								</div>
							</NavigationMenuItem>
						</NavigationMenu>
					)
				},
				{
					name: "NavigationMenuLink",
					description: "A row inside a panel: an icon, a bold label and a muted line saying what is behind it.",
					props: NAVIGATION_MENU_LINK_PROPS,
					previewHeight: 140,
					preview: values => (
						<div style={{width: "280px"}}>
							<NavigationMenuLink
								icon={values.icon}
								label={values.label}
								description={values.description}
								href={values.href}
								active={values.active}></NavigationMenuLink>
						</div>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<NavigationMenu>
				<NavigationMenuItem label="Products">
					<div className="blue-orange-navigation-menu-development-grid">
						<NavigationMenuLink
							icon="ri-search-line"
							label="Search"
							description="Query everything you have indexed."
							onClick={() => setVisited("Search")}></NavigationMenuLink>
						<NavigationMenuLink
							icon="ri-flow-chart"
							label="Pipelines"
							description="Build and monitor data flows."
							onClick={() => setVisited("Pipelines")}></NavigationMenuLink>
						<NavigationMenuLink
							icon="ri-robot-line"
							label="Agents"
							description="Compose agents over your data."
							onClick={() => setVisited("Agents")}></NavigationMenuLink>
						<NavigationMenuLink
							icon="ri-database-2-line"
							label="Storage"
							description="Files, buckets and permissions."
							onClick={() => setVisited("Storage")}></NavigationMenuLink>
					</div>
				</NavigationMenuItem>
				<NavigationMenuItem label="Resources">
					<div className="blue-orange-navigation-menu-development-list">
						<NavigationMenuLink
							label="Documentation"
							description="Guides and API reference."
							onClick={() => setVisited("Documentation")}></NavigationMenuLink>
						<NavigationMenuLink
							label="Changelog"
							description="What shipped this month."
							onClick={() => setVisited("Changelog")}></NavigationMenuLink>
						<NavigationMenuLink
							label="Support"
							description="Talk to the team."
							onClick={() => setVisited("Support")}></NavigationMenuLink>
					</div>
				</NavigationMenuItem>
				<NavigationMenuItem label="Pricing" onClick={() => setVisited("Pricing")}></NavigationMenuItem>
				<NavigationMenuItem label="Status" disabled={true}></NavigationMenuItem>
			</NavigationMenu>
			<Description>{visited ? "Last visited: " + visited : "Nothing visited yet."}</Description>

			<GeneralHeading>Centred panels, click to open</GeneralHeading>
			<Description>Turning off openOnHover means the panel only opens on a click.</Description>
			<NavigationMenu align={NavigationMenuAlign.CENTER} openOnHover={false} panelWidth={320}>
				<NavigationMenuItem label="Company" icon="ri-building-line">
					<div className="blue-orange-navigation-menu-development-list">
						<NavigationMenuLink label="About" onClick={() => setVisited("About")}></NavigationMenuLink>
						<NavigationMenuLink label="Careers" onClick={() => setVisited("Careers")}></NavigationMenuLink>
					</div>
				</NavigationMenuItem>
				<NavigationMenuItem label="Contact" icon="ri-mail-line">
					<div className="blue-orange-navigation-menu-development-list">
						<NavigationMenuLink label="Sales" onClick={() => setVisited("Sales")}></NavigationMenuLink>
						<NavigationMenuLink label="Partnerships" onClick={() => setVisited("Partnerships")}></NavigationMenuLink>
					</div>
				</NavigationMenuItem>
			</NavigationMenu>
		</ComponentDoc>
	)
}
