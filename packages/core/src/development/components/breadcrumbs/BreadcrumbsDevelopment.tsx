import React, {useState} from "react";

import './BreadcrumbsDevelopment.css';

import {BreadCrumb, Breadcrumbs} from "../../../components/breadcrumbs/Breadcrumbs";
import {SplitPageMajor} from "../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
    HorizontalSplitPage
} from "../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const DEMO_TRAIL: Array<BreadCrumb> = [
	{type: "URL", url: "/home", label: "Home"},
	{type: "URL", url: "/products", label: "Products"},
	{type: "reference", reference: "electronics-123", label: "Electronics"}
];

const DEMO_LONG_TRAIL: Array<BreadCrumb> = [
	{type: "URL", url: "/home", label: "Home"},
	{type: "URL", url: "/products", label: "Products"},
	{type: "URL", url: "/products/electronics", label: "Electronics"},
	{type: "URL", url: "/products/electronics/computers", label: "Computers"},
	{type: "URL", url: "/products/electronics/computers/laptops", label: "Laptops"},
	{type: "reference", reference: "gaming-456", label: "Gaming Laptops"},
	{type: "reference", reference: "macbook-789", label: "MacBook Pro 16"}
];

const BREAD_CRUMB_INTERFACE = {
	name: "BreadCrumb",
	description: "One step in the trail. A URL step is a link; a reference step is not, and is reported through onClick for the application to act on.",
	props: [
		{name: "type", type: "\"URL\" | \"reference\"", required: true, description: "Whether the step navigates on its own or is handed back through onClick."},
		{name: "url", type: "string", description: "Where a URL step goes."},
		{name: "reference", type: "string", description: "What a reference step identifies."},
		{name: "label", type: "string", required: true, description: "What the step reads."}
	] as Array<PropSpec>
};

const BREADCRUMBS_PROPS: Array<PropSpec> = [
	{
		name: "items",
		type: "Array<BreadCrumb>",
		required: true,
		description: "The trail, from the root through to where you are now."
	},
	{
		name: "onClick",
		type: "(item: BreadCrumb) => void",
		description: "Fires with the step that was clicked."
	},
	{
		name: "maxItems",
		type: "number",
		default: "5",
		control: "slider",
		min: 2,
		max: 8,
		step: 1,
		description: "How many steps are shown before the middle of the trail is collapsed."
	},
	{
		name: "separator",
		type: "string",
		default: "\"/\"",
		control: "select",
		options: [
			{label: "/", value: "/"},
			{label: "›", value: "›"},
			{label: "→", value: "→"},
			{label: "•", value: "•"}
		],
		description: "What is drawn between the steps."
	},
	{
		name: "long",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — swaps in a seven step trail so the collapsing can be seen."
	}
];

interface Props {
}

export const BreadcrumbsDevelopment: React.FC<Props> = ({}) => {

    const [selection, setSelection] = useState<BreadCrumb>();

    const simpleBreadcrumbs: Array<BreadCrumb> = [
        {type: "URL", url: "/home", label: "Home"},
        {type: "URL", url: "/products", label: "Products"},
        {type: "reference", reference: "electronics-123", label: "Electronics"},
    ];

    const longBreadcrumbs: Array<BreadCrumb> = [
        {type: "URL", url: "/home", label: "Home"},
        {type: "URL", url: "/products", label: "Products"},
        {type: "URL", url: "/products/electronics", label: "Electronics"},
        {type: "URL", url: "/products/electronics/computers", label: "Computers"},
        {type: "URL", url: "/products/electronics/computers/laptops", label: "Laptops"},
        {type: "reference", reference: "gaming-laptops-456", label: "Gaming Laptops"},
        {type: "reference", reference: "macbook-pro-789", label: "MacBook Pro 16"},
    ];

    const veryLongBreadcrumbs: Array<BreadCrumb> = [
        {type: "URL", url: "/", label: "Root"},
        {type: "URL", url: "/organizations", label: "Organizations"},
        {type: "URL", url: "/organizations/acme", label: "Acme Corp"},
        {type: "URL", url: "/organizations/acme/departments", label: "Departments"},
        {type: "URL", url: "/organizations/acme/departments/engineering", label: "Engineering"},
        {type: "URL", url: "/organizations/acme/departments/engineering/teams", label: "Teams"},
        {type: "URL", url: "/organizations/acme/departments/engineering/teams/frontend", label: "Frontend"},
        {type: "URL", url: "/organizations/acme/departments/engineering/teams/frontend/projects", label: "Projects"},
        {type: "reference", reference: "project-123", label: "Dashboard Redesign"},
        {type: "reference", reference: "task-456", label: "Task #456"},
    ];

    const handleClick = (item: BreadCrumb) => {
        setSelection(item);
    };

    return (
        <HorizontalSplitPage>
            <SplitPageMajor>
                <ComponentDoc
			title="Breadcrumbs"
			description="The trail back up a hierarchy. A trail longer than maxItems keeps its first and last steps and collapses the middle, so the path stays one line however deep it goes."
			name="Breadcrumbs"
			previewHeight={120}
			imports={["BreadCrumb"]}
			interfaces={[BREAD_CRUMB_INTERFACE]}
			props={BREADCRUMBS_PROPS}
			preview={values => (
				<Breadcrumbs
					items={values.long ? DEMO_LONG_TRAIL : DEMO_TRAIL}
					maxItems={values.maxItems}
					separator={values.separator}
					onClick={() => {}}></Breadcrumbs>
			)}>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading label="Simple Breadcrumbs (3 items)"></FormHeading>
                        <Breadcrumbs items={simpleBreadcrumbs} onClick={handleClick} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading label="Long Breadcrumbs with Default Max (5 items shown)"></FormHeading>
                        <Breadcrumbs items={longBreadcrumbs} onClick={handleClick} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading label="Long Breadcrumbs with Max 3 Items"></FormHeading>
                        <Breadcrumbs items={longBreadcrumbs} onClick={handleClick} maxItems={3} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading label="Very Long Breadcrumbs (10 items, max 4)"></FormHeading>
                        <Breadcrumbs items={veryLongBreadcrumbs} onClick={handleClick} maxItems={4} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading label="Custom Separator"></FormHeading>
                        <Breadcrumbs items={simpleBreadcrumbs} onClick={handleClick} separator=">" />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading label="Arrow Separator"></FormHeading>
                        <Breadcrumbs items={simpleBreadcrumbs} onClick={handleClick} separator="→" />
                    </div>

                </ComponentDoc>
            </SplitPageMajor>
            <SplitPageMinor>
                <div className="workspace-output-window">
                    <div style={{marginBottom: "20px"}}>Output:</div>
                    <div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
                        {JSON.stringify(selection, null, 2)}
                    </div>
                </div>
            </SplitPageMinor>
        </HorizontalSplitPage>
    );
};
