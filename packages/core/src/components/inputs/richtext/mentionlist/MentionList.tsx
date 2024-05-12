import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {MentionItem} from "../default/RichText";
import {MentionButton} from "../mentionitem/MentionButton";


interface Props {
    items: Array<MentionItem>,
    command: (item: MentionItem) => void
}

export const MentionList: React.FC<Props> = forwardRef(({
                                              items,
                                              command}, ref) => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedIndexRef = useRef(selectedIndex);

    const selectItem = (index: number) => {
        const item = items[index]

        if (item) {
            command(item)
        }
    }

    const upHandler = () => {
        var targetIndex = (selectedIndexRef.current - 1) % items.length;
        selectedIndexRef.current = targetIndex;
        setSelectedIndex(targetIndex)
    }

    const downHandler = () => {
        var targetIndex = (selectedIndexRef.current + 1) % items.length;
        selectedIndexRef.current = targetIndex;
        setSelectedIndex(targetIndex);
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    useEffect(() => {
        selectedIndexRef.current = selectedIndex;
    }, [selectedIndex]);

    return (
        <div className="blue-orange-rich-text-editor-mention-items">
            {items.map((item, index) => (
                <MentionButton key={index} index={index} selectedIndex={selectedIndexRef.current} item={item} command={command}></MentionButton>
            ))}
        </div>
    );

});