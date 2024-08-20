import React, {useContext, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import './Workspace.css'
import {JsonEditor} from "../../components/code/json/JsonEditor";
import {TextEditor} from "../../components/code/text/TextEditor";
import {YamlEditor} from "../../components/code/yaml/YamlEditor";
import {DiffEditor} from "../../components/code/diff/DiffEditor";

interface Props {
}

export const Workspace: React.FC<Props> = ({}) => {


	return (

		<div className="workspace-main-window">
			<div className="workspace-display-window">
				{/*<JsonEditor value={"{}"}></JsonEditor>*/}
				{/*<TextEditor value={"{}"}></TextEditor>*/}
				{/*<YamlEditor value={"Hello: world"}></YamlEditor>*/}
				<DiffEditor original={"{\"hello\": true}"} modified={"{\"hello\": false}"} language={"json"}></DiffEditor>
			</div>

		</div>
	)
}