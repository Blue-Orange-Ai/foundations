import React from "react";

import './AddComment.css'
import {Avatar} from "../../avatar/avatar/Avatar";
import {RichText} from "../../inputs/richtext/default/RichText";
import {Button, ButtonType} from "../../buttons/button/Button";

interface Props {
}

export const AddComment: React.FC<Props> = ({}) => {

	return (
		<div className="blue-orange-comments-add-cont">
			<div className="blue-orange-comments-add-avatar-cont">
				<Avatar user={undefined} height={38} width={38}></Avatar>
			</div>
			<div className="blue-orange-comments-add-body">
				<h3 className="blue-orange-comments-add-body-header">Add a Comment</h3>
				<RichText placeholder={"Add your comment here..."}></RichText>
				<div className="blue-orange-comments-add-btn-group">
					<Button text={"Comment"} buttonType={ButtonType.PRIMARY}></Button>
				</div>
			</div>
		</div>
	)
}