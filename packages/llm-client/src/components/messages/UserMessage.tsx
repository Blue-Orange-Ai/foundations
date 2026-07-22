import React from 'react';

import { ChatMessage, messageText } from '../../interfaces/ChatInterfaces';
import { MediaView } from './MediaView';
import './Message.css';

interface Props {
    message: ChatMessage;
}

export const UserMessage: React.FC<Props> = ({ message }) => {
    const text = messageText(message);
    const attachments = message.attachments || [];

    return (
        <div className="blue-orange-llm-message blue-orange-llm-message-user">
            <div className="blue-orange-llm-user-bubble-wrap">
                {attachments.length > 0 && (
                    <div className="blue-orange-llm-user-attachments">
                        {attachments.map((a) => (
                            <MediaView
                                key={a.uuid}
                                compact
                                media={{
                                    filename: a.filename,
                                    contentType: a.contentType,
                                    url: a.url,
                                    mediaId: a.mediaId,
                                    size: a.size,
                                }}
                            />
                        ))}
                    </div>
                )}
                {text && <div className="blue-orange-llm-user-bubble">{text}</div>}
            </div>
        </div>
    );
};
