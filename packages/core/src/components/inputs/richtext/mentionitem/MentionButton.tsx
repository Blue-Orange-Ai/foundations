import React, {useEffect, useImperativeHandle, useState} from "react";
import {MentionItem} from "../default/RichText";


interface Props {
    index: number,
    selectedIndex: number,
    item: MentionItem,
    command: (item: MentionItem) => void
}

export const MentionButton: React.FC<Props> = ({
                                                   index,
                                                   selectedIndex,
                                                   item,
                                                   command}) => {

    const generateClassName = (index: number, selectedIndex: number) => {
        if (index == selectedIndex) {
            return "blue-orange-rich-text-editor-mention-item blue-orange-rich-text-editor-mention-item-is-selected"
        }
        return "blue-orange-rich-text-editor-mention-item"
    }

    const [classname, setClassname] = useState(generateClassName(index, selectedIndex));

    useEffect(() => {
        setClassname(generateClassName(index, selectedIndex))
    }, [index, selectedIndex])

    return (
        <button
            className={classname}
            onClick={() => command(item)}>
            {item.label}
        </button>
    );

}