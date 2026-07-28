import React from "react";

import './PagesDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {CenteredDiv} from "../../../../components/layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../../components/layouts/right-aligned-div/RightAlignedDiv";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {
	VerticalSplitPage
} from "../../../../components/layouts/pages/split-pages/vertical-split-page/VerticalSplitPage";
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";

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
		<PaddedPage>
			<PageHeading>Page Layouts</PageHeading>
			<Paragraph>
				The page primitives every other screen is assembled from. PaddedPage gives a page its gutters,
				CenteredDiv and RightAlignedDiv align a row of content, and the split pages pair a main area with a
				panel the user can drag to resize — the size is remembered per uuid.
			</Paragraph>

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
		</PaddedPage>
	)
}
