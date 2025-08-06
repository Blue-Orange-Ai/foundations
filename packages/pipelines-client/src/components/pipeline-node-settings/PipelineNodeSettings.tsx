import React, {useRef, useState} from "react";

import './PipelineNodeSettings.css'


import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'
import {
    ColorPicker,
    Dropdown,
    DropdownItemIcon,
    IconSelector,
    Input,
    InputForm,
    RenderHtml
} from "@blue-orange-ai/foundations-core";


interface Props {
}

export const PipelineNodeSettings: React.FC<Props> = ({}) => {
    
    const [typeSelection, setTypeSelection] = React.useState<string>();


    return (
        <InputForm verticalMargin={24} paddingBottom={80}>
            <Dropdown label={"Node Type"} selection={typeSelection} onSelection={(item) => setTypeSelection(item.reference)}>
                <DropdownItemIcon src={"ri-time-fill"} label={"Ingress - Schedule"} value={"schedule"} selected={false}></DropdownItemIcon>
                <DropdownItemIcon src={"ri-link"} label={"Ingress - Web Hook | Rest Request"} value={"rest"} selected={true}></DropdownItemIcon>
                <DropdownItemIcon src={"ri-code-s-slash-line"} label={"Worker - Code"} value={"code"} selected={false}></DropdownItemIcon>
            </Dropdown>

        </InputForm>
    )
}