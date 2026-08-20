import React, {useEffect, useRef, useState} from "react";

import './AddComment.css'
import {Avatar} from "../../avatar/avatar/Avatar";
import {RichText} from "../../inputs/richtext/default/RichText";
import {Button, ButtonType} from "../../buttons/button/Button";
import {Comment, CommentType, Media, User} from "@blue-orange-ai/foundations-clients";
import {Skeleton} from "../../loading/skeleton/Skeleton";
import {v4 as uuidv4} from "uuid";
import {CommentAuthor, CommentsStore} from "../comments-store/CommentsStore";
import {commentsRootClassNames, useComments} from "../comments-store/CommentsProvider";

interface Props {
	topic: string,
	referenceId: string,
	tags?: Array<string>,
	/** Overrides the store from the nearest provider. */
	store?: CommentsStore,
	/** Shows the author's picture. Hidden unless asked for — see CommentsOptions. */
	showAvatar?: boolean,
	dark?: boolean,
	label?: string,
	/** Fired with the stored comment once it has been written. */
	onCreated?: (comment: Comment) => void
}

export const AddComment: React.FC<Props> = ({
												topic,
												referenceId,
												tags = [],
												store,
												showAvatar,
												dark,
												label = "Add a Comment",
												onCreated
											}) => {

	const options = useComments({store: store, showAvatar: showAvatar, dark: dark});

	const commentsStore = options.store;

	const [user, setUser] = useState<CommentAuthor | undefined>(undefined);

	const [loadingUser, setLoadingUser] = useState<boolean>(true);

	const editableComment = useRef<Comment | null>(null);

	const [editableCommentLastSent, setEditableCommentLastSent] = useState<string>("");

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

	const createComment = () => {
		const comment = editableComment.current;
		if (comment == null || (comment.text ?? "").trim() == "") {
			return;
		}
		setEditableCommentLastSent(uuidv4())
		// The box is cleared as soon as the comment is on its way, so the
		// draft it held cannot be sent twice.
		editableComment.current = null;
		commentsStore.create(comment).then((result: Comment) => {
			onCreated?.(result ?? comment);
		}).catch((reason => console.error(reason)))
	}

	const getUser = () => {
		if (commentsStore.currentUser == undefined) {
			setUser(undefined);
			setLoadingUser(false);
			return;
		}
		commentsStore.currentUser()
			.then(user => {
				setUser(user)
				setLoadingUser(false);
			})
			.catch(reason => {
				setUser(undefined)
				setLoadingUser(false);
			});
	}

	useEffect(() => {
		getUser()
	}, [commentsStore]);

	return (
		<div className={commentsRootClassNames("blue-orange-comments-add-cont", options)}>
			{options.showAvatar &&
				<div className="blue-orange-comments-add-avatar-cont">
					{!loadingUser &&
						<Avatar user={user as User | undefined} height={38} width={38}></Avatar>
					}
					{loadingUser &&
						<Skeleton style={{height: "38px", width: "38px", borderRadius: "50%"}}></Skeleton>
					}
				</div>
			}
			<div className="blue-orange-comments-add-body">
				<h3 className="blue-orange-comments-add-body-header">{label}</h3>
				<RichText
					placeholder={"Add your comment here..."}
					focus={true}
					onChange={processChangeData}
					clearState={editableCommentLastSent}
				>
					<Button
						text={"Comment"}
						buttonType={ButtonType.PRIMARY}
						style={{height: "28px", marginRight: "10px"}}
						onClick={createComment}
					></Button>
				</RichText>
			</div>
		</div>
	)
}
