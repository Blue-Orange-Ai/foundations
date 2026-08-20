import React, {useCallback, useEffect, useRef, useState} from "react";

import './FloatingComments.css'
import {RenderComment, RenderCommentTheme} from "../render-comment/RenderComment";
import {RichTextPrompt} from "../../inputs/richtext/prompt/RichTextPrompt";
import {Comment, CommentType, Media} from "@blue-orange-ai/foundations-clients";
import {CommentsStore} from "../comments-store/CommentsStore";
import {BlueOrangeCommentsProvider, commentsRootClassNames, useComments} from "../comments-store/CommentsProvider";
import {v4 as uuidv4} from 'uuid';

interface Props {
	topic: string,
	referenceId?: string,
	tags?: Array<string>,
	/** Overrides the store from the nearest provider. */
	store?: CommentsStore,
	/** Shows author pictures. Hidden unless asked for — see CommentsOptions. */
	showAvatar?: boolean,
	dark?: boolean
}

export const FloatingComments: React.FC<Props> = ({
													  topic,
													  referenceId = "",
													  tags = [],
													  store,
													  showAvatar,
													  dark
												  }) => {

	const options = useComments({store: store, showAvatar: showAvatar, dark: dark});

	const commentsStore = options.store;

	const [comments, setComments] = useState<Array<Comment>>([])

	const [editingPreviousComments, setEditingPreviousComments] = useState<string>("")

	const editableComment = useRef<Comment | null>(null);

	const [editableCommentLastSent, setEditableCommentLastSent] = useState<string>("");

	const getComments = useCallback(() => {
		commentsStore.get(topic).then((results: Array<Comment>) => {
			setComments(results ?? []);
		}).catch(reason => console.error(reason))
	}, [commentsStore, topic])

	const createComment = () => {
		const comment = editableComment.current;
		if (comment == null || (comment.text ?? "").trim() == "") {
			return;
		}
		setEditableCommentLastSent(uuidv4())
		editableComment.current = null;
		commentsStore.create(comment).then((result: Comment) => {
			getComments();
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

	useEffect(() => {
		getComments();
	}, [getComments]);

	useEffect(() => {
		if (commentsStore.subscribe == undefined) {
			return undefined;
		}
		return commentsStore.subscribe(topic, (comment: Comment) => {
			if (comment.type == CommentType.CREATE) {
				setComments((prevComments) => [...(prevComments || []), comment]);
			} else if (comment.type == CommentType.UPDATE) {
				setComments((prevComments) =>
					prevComments.map((c) =>
						c.id === comment.id ? {...c, ...comment} : c
					)
				);
			} else if (comment.type == CommentType.DELETE) {
				setComments((prevComments) =>
					prevComments.filter((c) => c.id !== comment.id)
				);
			}
		});
	}, [commentsStore, topic]);

	return (
		<BlueOrangeCommentsProvider store={options.store} showAvatar={options.showAvatar} dark={options.dark}>
			<div className={commentsRootClassNames("blue-orange-comments-floating-cont", options)}>
				{comments.map((item, index) => (
					<RenderComment
						key={item.id + "-" + index}
						theme={RenderCommentTheme.SMALL}
						editor={editingPreviousComments}
						onEditing={(editor) => setEditingPreviousComments(editor)}
						onChanged={getComments}
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
		</BlueOrangeCommentsProvider>
	)
}
