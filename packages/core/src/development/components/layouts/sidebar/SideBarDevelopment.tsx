import React, {useState} from "react";

import './SideBarDevelopment.css'
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
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SIDEBAR_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A SideBarHeader, a SideBarBody and a SideBarFooter, in whichever of those the rail needs."
	},
	{
		name: "state",
		type: "SideBarState",
		required: true,
		control: "select",
		value: SideBarState.OPEN,
		options: [
			{label: "Open", value: SideBarState.OPEN, code: "SideBarState.OPEN"},
			{label: "Closed", value: SideBarState.CLOSED, code: "SideBarState.CLOSED"}
		],
		description: "Whether the rail is open or collapsed to its icons. It is controlled, so this is the page's to hold."
	},
	{
		name: "closeWidth",
		type: "number",
		default: "250",
		control: "number",
		description: "The width remembered for the collapsed rail."
	},
	{
		name: "openWidth",
		type: "number",
		default: "250",
		control: "slider",
		min: 180,
		max: 420,
		step: 10,
		description: "How wide the rail is when open, in pixels."
	},
	{
		name: "resizable",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Lets the rail be dragged wider or narrower."
	},
	{
		name: "filter",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Puts a search box at the top that filters the rail's own items."
	},
	{
		name: "expandGroupsOnCollapse",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Forces every group open while the rail is collapsed. A collapsed group hides its heading, so without this the items inside it would have no icon in the rail at all."
	},
	{
		name: "changeState",
		type: "(state: SideBarState) => void",
		description: "Fires when the rail asks to be opened or closed."
	}
];

const SIDEBAR_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Overview",
		description: "What the row reads. It never wraps — anything too long is cut off with an ellipsis."
	},
	{
		name: "active",
		type: "boolean",
		required: true,
		control: "toggle",
		value: true,
		description: "Marks the row as the page currently being viewed."
	},
	{
		name: "focused",
		type: "boolean",
		required: true,
		control: "toggle",
		value: false,
		description: "Marks the row as the one the keyboard is on."
	},
	{
		name: "hoverEffects",
		type: "boolean",
		control: "toggle",
		description: "Whether the row responds to the pointer."
	},
	{
		name: "sortable",
		type: "boolean",
		description: "Marks the row as one that can be dragged into a new position."
	},
	{
		name: "defaultStyle",
		type: "React.CSSProperties",
		description: "Inline style for the row's resting state."
	},
	{
		name: "activeStyle",
		type: "React.CSSProperties",
		description: "Inline style applied while the row is active."
	},
	{
		name: "focusedStyle",
		type: "React.CSSProperties",
		description: "Inline style applied while the row is focused."
	},
	{
		name: "icon",
		type: "React.ReactNode",
		description: "The glyph shown before the label — and all that is left of the row once the rail collapses."
	},
	{
		name: "badge",
		type: "React.ReactNode",
		control: "text",
		description: "A count or a status on the right of the row. It closes to nothing as the rail collapses rather than blinking out."
	},
	{
		name: "rightItems",
		type: "React.ReactNode",
		description: "Anything else pinned to the right of the row."
	},
	{
		name: "hoverItems",
		type: "React.ReactNode",
		description: "Controls that only appear while the row is hovered."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the row."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the row is clicked."
	}
];

const SIDEBAR_ITEM_LINK_PROPS: Array<PropSpec> = [
	{
		name: "href",
		type: "string",
		required: true,
		control: "text",
		value: "/overview",
		description: "Where the row goes. This is a real anchor, so it can be middle clicked and copied."
	},
	...SIDEBAR_ITEM_PROPS
];

const SIDEBAR_GROUP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A SideBarBodyLabel and the rows underneath it."
	},
	{
		name: "opened",
		type: "boolean",
		required: true,
		control: "toggle",
		value: true,
		description: "Whether the group is showing its rows."
	},
	{
		name: "sortable",
		type: "boolean",
		description: "Marks the group as one that can be dragged into a new position."
	},
	{
		name: "openOnActiveChild",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Opens the group by itself when one of its rows becomes the active one."
	},
	{
		name: "onOpenedChange",
		type: "(opened: boolean) => void",
		description: "Fires when the group asks to be opened or closed."
	}
];

const SIDEBAR_LABEL_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Reports",
		description: "What the heading reads."
	},
	{
		name: "icon",
		type: "React.ReactNode",
		description: "The glyph before the label — usually the chevron that says which way the group is."
	},
	{
		name: "badge",
		type: "React.ReactNode",
		description: "A count or a status on the right of the heading."
	},
	{
		name: "hoverEffects",
		type: "boolean",
		control: "toggle",
		description: "Whether the heading responds to the pointer."
	},
	{
		name: "rightItems",
		type: "React.ReactNode",
		description: "Anything else pinned to the right of the heading."
	},
	{
		name: "hoverItems",
		type: "React.ReactNode",
		description: "Controls that only appear while the heading is hovered."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the heading."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the heading is clicked — this is what opens and closes the group."
	}
];

const SIDEBAR_HEADER_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Foundations",
		description: "The product's name."
	},
	{
		name: "state",
		type: "SideBarState",
		required: true,
		description: "Whether the rail is open, which decides whether the label is shown at all."
	},
	{
		name: "media",
		type: "Media",
		description: "The mark shown beside the name."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	{
		name: "action",
		type: "ReactNode",
		description: "A control pinned to the right of the header row."
	},
	{
		name: "headerItemClicked",
		type: "() => void",
		description: "Fires when the header row itself is clicked."
	},
	{
		name: "changeState",
		type: "(state: SideBarState) => void",
		description: "Fires when the collapse control is clicked."
	}
];

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
		<ComponentDoc
			title="Side Bar"
			description="The navigation rail the workspace is built around. It collapses to an icon rail, can be dragged wider, and filters its own items — collapsing and reopening is one continuous animation rather than a swap."
			name="SideBar"
			previewHeight={340}
			previewCentered={false}
			imports={["SideBarState", "SideBarHeader", "SideBarHeaderItem", "SideBarBody", "SideBarBodyItem", "SideBarFooter"]}
			props={SIDEBAR_PROPS}
			snippetChildren={() => "<SideBarHeader>\n\t<SideBarHeaderItem label={\"Foundations\"} state={state} changeState={setState}></SideBarHeaderItem>\n</SideBarHeader>\n<SideBarBody>\n\t<SideBarBodyItem label={\"Overview\"} active={true} focused={false} icon={<i className={\"ri-dashboard-line\"}></i>}></SideBarBodyItem>\n\t<SideBarBodyItem label={\"Runs\"} active={false} focused={false} icon={<i className={\"ri-play-list-line\"}></i>}></SideBarBodyItem>\n</SideBarBody>"}
			preview={values => (
				<div className="sidebar-dev-frame" style={{height: "300px"}}>
					<SideBar
						state={values.state}
						closeWidth={values.closeWidth}
						openWidth={values.openWidth}
						resizable={values.resizable}
						filter={values.filter}
						expandGroupsOnCollapse={values.expandGroupsOnCollapse}
						changeState={() => {}}>
						<SideBarHeader>
							<SideBarHeaderItem label="Foundations" state={values.state}></SideBarHeaderItem>
						</SideBarHeader>
						<SideBarBody>
							<SideBarBodyItem
								label="Overview"
								active={true}
								focused={false}
								icon={<i className="ri-dashboard-line"></i>}></SideBarBodyItem>
							<SideBarBodyItem
								label="Runs"
								active={false}
								focused={false}
								icon={<i className="ri-play-list-line"></i>}></SideBarBodyItem>
							<SideBarBodyItem
								label="Settings"
								active={false}
								focused={false}
								icon={<i className="ri-settings-3-line"></i>}></SideBarBodyItem>
						</SideBarBody>
					</SideBar>
				</div>
			)}
			siblings={[
				{
					name: "SideBarBodyItem",
					description: "One row in the rail. Everything about how it looks in each of its three states — default, active, focused — is a style prop, so a host application can theme the rail without touching its CSS.",
					props: SIDEBAR_ITEM_PROPS,
					previewHeight: 160,
					previewCentered: false,
					imports: ["SideBar", "SideBarBody", "SideBarState"],
					preview: values => (
						<div className="sidebar-dev-frame" style={{height: "120px"}}>
							<SideBar state={SideBarState.OPEN} filter={false} resizable={false}>
								<SideBarBody>
									<SideBarBodyItem
										label={values.label}
										active={values.active}
										focused={values.focused}
										hoverEffects={values.hoverEffects}
										icon={<i className="ri-dashboard-line"></i>}
										badge={values.badge ? <Badge>{values.badge}</Badge> : undefined}></SideBarBodyItem>
								</SideBarBody>
							</SideBar>
						</div>
					)
				},
				{
					name: "SideBarBodyItemLink",
					description: "The same row rendered as a real anchor, so it can be middle clicked and copied like any other link.",
					props: SIDEBAR_ITEM_LINK_PROPS,
					previewHeight: 160,
					previewCentered: false,
					imports: ["SideBar", "SideBarBody", "SideBarState"],
					preview: values => (
						<div className="sidebar-dev-frame" style={{height: "120px"}}>
							<SideBar state={SideBarState.OPEN} filter={false} resizable={false}>
								<SideBarBody>
									<SideBarBodyItemLink
										label={values.label}
										href={values.href}
										active={values.active}
										focused={values.focused}
										icon={<i className="ri-external-link-line"></i>}></SideBarBodyItemLink>
								</SideBarBody>
							</SideBar>
						</div>
					)
				},
				{
					name: "SideBarBodyGroup",
					description: "A collapsible block of rows. Its first child is usually a SideBarBodyLabel, which is what toggles it.",
					props: SIDEBAR_GROUP_PROPS,
					previewHeight: 200,
					previewCentered: false,
					imports: ["SideBar", "SideBarBody", "SideBarBodyLabel", "SideBarBodyItem", "SideBarState"],
					snippetChildren: () => "<SideBarBodyLabel label={\"Reports\"}></SideBarBodyLabel>\n<SideBarBodyItem label={\"Daily\"} active={false} focused={false}></SideBarBodyItem>",
					preview: values => (
						<div className="sidebar-dev-frame" style={{height: "160px"}}>
							<SideBar state={SideBarState.OPEN} filter={false} resizable={false}>
								<SideBarBody>
									<SideBarBodyGroup opened={values.opened} openOnActiveChild={values.openOnActiveChild}>
										<SideBarBodyLabel label="Reports" icon={<i className="ri-arrow-down-s-fill"></i>}></SideBarBodyLabel>
										<SideBarBodyItem label="Daily" active={false} focused={false}></SideBarBodyItem>
										<SideBarBodyItem label="Weekly" active={false} focused={false}></SideBarBodyItem>
									</SideBarBodyGroup>
								</SideBarBody>
							</SideBar>
						</div>
					)
				},
				{
					name: "SideBarBodyLabel",
					description: "The heading of a group. It has no active state of its own — it is the row that opens and closes what is underneath it.",
					props: SIDEBAR_LABEL_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["SideBar", "SideBarBody", "SideBarState"],
					preview: values => (
						<div className="sidebar-dev-frame" style={{height: "100px"}}>
							<SideBar state={SideBarState.OPEN} filter={false} resizable={false}>
								<SideBarBody>
									<SideBarBodyLabel
										label={values.label}
										hoverEffects={values.hoverEffects}
										icon={<i className="ri-arrow-right-s-fill"></i>}></SideBarBodyLabel>
								</SideBarBody>
							</SideBar>
						</div>
					)
				},
				{
					name: "SideBarHeaderItem",
					description: "The row at the top of the rail: the product's mark and name, and the control that collapses it.",
					props: SIDEBAR_HEADER_ITEM_PROPS,
					previewHeight: 140,
					previewCentered: false,
					imports: ["SideBar", "SideBarHeader", "SideBarState"],
					preview: values => (
						<div className="sidebar-dev-frame" style={{height: "100px"}}>
							<SideBar state={SideBarState.OPEN} filter={false} resizable={false}>
								<SideBarHeader>
									<SideBarHeaderItem label={values.label} state={SideBarState.OPEN}></SideBarHeaderItem>
								</SideBarHeader>
							</SideBar>
						</div>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
