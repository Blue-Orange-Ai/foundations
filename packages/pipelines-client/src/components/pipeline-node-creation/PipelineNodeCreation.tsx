import React from "react";

import './PipelineNodeCreation.css'
import {
    Button, ButtonType, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerFooterLeft,
    DrawerHeader,
    DrawerPosition, Tab, Tabs
} from "@blue-orange-ai/foundations-core";
import {PipelineNodeStyleEditor} from "../pipeline-node-style-editor/PipelineNodeStyleEditor";
import {Node as GraphNode} from "@blue-orange-ai/primitives-graph";
import {PipelineNodeSettings} from "../pipeline-node-settings/PipelineNodeSettings";

interface Props {
    node: GraphNode,
    onClose: () => void,
    onNodeChange: (node: GraphNode) => void,
}

export const PipelineNodeCreation: React.FC<Props> = ({node, onClose, onNodeChange}) => {




    return (
        <Drawer position={DrawerPosition.BOTTOM} height={"calc(100vh - 48px)"}>
            <DrawerHeader label={"Create New Node"} onClose={onClose}></DrawerHeader>
            <DrawerBody>
                <Tabs activeTab="settings-tab">
                    <Tab uuid={"usage-tab"} name={"Usage"}>
                        <div>Hello World Usage</div>
                    </Tab>
                    <Tab uuid={"style-tab"} name={"Style"}>
                        <PipelineNodeStyleEditor node={node} onChange={onNodeChange}></PipelineNodeStyleEditor>
                    </Tab>
                    <Tab uuid={"settings-tab"} name={"Settings"}>
                        <PipelineNodeSettings></PipelineNodeSettings>
                    </Tab>
                </Tabs>
            </DrawerBody>
            <DrawerFooter>
                <DrawerFooterLeft>
                    <div className="pipeline-editor-btn-group">
                        <Button text={"Save"} buttonType={ButtonType.PRIMARY}></Button>
                    </div>
                </DrawerFooterLeft>
            </DrawerFooter>
            {/*<DrawerBody>*/}
            {/*    <PipelineNodeStyleEditor node={focusNode} onChange={setFocusNode}></PipelineNodeStyleEditor>*/}
            {/*</DrawerBody>*/}
            {/*<DrawerFooter>*/}
            {/*    <DrawerFooterLeft>*/}
            {/*        <div className="pipeline-editor-btn-group">*/}
            {/*            <Button text={"Save"} buttonType={ButtonType.PRIMARY} onClick={saveNodeStyleUpdate}></Button>*/}
            {/*        </div>*/}
            {/*    </DrawerFooterLeft>*/}
            {/*</DrawerFooter>*/}
        </Drawer>
    )
}