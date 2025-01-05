// @ts-ignore
import React, {useContext, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {PipelineEditor} from "../../components/pipeline-editor/PipelineEditor";
import {QueueManager} from "../../components/queue-manager/QueueManager";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {


	return (

		<div className="workspace-main-window">
			<PipelineEditor></PipelineEditor>
			{/*<QueueManager></QueueManager>*/}
		</div>
	)
}