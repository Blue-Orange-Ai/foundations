import React, {useState} from "react";

import './BreadcrumbsDevelopment.css';

import {BreadCrumb, Breadcrumbs} from "../../../components/breadcrumbs/Breadcrumbs";
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMajor} from "../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
    HorizontalSplitPage
} from "../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {FormHeading} from "../../../components/text-decorations/form-heading/FormHeading";

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
                <PaddedPage>
                    <PageHeading>Breadcrumbs</PageHeading>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading>Simple Breadcrumbs (3 items)</FormHeading>
                        <Breadcrumbs items={simpleBreadcrumbs} onClick={handleClick} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading>Long Breadcrumbs with Default Max (5 items shown)</FormHeading>
                        <Breadcrumbs items={longBreadcrumbs} onClick={handleClick} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading>Long Breadcrumbs with Max 3 Items</FormHeading>
                        <Breadcrumbs items={longBreadcrumbs} onClick={handleClick} maxItems={3} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading>Very Long Breadcrumbs (10 items, max 4)</FormHeading>
                        <Breadcrumbs items={veryLongBreadcrumbs} onClick={handleClick} maxItems={4} />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading>Custom Separator</FormHeading>
                        <Breadcrumbs items={simpleBreadcrumbs} onClick={handleClick} separator=">" />
                    </div>

                    <div className="breadcrumbs-dev-section">
                        <FormHeading>Arrow Separator</FormHeading>
                        <Breadcrumbs items={simpleBreadcrumbs} onClick={handleClick} separator="→" />
                    </div>

                </PaddedPage>
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
