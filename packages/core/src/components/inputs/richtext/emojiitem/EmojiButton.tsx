import React, {useEffect, useImperativeHandle, useState} from "react";
import {MentionItem} from "../default/RichText";
import {EmojiObj} from "../../emoji/data/UnicodeEmoji";
import Cookies from "js-cookie";


interface Props {
    index: number,
    selectedIndex: number,
    item: EmojiObj,
    command: (item: EmojiObj) => void
}

export const EmojiButton: React.FC<Props> = ({
                                                   index,
                                                   selectedIndex,
                                                   item,
                                                   command}) => {

    const skin_tone = Cookies.get("skinTone")

    const generateClassName = (index: number, selectedIndex: number) => {
        if (index == selectedIndex) {
            return "blue-orange-rich-text-editor-emoji-item blue-orange-rich-text-editor-emoji-item-is-selected"
        }
        return "blue-orange-rich-text-editor-mention-item"
    }

    const [classname, setClassname] = useState(generateClassName(index, selectedIndex));

    useEffect(() => {
        setClassname(generateClassName(index, selectedIndex))
    }, [index, selectedIndex])

    const getEmojiHtml = (emoji: EmojiObj) => {
        var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
        if (!emoji.skin_tone || skin_tone === undefined || +skin_tone == 0) {
            return emoji.html;
        }
        var emojisSplit: string[] = emoji.html.split(";");
        if (emojisSplit.length < 2) {
            return emoji.html + "&#x" + skin_tones[+skin_tone - 1] + ";";
        }
        emojisSplit.splice(1, 0, "&#x" + skin_tones[+skin_tone - 1]);
        return emojisSplit.join(";")
    }

    return (
        <button
            className={classname}
            onClick={() => command(item)}>
            <span className="blue-orange-rich-text-editor-emoji-item-display" dangerouslySetInnerHTML={{ __html: getEmojiHtml(item) }}></span>
            :{item.uuid}:
        </button>
    );

}