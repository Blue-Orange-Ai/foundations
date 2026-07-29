import React from "react";

import './SeparatorDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Separator, SeparatorOrientation} from "../../../../components/layouts/separator/Separator";

interface Props {
}

export const SeparatorDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Separator</PageHeading>
			<Description>A dividing line between sections, either across or down.</Description>

			<GeneralHeading>Horizontal</GeneralHeading>
			<div className="blue-orange-separator-development-block">
				<div className="blue-orange-separator-development-title">Foundations</div>
				<div className="blue-orange-separator-development-subtitle">A React component library.</div>
				<Separator style={{margin: "16px 0"}}></Separator>
				<div className="blue-orange-separator-development-row">
					<span>Docs</span>
					<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
					<span>Source</span>
					<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
					<span>Releases</span>
				</div>
			</div>

			<GeneralHeading>With a label</GeneralHeading>
			<div className="blue-orange-separator-development-block">
				<Separator>or continue with</Separator>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<div className="blue-orange-separator-development-row blue-orange-separator-development-tall">
				<div>Left</div>
				<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
				<div>Middle</div>
				<Separator orientation={SeparatorOrientation.VERTICAL}></Separator>
				<div>Right</div>
			</div>
		</PaddedPage>
	)
}
