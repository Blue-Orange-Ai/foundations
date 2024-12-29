import React, {useEffect, useState} from "react";

import './FloatingCommentsDevelopment.css'

import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FloatingComments} from "../../../../components/comments/floating-comments/FloatingComments";

interface Props {
}

export const FloatingCommentsDevelopment: React.FC<Props> = ({}) => {


	return (
		<PaddedPage>
			<PageHeading>Floating Page Comments</PageHeading>
			<FloatingComments topic={"demonstration-comment-topic"}></FloatingComments>
		</PaddedPage>
	)
}