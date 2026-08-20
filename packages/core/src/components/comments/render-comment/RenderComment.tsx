import React, {useEffect, useRef, useState} from "react";

import './RenderComment.css'
import {Avatar} from "../../avatar/avatar/Avatar";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {Badge} from "../../text-decorations/badge/Badge";
import {RenderHtml} from "../../text-decorations/render-html/RenderHtml";
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";
import {Comment, Media, User} from "@blue-orange-ai/foundations-clients";
import {Skeleton} from "../../loading/skeleton/Skeleton";
import {RichTextPrompt} from "../../inputs/richtext/prompt/RichTextPrompt";
import {CommentAuthor, CommentsStore} from "../comments-store/CommentsStore";
import {commentsRootClassNames, useComments} from "../comments-store/CommentsProvider";
import {RelativeTime} from "../../text-decorations/dates/relative-time/RelativeTime";

export enum RenderCommentTheme {
	LARGE,
	SMALL
}

interface Props {
	theme?: RenderCommentTheme,
	comment: Comment,
	editor?: string,
	/** Overrides the store from the nearest provider. */
	store?: CommentsStore,
	/** Shows the author's picture. Hidden unless asked for — see CommentsOptions. */
	showAvatar?: boolean,
	dark?: boolean,
	onEditing: (commentId: string) => void,
	/** Fired after this comment was edited or deleted, so lists can refresh. */
	onChanged?: () => void
}

export const RenderComment: React.FC<Props> = ({
												   theme = RenderCommentTheme.LARGE,
												   comment,
												   editor,
												   store,
												   showAvatar,
												   dark,
												   onEditing,
												   onChanged
											   }) => {

	const options = useComments({store: store, showAvatar: showAvatar, dark: dark});

	const commentsStore = options.store;

	const [user, setUser] = useState<CommentAuthor | undefined>(undefined)

	const [tags, setTags] = useState<Array<string>>(comment.tags ?? [])

	const [loadingUser, setLoadingUser] = useState<boolean>(true);

	const [editState, setEditState] = useState<boolean>(false);

	const [editable, setEditable] = useState<boolean>(false);

	const editableComment = useRef<Comment>(comment);

	const generateThemeAvatarHeight = () => {
		if (theme == RenderCommentTheme.SMALL) {
			return 28
		}
		return 38;
	}

	const generateThemeClass = () => {
		var className = "blue-orange-comments-render-cont"
		if (theme == RenderCommentTheme.SMALL) {
			className += " blue-orange-comments-render-cont-small"
		}
		return commentsRootClassNames(className, options);
	}

	const commentClassName = generateThemeClass();

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.CONTENT, label: "Edit Comment", icon: "ri-edit-fill", value: "EDIT"},
		{type: IContextMenuType.CONTENT, label: "Delete Comment", icon: "ri-delete-bin-line", value: "DELETE"}
	]

	const moreButtonStyle: React.CSSProperties = {
		border: "none"
	}

	const processContextMenuClick = (item: IContextMenuItem) => {
		if (item.value == "EDIT") {
			editableComment.current = comment;
			setEditState(true);
			if (onEditing) {
				onEditing(comment.id as string);
			}
		} else if (item.value == "DELETE") {
			deleteComment();
		}
	}

	const getUser = () => {
		if (commentsStore.getUser == undefined) {
			setUser(undefined);
			setLoadingUser(false);
			return;
		}
		commentsStore.getUser(comment.userId)
			.then(user => {
				setUser(user)
				setLoadingUser(false);
			})
			.catch(reason => {
				setUser(undefined)
				setLoadingUser(false);
			});
	}

	const processChangeData = (content: string, mentions: string[], attachments: Media[], filesUploading: boolean) => {
		if (editableComment.current == null) {
			editableComment.current = comment;
		} else {
			editableComment.current.text = content;
			editableComment.current.files = attachments;
			editableComment.current.mentions = mentions;
		}
	}

	const updateComment = () => {
		commentsStore.update(editableComment.current).then((result: Comment) => {
			setEditState(false);
			onChanged?.();
		}).catch((reason => console.error(reason)))
	}

	const deleteComment = () => {
		commentsStore.delete(editableComment.current).then(() => {
			onChanged?.();
		}).catch((reason => console.error(reason)))
	}

	// Whether this comment may be edited is a question for the store, asked
	// once per comment rather than on every render.
	useEffect(() => {
		let cancelled = false;
		commentsStore.isEditable(comment)
			.then((state: boolean) => {
				if (!cancelled) {
					setEditable(state);
				}
			})
			.catch((reason => console.error(reason)));
		return () => {
			cancelled = true;
		};
	}, [comment.id, commentsStore]);

	useEffect(() => {
		if (editor != comment.id) {
			setEditState(false);
		}
	}, [editor]);

	useEffect(() => {
		setTags(comment.tags ?? []);
	}, [comment.tags]);

	useEffect(() => {
		getUser()
	}, [comment.userId, commentsStore]);


	return (
		<div className={commentClassName}>
			{options.showAvatar &&
				<div className="blue-orange-comments-render-avatar-cont">
					{!loadingUser &&
						<Avatar user={user as User | undefined} height={generateThemeAvatarHeight()}
								width={generateThemeAvatarHeight()}></Avatar>
					}
					{loadingUser &&
						<Skeleton style={{
							height: generateThemeAvatarHeight() + "px",
							width: generateThemeAvatarHeight() + "px",
							borderRadius: "50%"
						}}></Skeleton>
					}
				</div>
			}
			<div className="blue-orange-comments-render-body">
				<div className="blue-orange-comments-render-body-header">
					<div className="blue-orange-comments-render-body-header-left">
						{!loadingUser &&
							<span
								className="blue-orange-comments-render-body-header-title">{user == undefined || user.name == undefined || user.name == "" ? "Unknown" : user.name}</span>
						}
						{loadingUser &&
							<Skeleton style={{height: "1rem", width: "100%"}}></Skeleton>
						}
						<span className="blue-orange-comments-render-body-header-secondary"> commented <RelativeTime targetDate={comment.created}></RelativeTime> ago</span>
					</div>
					<div className="blue-orange-comments-render-body-header-right">
						{theme == RenderCommentTheme.LARGE && tags.length > 0 &&
							<>
								{tags.map((item, index) => (
									<Badge key={index}>
										<div>{item}</div>
									</Badge>
								))}
							</>
						}
						{editable &&
							<ContextMenu maxHeight={200} items={contextMenuItems} onClick={processContextMenuClick}>
								<ButtonIcon icon={"ri-more-line"} style={moreButtonStyle}></ButtonIcon>
							</ContextMenu>
						}
					</div>
				</div>
				<div className="blue-orange-comments-render-body-cont">
					{!editState &&
						<RenderHtml html={comment.text}></RenderHtml>

					}
					{editState &&
						<RichTextPrompt
							placeholder={"Add comment..."}
							focus={true}
							showClose={true}
							content={comment.text}
							files={comment.files}
							onChange={processChangeData}
							onSend={updateComment}
							onClose={() => setEditState(false)}
							></RichTextPrompt>
					}
				</div>
			</div>
		</div>
	)
}
