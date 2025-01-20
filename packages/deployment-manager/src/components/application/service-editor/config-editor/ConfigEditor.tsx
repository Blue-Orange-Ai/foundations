import React from "react";

import './ConfigEditor.css'
import {JsonEditor} from "../../../code/json/JsonEditor";
import {YamlEditor} from "../../../code/yaml/YamlEditor";
import {TextEditor} from "../../../code/text/TextEditor";

export enum ConfigEditorLang {
	JSON,
	YAML,
	TEXT
}

interface Props {
	value?: string,
	lang?: ConfigEditorLang
}

export const ConfigEditor: React.FC<Props> = ({value="", lang=ConfigEditorLang.TEXT}) => {

	return (
		<div className="blue-orange-deployment-manager-main-cont">
			<div className="blue-orange-deployment-manager-main-history-cont">

			</div>
			<div className="blue-orange-deployment-manager-main-file-editor">
				{lang == ConfigEditorLang.JSON &&
					<JsonEditor value={value}></JsonEditor>
				}
				{lang == ConfigEditorLang.YAML &&
					<YamlEditor value={value}></YamlEditor>
				}
				{lang == ConfigEditorLang.TEXT &&
					<TextEditor value={value}></TextEditor>
				}
			</div>

		</div>
	)
}