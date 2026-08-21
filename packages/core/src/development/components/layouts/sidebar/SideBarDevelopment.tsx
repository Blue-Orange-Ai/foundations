import React, {useState} from "react";

import './SideBarDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {SideBar, SideBarState} from "../../../../components/layouts/sidebar/default/SideBar";
import {SideBarHeader} from "../../../../components/layouts/sidebar/sidebar-header/SideBarHeader";
import {SideBarHeaderItem} from "../../../../components/layouts/sidebar/items/sidebar-header-item/SideBarHeaderItem";
import {SideBarBody} from "../../../../components/layouts/sidebar/sidebar-body/SideBarBody";
import {SideBarBodyGroup} from "../../../../components/layouts/sidebar/items/sidebar-body-group/SideBarBodyGroup";
import {SideBarBodyLabel} from "../../../../components/layouts/sidebar/items/sidebar-body-label/SideBarBodyLabel";
import {SideBarBodyItem} from "../../../../components/layouts/sidebar/items/sidebar-body-item/SideBarBodyItem";
import {SideBarBodyItemLink} from "../../../../components/layouts/sidebar/items/sidebar-body-item-link/SideBarBodyItemLink";
import {SideBarFooter} from "../../../../components/layouts/sidebar/sidebar-footer/SideBarFooter";
import {Badge} from "../../../../components/text-decorations/badge/Badge";
import {ButtonIcon} from "../../../../components/buttons/button-icon/ButtonIcon";
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";

interface Props {
}

const USAGE = `const [state, setState] = useState(SideBarState.OPEN);

<SideBar state={state} changeState={setState} filter={true} resizable={true}>
    <SideBarHeader>
        <SideBarHeaderItem label="Foundations" state={state} changeState={setState}></SideBarHeaderItem>
    </SideBarHeader>
    <SideBarBody>
        <SideBarBodyGroup opened={true}>
            <SideBarBodyLabel label="Workspace"></SideBarBodyLabel>
            <SideBarBodyItem
                label="Overview"
                icon={<i className="ri-dashboard-line"></i>}
                active={true}
                focused={false}
                onClick={() => navigate("/overview")}></SideBarBodyItem>
            <SideBarBodyItemLink
                label="Docs"
                href="https://example.com"
                icon={<i className="ri-book-2-line"></i>}
                active={false}
                focused={false}></SideBarBodyItemLink>
        </SideBarBodyGroup>
    </SideBarBody>
    <SideBarFooter>...</SideBarFooter>
</SideBar>`;

export const SideBarDevelopment: React.FC<Props> = ({}) => {

	const [state, setState] = useState<SideBarState>(SideBarState.OPEN);

	const [active, setActive] = useState<string>("overview");

	const [filter, setFilter] = useState<boolean>(true);

	const [longLabels, setLongLabels] = useState<boolean>(false);

	const [groupOpen, setGroupOpen] = useState<boolean>(true);

	const label = (short: string, long: string) => longLabels ? long : short;

	const icon = (name: string) => <i className={name}></i>;

	return (
		<PaddedPage>
			<PageHeading>Side Bar</PageHeading>
			<Paragraph>
				The navigation rail used by the workspace. It collapses to a 48px icon rail, can be dragged wider, and
				filters its own items. Collapsing and reopening is one continuous animation — the rows squeeze down to
				their icons, group headings slide up under the row above, and badges close to nothing rather than
				blinking out. Labels never wrap — anything too long for the current width is cut off with an ellipsis,
				so try the long labels switch and then drag the sidebar's right edge.
			</Paragraph>

			<div className="sidebar-dev-controls">
				<div className="sidebar-dev-toggle">
					<Checkbox
						checked={state === SideBarState.CLOSED}
						onCheckboxChange={(checked) => setState(checked ? SideBarState.CLOSED : SideBarState.OPEN)}></Checkbox>
					<span>Collapsed to icons</span>
				</div>
				<div className="sidebar-dev-toggle">
					<Checkbox checked={filter} onCheckboxChange={setFilter}></Checkbox>
					<span>Filter box</span>
				</div>
				<div className="sidebar-dev-toggle">
					<Checkbox checked={longLabels} onCheckboxChange={setLongLabels}></Checkbox>
					<span>Long labels</span>
				</div>
				<div className="sidebar-dev-toggle">
					<Checkbox checked={groupOpen} onCheckboxChange={setGroupOpen}></Checkbox>
					<span>Second group open</span>
				</div>
			</div>

			<div className="sidebar-dev-frame">
				<SideBar state={state} changeState={setState} filter={filter} resizable={true}>
					<SideBarHeader>
						<SideBarHeaderItem
							label={label("Foundations", "Foundations design system workspace")}
							state={state}
							changeState={setState}
							action={<ButtonIcon icon="ri-add-line"></ButtonIcon>}></SideBarHeaderItem>
					</SideBarHeader>
					<SideBarBody>
						<SideBarBodyGroup opened={true}>
							<SideBarBodyLabel label={label("Workspace", "Workspace and organisation")}></SideBarBodyLabel>
							<SideBarBodyItem
								label={label("Overview", "Overview of everything happening this week")}
								icon={icon("ri-dashboard-line")}
								active={active === "overview"}
								focused={false}
								onClick={() => setActive("overview")}></SideBarBodyItem>
							<SideBarBodyItem
								label={label("Projects", "Projects, pipelines and their deployments")}
								icon={icon("ri-folder-3-line")}
								active={active === "projects"}
								focused={false}
								badge={<Badge>12</Badge>}
								onClick={() => setActive("projects")}></SideBarBodyItem>
							<SideBarBodyItem
								label={label("Inbox", "Inbox with every unread notification")}
								icon={icon("ri-inbox-line")}
								active={active === "inbox"}
								focused={false}
								hoverEffects={true}
								badge={<Badge>3</Badge>}
								hoverItems={<ButtonIcon icon="ri-more-2-fill"></ButtonIcon>}
								onClick={() => setActive("inbox")}></SideBarBodyItem>
						</SideBarBodyGroup>

						<SideBarBodyGroup opened={groupOpen} onOpenedChange={setGroupOpen}>
							<SideBarBodyLabel label={label("Settings", "Settings and administration")}></SideBarBodyLabel>
							<SideBarBodyItem
								label={label("Members", "Members, roles and their permissions")}
								icon={icon("ri-team-line")}
								active={active === "members"}
								focused={false}
								onClick={() => setActive("members")}></SideBarBodyItem>
							<SideBarBodyItem
								label={label("Billing", "Billing, invoices and payment methods")}
								icon={icon("ri-bank-card-line")}
								active={active === "billing"}
								focused={false}
								onClick={() => setActive("billing")}></SideBarBodyItem>
							<SideBarBodyItemLink
								label={label("Documentation", "Documentation for the whole component library")}
								href="https://github.com/Blue-Orange-Ai"
								icon={icon("ri-book-2-line")}
								active={false}
								focused={false}></SideBarBodyItemLink>

							<SideBarBodyGroup opened={true}>
								<SideBarBodyLabel label={label("Security", "Security and access control")}></SideBarBodyLabel>
								<SideBarBodyItem
									label={label("Tokens", "API tokens issued to this workspace")}
									icon={icon("ri-key-2-line")}
									active={active === "tokens"}
									focused={false}
									onClick={() => setActive("tokens")}></SideBarBodyItem>
								<SideBarBodyItem
									label={label("Audit log", "Audit log of every change made here")}
									icon={icon("ri-history-line")}
									active={active === "audit"}
									focused={false}
									onClick={() => setActive("audit")}></SideBarBodyItem>
							</SideBarBodyGroup>
						</SideBarBodyGroup>
					</SideBarBody>
					<SideBarFooter>
						<SideBarBodyItem
							label={label("Sign out", "Sign out of this workspace entirely")}
							icon={icon("ri-logout-box-line")}
							active={false}
							focused={false}></SideBarBodyItem>
					</SideBarFooter>
				</SideBar>
				<div className="sidebar-dev-page">
					<div className="sidebar-dev-page-title">{active}</div>
					<Paragraph>
						The sidebar sits next to the page. Drag its right edge to resize, or collapse it to the icon
						rail — collapsed items keep their icon and show the label as a tooltip.
					</Paragraph>
				</div>
			</div>

			<div className="sidebar-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</PaddedPage>
	)
}
