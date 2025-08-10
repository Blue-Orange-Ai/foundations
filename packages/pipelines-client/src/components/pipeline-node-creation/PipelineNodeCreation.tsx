import React from "react";

import './PipelineNodeCreation.css'
import {
    Button, ButtonType, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerFooterLeft, DrawerFooterRight,
    DrawerHeader,
    DrawerPosition, Tab, Tabs
} from "@blue-orange-ai/foundations-core";
import {PipelineNodeStyleEditor} from "../pipeline-node-style-editor/PipelineNodeStyleEditor";
import {Node as GraphNode} from "@blue-orange-ai/primitives-graph";

interface Props {
    node: GraphNode,
    onClose: () => void,
    onSave: () => void,
    onNodeChange: (node: GraphNode) => void,
}

export const PipelineNodeCreation: React.FC<Props> = ({node, onClose, onSave, onNodeChange}) => {




    return (
        <Drawer position={DrawerPosition.BOTTOM} height={"calc(100vh - 48px)"}>
            <DrawerHeader label={"Create New Node"} onClose={onClose}></DrawerHeader>
            <DrawerBody>
                <PipelineNodeStyleEditor node={node} onChange={onNodeChange}></PipelineNodeStyleEditor>
            </DrawerBody>
            <DrawerFooter>
                <DrawerFooterLeft>
                    <div className="pipeline-editor-btn-group">
                        <Button text={"Save"} buttonType={ButtonType.PRIMARY} onClick={onSave}></Button>
                    </div>
                </DrawerFooterLeft>
                <DrawerFooterRight>
                    <div className="pipeline-editor-btn-group">
                        <Button text={"Cancel"} buttonType={ButtonType.SECONDARY} onClick={onClose}></Button>
                    </div>
                </DrawerFooterRight>
            </DrawerFooter>
        </Drawer>
    )
}