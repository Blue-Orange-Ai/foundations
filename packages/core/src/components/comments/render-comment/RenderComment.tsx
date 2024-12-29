import React, {useEffect, useRef, useState} from "react";

import './RenderComment.css'
import {Avatar} from "../../avatar/avatar/Avatar";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {Badge} from "../../text-decorations/badge/Badge";
import {RenderHtml} from "../../text-decorations/render-html/RenderHtml";
import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../contextmenu/contextmenu/ContextMenu";
import {Comment, CommentType, Media, Sockets, User} from "@blue-orange-ai/foundations-clients";
import blueOrangePassportConfig from "../../config/BlueOrangePassportConfig";
import passport from "../../config/BlueOrangePassportConfig";
import {Skeleton} from "../../loading/skeleton/Skeleton";
import {RichTextPrompt} from "../../inputs/richtext/prompt/RichTextPrompt";
import {v4 as uuidv4} from "uuid";
import commentsInstance from "../../config/BlueOrangeCommentsConfig";

export enum RenderCommentTheme {
	LARGE,
	SMALL
}

interface Props {
	theme?: RenderCommentTheme,
	comment: Comment,
	editor?: string,
	onEditing: (commentId: string) => void
}

export const RenderComment: React.FC<Props> = ({theme=RenderCommentTheme.LARGE, comment, editor, onEditing}) => {

	const [user, setUser] = useState<User | undefined>(undefined)

	const [loadingUser, setLoadingUser] = useState<boolean>(true);

	const [editState, setEditState] = useState<boolean>(false);

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
		return className;
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
				onEditing(comment.id);
			}
		} else if (item.value == "DELETE") {
			deleteComment();
		}
	}

	const getUser = () => {
		passport.get(comment.userId)
			.then(user => {
				setUser(user)
				setLoadingUser(false);
			})
			.catch(reason => {
				setUser(undefined)
				setLoadingUser(false);
			});
	}

	getUser();

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
		commentsInstance.update(editableComment.current).then((result: Comment) => {
			setEditState(false);
		}).catch((reason => console.error(reason)))
	}

	const deleteComment = () => {
		commentsInstance.delete(editableComment.current).then((result: Comment) => {
		}).catch((reason => console.error(reason)))
	}

	useEffect(() => {
		if (editor != comment.id) {
			setEditState(false);
		}
	}, [editor]);


	return (
		<div className={commentClassName}>
			<div className="blue-orange-comments-render-avatar-cont">
				{!loadingUser &&
					<Avatar user={user} height={generateThemeAvatarHeight()} width={generateThemeAvatarHeight()}></Avatar>
				}
				{loadingUser &&
					<Skeleton style={{height: generateThemeAvatarHeight() + "px", width: generateThemeAvatarHeight() + "px", borderRadius: "50%"}}></Skeleton>
				}

			</div>
			<div className="blue-orange-comments-render-body">
				<div className="blue-orange-comments-render-body-header">
					<div className="blue-orange-comments-render-body-header-left">
						{!loadingUser &&
							<span
								className="blue-orange-comments-render-body-header-title">{user == undefined ? "Unknown" : user.name}</span>
						}
						{loadingUser &&
							<Skeleton style={{height: "1rem", width: "100%"}}></Skeleton>
						}

						<span className="blue-orange-comments-render-body-header-secondary"> commented 5 days ago</span>
					</div>
					<div className="blue-orange-comments-render-body-header-right">
						{theme == RenderCommentTheme.LARGE &&
							<Badge>
								<div>Contributor</div>
							</Badge>
						}
						<ContextMenu maxHeight={200} items={contextMenuItems} onClick={processContextMenuClick}>
							<ButtonIcon icon={"ri-more-line"} style={moreButtonStyle}></ButtonIcon>
						</ContextMenu>
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