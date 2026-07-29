import React, {useState} from "react";

import './NavigationMenuDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {NavigationMenu, NavigationMenuAlign} from "../../../components/navigation-menu/navigation-menu/NavigationMenu";
import {NavigationMenuItem} from "../../../components/navigation-menu/navigation-menu-item/NavigationMenuItem";
import {NavigationMenuLink} from "../../../components/navigation-menu/navigation-menu-link/NavigationMenuLink";

interface Props {
}

export const NavigationMenuDevelopment: React.FC<Props> = ({}) => {

	const [visited, setVisited] = useState("");

	return (
		<PaddedPage>
			<PageHeading>Navigation Menu</PageHeading>
			<Description>
				A site navigation bar whose entries can drop a panel of links. Entries without a panel
				are rendered as plain links.
			</Description>

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
		</PaddedPage>
	)
}
