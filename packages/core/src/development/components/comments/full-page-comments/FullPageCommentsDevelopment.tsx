import React, {useEffect, useState} from "react";

import './FullPageCommentsDevelopment.css'

import {FullPageComments} from "../../../../components/comments/full-page-comments/FullPageComments";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";

interface Props {
}

export const FullPageCommentsDevelopment: React.FC<Props> = ({}) => {


	return (
		<PaddedPage>
			<PageHeading>Full Page Comments</PageHeading>
			<FullPageComments topic={"demonstration-comment-topic-full-page"}></FullPageComments>
		</PaddedPage>
	)
}