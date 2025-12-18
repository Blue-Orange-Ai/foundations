import React from "react";

import './AvatarDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {Avatar} from "../../../components/avatar/avatar/Avatar";

interface Props {
}

export const AvatarDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Avatar</PageHeading>
			<div className="blue-orange-avatar-development-row">
				<Avatar user={undefined}></Avatar>
				<Avatar user={undefined} tooltip={true}></Avatar>
			</div>
		</PaddedPage>
	)
}
