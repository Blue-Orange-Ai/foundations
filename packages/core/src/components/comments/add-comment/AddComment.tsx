import React, {useEffect, useRef, useState} from "react";

import './AddComment.css'
import {Avatar} from "../../avatar/avatar/Avatar";
import {RichText} from "../../inputs/richtext/default/RichText";
import {Button, ButtonType} from "../../buttons/button/Button";
import {Comment, CommentType, Media, User} from "@blue-orange-ai/foundations-clients";
import passport from "../../config/BlueOrangePassportConfig";
import {Skeleton} from "../../loading/skeleton/Skeleton";
import {v4 as uuidv4} from "uuid";
import commentsInstance from "../../config/BlueOrangeCommentsConfig";

interface Props {
	topic: string,
	referenceId: string,
	tags?: Array<string>
}

export const AddComment: React.FC<Props> = ({topic, referenceId, tags=[]}) => {

	const [user, setUser] = useState<User | undefined>(undefined);

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
		setEditableCommentLastSent(uuidv4())
		commentsInstance.create(editableComment.current as Comment).then((result: Comment) => {
		}).catch((reason => console.error(reason)))
	}

	const getUser = () => {
		passport.currentUser()
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
	}, []);

	return (
		<div className="blue-orange-comments-add-cont">
			<div className="blue-orange-comments-add-avatar-cont">
				{!loadingUser &&
					<Avatar user={user} height={38} width={38}></Avatar>
				}
				{loadingUser &&
					<Skeleton style={{height: "38px", width: "38px", borderRadius: "50%"}}></Skeleton>
				}
			</div>
			<div className="blue-orange-comments-add-body">
				<h3 className="blue-orange-comments-add-body-header">Add a Comment</h3>
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