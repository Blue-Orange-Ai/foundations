import React, {useState} from "react";

import './AccordionDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {Accordion} from "../../../components/accordion/accordion/Accordion";
import {AccordionHeader} from "../../../components/accordion/accordion-header/AccordionHeader";
import {AccordionBody} from "../../../components/accordion/accordion-body/AccordionBody";


interface Props {
}

export const AccordionDevelopment: React.FC<Props> = ({}) => {


	const [opened, setOpened] = useState<boolean>(true)

	return (
		<PaddedPage>
			<PageHeading>Accordion Development</PageHeading>
			<Accordion opened={opened}>
				<AccordionHeader>
					<div className="blue-orange-accordion-development-header" onClick={() => setOpened(!opened)}>Accordion Header</div>
				</AccordionHeader>
				<AccordionBody>
					<div className="blue-orange-accordion-development-body">
						<div>Body 1</div>
						<div>Body 2</div>
						<div>Body 3</div>
						<div>Body 4</div>
						<div>Body 5</div>
					</div>
				</AccordionBody>
			</Accordion>
		</PaddedPage>
	)
}