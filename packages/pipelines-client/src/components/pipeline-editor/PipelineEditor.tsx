import React from "react";

import './PipelineEditor.css'
import {BlueOrangeGraphWrapper} from "@blue-orange-ai/foundations-graph";


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'

interface Props {
}

export const PipelineEditor: React.FC<Props> = ({}) => {


	return (
		<div className="blue-orange-pipeline-editor-cont">
			<BlueOrangeGraphWrapper></BlueOrangeGraphWrapper>
		</div>
	)
}