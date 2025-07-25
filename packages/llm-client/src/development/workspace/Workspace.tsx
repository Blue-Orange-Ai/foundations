// @ts-ignore
import React, {useContext, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {PipelineEditor} from "../../components/pipeline-editor/PipelineEditor";
import {QueueManager} from "../../components/queue-manager/QueueManager";
import {ChatWindow} from "../../components/chat-window/ChatWindow";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {


	return (

		<div className="workspace-main-window">
			<ChatWindow></ChatWindow>
		</div>
	)
}