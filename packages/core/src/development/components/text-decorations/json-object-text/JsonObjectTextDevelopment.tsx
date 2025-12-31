import React from "react";

import './JsonObjectTextDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {JsonObjectText} from "../../../../components/text-decorations/json-object-text/JsonObjectText";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const JsonObjectTextDevelopment: React.FC<Props> = ({}) => {

	const simpleObject = { name: "John", age: 30 };
	const complexObject = {
		user: {
			id: 1,
			name: "Jane Doe",
			email: "jane@example.com",
			roles: ["admin", "user"],
			settings: {
				theme: "dark",
				notifications: true
			}
		}
	};
	const arrayObject = [1, 2, 3, { nested: "value" }];

	return (
		<PaddedPage>
			<PageHeading>JSON Object Text Decoration</PageHeading>
			<Description>Renders JavaScript objects as formatted JSON strings.</Description>

			<GeneralHeading>Simple Object (Single Line)</GeneralHeading>
			<JsonObjectText obj={simpleObject} />

			<GeneralHeading>Simple Object (Pretty Print)</GeneralHeading>
			<JsonObjectText obj={simpleObject} prettyPrint={true} />

			<GeneralHeading>Complex Object (Single Line)</GeneralHeading>
			<JsonObjectText obj={complexObject} />

			<GeneralHeading>Complex Object (Pretty Print)</GeneralHeading>
			<JsonObjectText obj={complexObject} prettyPrint={true} />

			<GeneralHeading>Array Object (Pretty Print)</GeneralHeading>
			<JsonObjectText obj={arrayObject} prettyPrint={true} />
		</PaddedPage>
	)
}
