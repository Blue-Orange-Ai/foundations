import React from "react";

import './PagesDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {CenteredDiv} from "../../../../components/layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../../components/layouts/right-aligned-div/RightAlignedDiv";
import {
	HorizontalSplitPage,
	SplitDirectionHorizontalPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {
	VerticalSplitPage,
	SplitDirectionVerticalPage
} from "../../../../components/layouts/pages/split-pages/vertical-split-page/VerticalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const PADDED_PAGE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The page's content."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the outer element."
	}
];

const SIDEBAR_PAGE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A SideBar, and whatever the body of the page is. The SideBar is picked out by type wherever it sits among them."
	}
];

const SPLIT_PANE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "The pane's content."
	}
];

const VERTICAL_SPLIT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A SplitPageMajor and a SplitPageMinor."
	},
	{
		name: "splitDirection",
		type: "SplitDirectionVerticalPage",
		default: "SplitDirectionVerticalPage.RIGHT",
		defaultValue: SplitDirectionVerticalPage.RIGHT,
		control: "select",
		options: [
			{label: "Right", value: SplitDirectionVerticalPage.RIGHT, code: "SplitDirectionVerticalPage.RIGHT"},
			{label: "Left", value: SplitDirectionVerticalPage.LEFT, code: "SplitDirectionVerticalPage.LEFT"}
		],
		description: "Which side the minor pane sits on."
	},
	{
		name: "uuid",
		type: "string",
		description: "Remembers the width the handle was left at under this key, so the split comes back the way it was."
	},
	{
		name: "adjustable",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether the handle can be dragged at all."
	},
	{
		name: "maxWidth",
		type: "string",
		default: "\"unset\"",
		control: "text",
		description: "How wide the minor pane is allowed to get, as a CSS length."
	},
	{
		name: "minWidth",
		type: "string",
		default: "\"unset\"",
		control: "text",
		description: "How narrow the minor pane is allowed to get, as a CSS length."
	},
	{
		name: "defaultWidth",
		type: "number",
		default: "300",
		control: "slider",
		min: 120,
		max: 600,
		step: 10,
		description: "Where the minor pane starts, in pixels."
	}
];

const HORIZONTAL_SPLIT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "A SplitPageMajor and a SplitPageMinor."
	},
	{
		name: "splitDirection",
		type: "SplitDirectionHorizontalPage",
		default: "SplitDirectionHorizontalPage.BOTTOM",
		defaultValue: SplitDirectionHorizontalPage.BOTTOM,
		control: "select",
		options: [
			{label: "Bottom", value: SplitDirectionHorizontalPage.BOTTOM, code: "SplitDirectionHorizontalPage.BOTTOM"},
			{label: "Top", value: SplitDirectionHorizontalPage.TOP, code: "SplitDirectionHorizontalPage.TOP"}
		],
		description: "Which end the minor pane sits at."
	},
	{
		name: "uuid",
		type: "string",
		description: "Remembers the height the handle was left at under this key."
	},
	{
		name: "adjustable",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether the handle can be dragged at all."
	},
	{
		name: "maxHeight",
		type: "number",
		control: "number",
		description: "How tall the minor pane is allowed to get, in pixels."
	},
	{
		name: "minHeight",
		type: "number",
		control: "number",
		description: "How short the minor pane is allowed to get, in pixels."
	},
	{
		name: "defaultHeight",
		type: "number",
		default: "300",
		control: "slider",
		min: 80,
		max: 400,
		step: 10,
		value: 100,
		description: "Where the minor pane starts, in pixels."
	}
];

interface Props {
}

const USAGE = `// A page with a resizable panel underneath it
<HorizontalSplitPage uuid="my-page" defaultHeight={300}>
    <SplitPageMajor>
        <PaddedPage>...the page...</PaddedPage>
    </SplitPageMajor>
    <SplitPageMinor>...the panel...</SplitPageMinor>
</HorizontalSplitPage>

// The same idea, split left to right
<VerticalSplitPage uuid="my-side-by-side" defaultWidth={320}>
    <SplitPageMajor>...</SplitPageMajor>
    <SplitPageMinor>...</SplitPageMinor>
</VerticalSplitPage>`;

export const PagesDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Page Layouts"
			description="The page primitives every other screen is assembled from. PaddedPage gives a page its gutters, SidebarPage puts a rail beside it, and the split pages divide it into a major and a minor pane with a handle between them."
			name="PaddedPage"
			previewHeight={200}
			previewCentered={false}
			props={PADDED_PAGE_PROPS}
			snippetChildren={() => "<PageHeading>Fleet overview</PageHeading>\n<Description>Every depot reporting in the last hour.</Description>"}
			preview={() => (
				<div style={{width: "100%", border: "1px dashed rgba(127,127,127,0.4)"}}>
					<PaddedPage>
						<div>The page's content, with the gutters the rest of the application uses.</div>
					</PaddedPage>
				</div>
			)}
			siblings={[
				{
					name: "VerticalSplitPage",
					description: "Two panes side by side with a draggable handle between them. The minor pane is the one that is sized; the major takes what is left.",
					props: VERTICAL_SPLIT_PROPS,
					previewHeight: 260,
					previewCentered: false,
					imports: ["SplitPageMajor", "SplitPageMinor", "SplitDirectionVerticalPage"],
					snippetChildren: () => "<SplitPageMajor>\n\t<div>The main pane.</div>\n</SplitPageMajor>\n<SplitPageMinor>\n\t<div>The side pane.</div>\n</SplitPageMinor>",
					preview: values => (
						<div style={{width: "100%", height: "200px"}}>
							<VerticalSplitPage
								splitDirection={values.splitDirection}
								adjustable={values.adjustable}
								defaultWidth={values.defaultWidth}
								minWidth={values.minWidth}
								maxWidth={values.maxWidth}>
								<SplitPageMajor>
									<div className="pages-dev-block">The main pane.</div>
								</SplitPageMajor>
								<SplitPageMinor>
									<div className="pages-dev-block">The side pane.</div>
								</SplitPageMinor>
							</VerticalSplitPage>
						</div>
					)
				},
				{
					name: "HorizontalSplitPage",
					description: "The same split, stacked. The minor pane takes a height rather than a width — a console under an editor, a preview under a form.",
					props: HORIZONTAL_SPLIT_PROPS,
					previewHeight: 300,
					previewCentered: false,
					imports: ["SplitPageMajor", "SplitPageMinor", "SplitDirectionHorizontalPage"],
					snippetChildren: () => "<SplitPageMajor>\n\t<div>The main pane.</div>\n</SplitPageMajor>\n<SplitPageMinor>\n\t<div>The pane underneath.</div>\n</SplitPageMinor>",
					preview: values => (
						<div style={{width: "100%", height: "240px"}}>
							<HorizontalSplitPage
								splitDirection={values.splitDirection}
								adjustable={values.adjustable}
								defaultHeight={values.defaultHeight}
								minHeight={values.minHeight}
								maxHeight={values.maxHeight}>
								<SplitPageMajor>
									<div className="pages-dev-block">The main pane.</div>
								</SplitPageMajor>
								<SplitPageMinor>
									<div className="pages-dev-block">The pane underneath.</div>
								</SplitPageMinor>
							</HorizontalSplitPage>
						</div>
					)
				},
				{
					name: "SplitPageMajor",
					description: "Marks the pane that takes whatever room is left over. It renders nothing itself.",
					props: SPLIT_PANE_PROPS,
					previewHeight: 110,
					snippetChildren: () => "<div>The main pane.</div>",
					preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>Renders nothing on its own — the split page reads it.</span>)
				},
				{
					name: "SplitPageMinor",
					description: "Marks the pane that is sized, and that the handle moves. It renders nothing itself.",
					props: SPLIT_PANE_PROPS,
					previewHeight: 110,
					snippetChildren: () => "<div>The side pane.</div>",
					preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>Renders nothing on its own — the split page reads it.</span>)
				},
				{
					name: "SidebarPage",
					description: "A page with a rail beside it. It picks the SideBar out of its children and lays the rest out as the body.",
					props: SIDEBAR_PAGE_PROPS,
					previewHeight: 130,
					snippetChildren: () => "<SideBar state={state} changeState={setState}>…</SideBar>\n<PaddedPage>…the page…</PaddedPage>",
					preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>A SidebarPage fills the window, so it is shown on the Sidebar page instead.</span>)
				}
			]}>

			<div className="pages-dev-section">
				<FormHeading label="PaddedPage"></FormHeading>
				<div className="pages-dev-frame">
					<PaddedPage>
						<div className="pages-dev-block">Content sits inside the page gutters.</div>
					</PaddedPage>
				</div>
			</div>

			<div className="pages-dev-section">
				<FormHeading label="CenteredDiv"></FormHeading>
				<div className="pages-dev-frame">
					<CenteredDiv>
						<Button text="Centered" buttonType={ButtonType.SECONDARY}></Button>
					</CenteredDiv>
				</div>
			</div>

			<div className="pages-dev-section">
				<FormHeading label="RightAlignedDiv"></FormHeading>
				<div className="pages-dev-frame">
					<RightAlignedDiv>
						<Button text="Right aligned" buttonType={ButtonType.SECONDARY}></Button>
					</RightAlignedDiv>
				</div>
			</div>

			<div className="pages-dev-section">
				<FormHeading label="HorizontalSplitPage — drag the divider"></FormHeading>
				<div className="pages-dev-frame pages-dev-frame-tall">
					<HorizontalSplitPage uuid="pages-development-horizontal" defaultHeight={120}>
						<SplitPageMajor>
							<div className="pages-dev-block">SplitPageMajor — the main area</div>
						</SplitPageMajor>
						<SplitPageMinor>
							<div className="pages-dev-block">SplitPageMinor — the resizable panel</div>
						</SplitPageMinor>
					</HorizontalSplitPage>
				</div>
			</div>

			<div className="pages-dev-section">
				<FormHeading label="VerticalSplitPage — drag the divider"></FormHeading>
				<div className="pages-dev-frame pages-dev-frame-tall">
					<VerticalSplitPage uuid="pages-development-vertical" defaultWidth={220}>
						<SplitPageMajor>
							<div className="pages-dev-block">SplitPageMajor</div>
						</SplitPageMajor>
						<SplitPageMinor>
							<div className="pages-dev-block">SplitPageMinor</div>
						</SplitPageMinor>
					</VerticalSplitPage>
				</div>
			</div>

			<div className="pages-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</ComponentDoc>
	)
}
