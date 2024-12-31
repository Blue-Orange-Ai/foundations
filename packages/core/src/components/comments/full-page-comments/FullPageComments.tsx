import React, {useEffect, useState} from "react";

import './FullPageComments.css'
import {RenderComment, RenderCommentTheme} from "../render-comment/RenderComment";
import {AddComment} from "../add-comment/AddComment";
import {Comment, CommentType, Sockets} from "@blue-orange-ai/foundations-clients";
import commentsInstance from "../../config/BlueOrangeCommentsConfig";
import blueOrangeSocketUri from "../../config/BlueOrangeSocketsConfig";

interface Props {
	topic: string,
	referenceId?: string,
	tags?: Array<string>

}

export const FullPageComments: React.FC<Props> = ({topic, referenceId="", tags=[]}) => {

	const [comments, setComments] = useState<Array<Comment>>([])

	const [editingPreviousComments, setEditingPreviousComments] = useState<string>("")

	const getComments = () => {
		commentsInstance.get(topic).then((results: Array<Comment>) => {
			setComments(comments);
		}).catch((reason) => console.error(reason))
	}

	const sockets = new Sockets(
		blueOrangeSocketUri,
		() => {
			console.log("Socket connected")
			sockets.subscribe('/topic/' + topic, (message: any) => {
				const comment = JSON.parse(message.body) as Comment;
				if (comment.type == CommentType.CREATE) {
					setComments((prevComments) => [...(prevComments || []), comment]);
				} else if (comment.type == CommentType.UPDATE) {
					setComments((prevComments) =>
						prevComments.map((c) =>
							c.id === comment.id ? { ...c, ...comment } : c
						)
					);
				} else if (comment.type == CommentType.DELETE) {
					setComments((prevComments) =>
						prevComments.filter((c) => c.id !== comment.id)
					);
				}
			});
		}
	)

	useEffect(() => {
		getComments();
		sockets.connect();
		return () => {
			sockets.disconnect();
		}
	}, []);

	return (
		<div className="blue-orange-comments-cont">
			{comments.map((item, index) => (
				<RenderComment
					key={item.id + "-" + index}
					theme={RenderCommentTheme.LARGE}
					editor={editingPreviousComments}
					onEditing={(editor) => setEditingPreviousComments(editor)}
					comment={item}
				></RenderComment>
			))}
			<AddComment topic={topic} referenceId={referenceId} tags={tags}></AddComment>
		</div>
	)
}