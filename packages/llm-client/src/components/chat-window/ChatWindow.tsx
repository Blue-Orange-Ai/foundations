import React, {useEffect, useRef, useState} from "react";
import './ChatWindow.css';
import {RenderMessages} from "../rendermessages/RenderMessages";
import {Prompt} from "../prompt/Prompt";
import {IMessage, RenderMessagesHandles} from "../../interfaces/AppInterfaces";
import {v4} from "uuid";

interface Props {
    subPromptText?: string
}
export const ChatWindow: React.FC<Props> = ({subPromptText}) => {

    var chatWindowRef = useRef<HTMLDivElement>(null);

    var messageRef = useRef<RenderMessagesHandles>(null);

    const [followBottom, setFollowBottom] = useState(true);

    const [followBlock, setFollowBlock] = useState(false);

    var followFails = 0;

    const waitForUpdateToComplete = useRef(false);

    const followFailsThreshold: number = 10;
    const handleSend = (message: string) => {
        messageRef.current?.sendMsg(message);
    };

    const handleFollowBlock = (state: boolean) => {
        setFollowBlock(state);
    };

    var messages: Array<IMessage> = [];

    const onWindowScroll = (event: Event) => {
        if (!waitForUpdateToComplete.current) {
            checkScrollPosition();
        }

    }

    const checkScrollPosition = (): void => {
        if (followBlock) {
            setFollowBlock(false);
            followFails = 0;
        } else {
            var elem = chatWindowRef.current as HTMLElement;
            var followState  = Math.abs(elem.scrollTop - (elem.scrollHeight - elem.clientHeight)) < 0.5;
            if (followState) {
                followFails = 0;
            } else {
                followFails = followFails + 1;
            }
            var updateFollowBottom = followState || (followBottom && followFails < followFailsThreshold)
            setFollowBottom(updateFollowBottom);
        }
    }


    useEffect(() => {
        chatWindowRef.current?.addEventListener('scroll', onWindowScroll);
        return () => {
            chatWindowRef.current?.removeEventListener('scroll', onWindowScroll);
        };
    }, []);


    return (
        <div ref={chatWindowRef} className='blue-orange-main-chat-window'>
            <div className='blue-orange-main-chat-window-cont'>
                <RenderMessages ref={messageRef} followBottom={followBottom} setFollowBlock={handleFollowBlock} messages={messages}></RenderMessages>
                <div className='blue-orange-main-chat-prompt'>
                    <Prompt onSend={handleSend}></Prompt>
                    {subPromptText !== undefined
                        && <div
                            className='blue-orange-main-chat-prompt-sub-text'
                            dangerouslySetInnerHTML={{ __html: subPromptText }}></div>}
                    {subPromptText === undefined
                        && <div className='blue-orange-main-chat-prompt-sub-spacer'></div>}
                </div>
            </div>

        </div>
    );
};
