import React, {useEffect, useState} from "react";

import './FloatingCommentsDevelopment.css'

import {FloatingComments} from "../../../../components/comments/floating-comments/FloatingComments";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const FLOATING_COMMENTS_PROPS: Array<PropSpec> = [
	{
		name: "topic",
		type: "string",
		required: true,
		control: "text",
		value: "demonstration-comment-topic",
		description: "Which thread is being shown. Everything posted here is filed under it."
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
		description: "Shows author pictures. They are hidden unless asked for."
	},
	{
		name: "dark",
		type: "boolean",
		control: "toggle",
		description: "Forces the dark treatment, for comments floated over something dark of its own."
	}
];

interface Props {
}

export const FloatingCommentsDevelopment: React.FC<Props> = ({}) => {


	return (
		<ComponentDoc
			title="Floating Page Comments"
			description="Comments anchored to the page they are about, opening beside it rather than in a panel of its own. It takes its thread from the topic, and its data from the nearest CommentsProvider unless a store is handed to it directly."
			name="FloatingComments"
			previewHeight={280}
			previewCentered={false}
			props={FLOATING_COMMENTS_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<FloatingComments
						topic={values.topic}
						referenceId={values.referenceId}
						showAvatar={values.showAvatar}
						dark={values.dark}></FloatingComments>
				</div>
			)}>
			<FloatingComments topic={"demonstration-comment-topic"}></FloatingComments>
		</ComponentDoc>
	)
}