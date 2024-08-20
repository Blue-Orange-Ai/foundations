import React, {useContext, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {BlueOrangeBlockEditorWrapper} from "../../components/block-editor/BlueOrangeBlockEditorWrapper";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {


	return (

		<div className="workspace-main-window">
			<div className="workspace-display-window">
				<BlueOrangeBlockEditorWrapper></BlueOrangeBlockEditorWrapper>
			</div>

		</div>
	)
}