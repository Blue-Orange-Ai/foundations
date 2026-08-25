import React, {useEffect, useState} from "react";

import './FullPageCommentsDevelopment.css'

import {FullPageComments} from "../../../../components/comments/full-page-comments/FullPageComments";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const FULL_PAGE_COMMENTS_PROPS: Array<PropSpec> = [
	{
		name: "topic",
		type: "string",
		required: true,
		control: "text",
		value: "demonstration-comment-topic-full-page",
		description: "Which thread is being shown."
	},
	{
		name: "referenceId",
		type: "string",
		control: "text",
		description: "Narrows the thread to one record within the topic."
	},
	{
		name: "tags",
		type: "Array<string>",
		description: "Tags put on anything posted from here."
	},
	{
		name: "store",
		type: "CommentsStore",
		description: "Overrides the store from the nearest CommentsProvider."
	},
	{
		name: "showAvatar",
		type: "boolean",
		control: "toggle",
		description: "Shows author pictures."
	},
	{
		name: "readOnly",
		type: "boolean",
		control: "toggle",
		description: "Hides the comment box, for a thread that can only be read."
	},
	{
		name: "dark",
		type: "boolean",
		control: "toggle",
		description: "Forces the dark treatment."
	},
	{
		name: "onCommentsChange",
		type: "(comments: Array<Comment>) => void",
		description: "Fires with the whole thread whenever it changes."
	}
];

interface Props {
}

export const FullPageCommentsDevelopment: React.FC<Props> = ({}) => {


	return (
		<ComponentDoc
			title="Full Page Comments"
			description="The whole thread as a page: every comment in order with the box to add another at the foot. Read only drops that box, for a thread that is being looked at rather than joined."
			name="FullPageComments"
			previewHeight={320}
			previewCentered={false}
			props={FULL_PAGE_COMMENTS_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<FullPageComments
						topic={values.topic}
						referenceId={values.referenceId}
						showAvatar={values.showAvatar}
						readOnly={values.readOnly}
						dark={values.dark}></FullPageComments>
				</div>
			)}>
			<FullPageComments topic={"demonstration-comment-topic-full-page"}></FullPageComments>
		</ComponentDoc>
	)
}