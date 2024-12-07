import React from "react";

import './FullPageComments.css'
import {RenderComment} from "../render-comment/RenderComment";
import {AddComment} from "../add-comment/AddComment";

interface Props {
}

export const FullPageComments: React.FC<Props> = ({}) => {

	return (
		<div className="blue-orange-comments-cont">
			<RenderComment></RenderComment>
			<RenderComment></RenderComment>
			<RenderComment></RenderComment>
			<RenderComment></RenderComment>
			<AddComment></AddComment>
		</div>
	)
}