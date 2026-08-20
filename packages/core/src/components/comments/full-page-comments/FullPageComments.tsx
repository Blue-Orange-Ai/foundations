import React, {useCallback, useEffect, useRef, useState} from "react";

import './FullPageComments.css'
import {RenderComment, RenderCommentTheme} from "../render-comment/RenderComment";
import {AddComment} from "../add-comment/AddComment";
import {Comment, CommentType} from "@blue-orange-ai/foundations-clients";
import {CommentsStore} from "../comments-store/CommentsStore";
import {BlueOrangeCommentsProvider, commentsRootClassNames, useComments} from "../comments-store/CommentsProvider";

interface Props {
	topic: string,
	referenceId?: string,
	tags?: Array<string>,
	/** Overrides the store from the nearest provider. */
	store?: CommentsStore,
	/** Shows author pictures. Hidden unless asked for — see CommentsOptions. */
	showAvatar?: boolean,
	dark?: boolean,
	/** Hides the comment box, e.g. for a read-only view of a thread. */
	readOnly?: boolean,
	onCommentsChange?: (comments: Array<Comment>) => void
}

export const FullPageComments: React.FC<Props> = ({
													  topic,
													  referenceId = "",
													  tags = [],
													  store,
													  showAvatar,
													  dark,
													  readOnly = false,
													  onCommentsChange
												  }) => {

	const options = useComments({store: store, showAvatar: showAvatar, dark: dark});

	const commentsStore = options.store;

	const [comments, setComments] = useState<Array<Comment>>([])

	const [initialised, setInitialised] = useState<boolean>(false)

	const [editingPreviousComments, setEditingPreviousComments] = useState<string>("")

	// Read through a ref so an inline callback prop cannot restart the fetch
	// on every render.
	const onCommentsChangeRef = useRef(onCommentsChange);
	onCommentsChangeRef.current = onCommentsChange;

	const getComments = useCallback(() => {
		commentsStore.get(topic).then((results: Array<Comment>) => {
			setComments(results ?? []);
			setInitialised(true);
			onCommentsChangeRef.current?.(results ?? []);
		}).catch((reason) => {
			console.error(reason);
			// Still show the comment box: a topic that cannot be read is far
			// more likely to be empty than broken, and a blank panel with no
			// way to write anything looks like the feature is missing.
			setInitialised(true);
		})
	}, [commentsStore, topic])

	useEffect(() => {
		getComments();
	}, [getComments]);

	// Stores that push changes (the hosted comments service, over sockets)
	// keep the list live. Stores without a feed rely on the refresh each write
	// triggers below.
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
			<div className={commentsRootClassNames("blue-orange-comments-cont", options)}>
				{initialised &&
					<>
						{comments.map((item, index) => (
							<RenderComment
								key={item.id + "-" + index}
								theme={RenderCommentTheme.LARGE}
								editor={editingPreviousComments}
								onEditing={(editor) => setEditingPreviousComments(editor)}
								onChanged={getComments}
								comment={item}
							></RenderComment>
						))}
					</>
				}
				{!readOnly &&
					<AddComment
						topic={topic}
						referenceId={referenceId}
						tags={tags}
						onCreated={getComments}
					></AddComment>
				}
			</div>
		</BlueOrangeCommentsProvider>
	)
}
