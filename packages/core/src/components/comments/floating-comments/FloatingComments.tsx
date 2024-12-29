import React, {useEffect, useRef, useState} from "react";

import './FloatingComments.css'
import {RenderComment, RenderCommentTheme} from "../render-comment/RenderComment";
import {RichTextPrompt} from "../../inputs/richtext/prompt/RichTextPrompt";
import {Comment, CommentType, Media, Sockets} from "@blue-orange-ai/foundations-clients";
import commentsInstance from "../../config/BlueOrangeCommentsConfig";
import blueOrangeSocketUri from "../../config/BlueOrangeSocketsConfig";
import {v4 as uuidv4} from 'uuid';

interface Props {
	topic: string,
	referenceId?: string ,
	tags?: Array<string>
}

export const FloatingComments: React.FC<Props> = ({topic, referenceId="", tags=[]}) => {

	const [comments, setComments] = useState<Array<Comment>>([])

	const [editingPreviousComments, setEditingPreviousComments] = useState<string>("")

	const editableComment = useRef<Comment | null>(null);

	const [editableCommentLastSent, setEditableCommentLastSent] = useState<string>("");

	const getComments = () => {
		commentsInstance.get(topic).then((results: Array<Comment>) => {
			setComments(comments);
		})
	}

	const createComment = () => {
		setEditableCommentLastSent(uuidv4())
		commentsInstance.create(editableComment.current).then((result: Comment) => {
			// setComments(comments);
		}).catch((reason => console.error(reason)))
	}

	const processChangeData = (content: string, mentions: string[], attachments: Media[], filesUploading: boolean) => {
		if (editableComment.current == null) {
			editableComment.current = {
				topic: topic,
				referenceId: referenceId,
				userId: "",
				tags: tags,
				created: new Date(),
				edited: false,
				lastModified: new Date(),
				text: content,
				files: attachments,
				mentions: mentions,
				type: CommentType.CREATE
			}
		} else {
			editableComment.current.text = content;
			editableComment.current.files = attachments;
			editableComment.current.mentions = mentions;
		}
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
		sockets.connect();
		return () => {
			sockets.disconnect();
		}
	}, []);


	return (
		<div className="blue-orange-comments-floating-cont">
			{comments.map((item, index) => (
				<RenderComment
					key={item.id + "-" + index}
					theme={RenderCommentTheme.SMALL}
					editor={editingPreviousComments}
					onEditing={(editor) => setEditingPreviousComments(editor)}
					comment={item}
				></RenderComment>
			))}
			<RichTextPrompt
				placeholder={"Add comment..."}
				focus={true}
				onChange={processChangeData}
				onSend={createComment}
				clearState={editableCommentLastSent}></RichTextPrompt>
		</div>
	)
}