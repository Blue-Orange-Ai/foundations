import React, {useRef, useState} from "react";

import './PipelineNodeSettings.css'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {
    CopyInput,
    Dropdown,
    DropdownItemIcon, Input,
    InputForm
} from "@blue-orange-ai/foundations-core";
import {JsonEditor} from "../code/json/JsonEditor";


interface Props {
}

export const PipelineNodeSettings: React.FC<Props> = ({}) => {
    
    const [typeSelection, setTypeSelection] = React.useState<string>();


    return (
        <InputForm verticalMargin={24} paddingBottom={80} paddingTop={20}>
            <CopyInput label="Node Id" value="asldkla;skda;lskd"></CopyInput>
            <Dropdown label={"Node Type"} selection={typeSelection}
                      onSelection={(item) => setTypeSelection(item.reference)}>
                <DropdownItemIcon src={"ri-time-fill"} label={"Ingress - Schedule"} value={"schedule"}
                                  selected={false}></DropdownItemIcon>
                <DropdownItemIcon src={"ri-link"} label={"Ingress - Web Hook | Rest Request"} value={"rest"}
                                  selected={true}></DropdownItemIcon>
                <DropdownItemIcon src={"ri-code-s-slash-line"} label={"Worker - Code"} value={"code"}
                                  selected={false}></DropdownItemIcon>
                <DropdownItemIcon src={"ri-list-check-3"} label={"Rules"} value={"rules"}
                                  selected={false}></DropdownItemIcon>
                <DropdownItemIcon src={"ri-git-fork-line"} label={"List Explosion"} value={"explode"}
                                  selected={false}></DropdownItemIcon>
            </Dropdown>
            {typeSelection == "schedule" &&
                <>
                    <Input label="CRON Schedule" value=""></Input>
                </>
            }
            {typeSelection == "rest" &&
                <>
                    <CopyInput label="Rest Endpoint | POST" value="http://localhost:8080/asldkla;skda;lskd"></CopyInput>
                </>
            }
            <div className="blue-orange-default-input-cont">
                <div className="blue-orange-default-input-label-cont">Expected Input | JSON</div>
                <JsonEditor value={""}></JsonEditor>
            </div>
            <div className="blue-orange-default-input-cont">
                <div className="blue-orange-default-input-label-cont">Expected Output | JSON</div>
                <JsonEditor value={""} disabled={typeSelection == "rest"}></JsonEditor>
            </div>
        </InputForm>
    )
}