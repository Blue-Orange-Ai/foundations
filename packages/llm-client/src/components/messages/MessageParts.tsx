import React from 'react';

import { MessagePart } from '../../interfaces/ChatInterfaces';
import { MarkdownMessage } from './MarkdownMessage';
import { ReasoningBlock } from './ReasoningBlock';
import { ActionBlock } from './ActionBlock';
import { MediaView } from './MediaView';

interface Props {
    parts: MessagePart[];
}

/** Dispatches each ordered message part to its renderer. */
export const MessageParts: React.FC<Props> = ({ parts }) => (
    <>
        {parts.map((part, index) => {
            switch (part.type) {
                case 'text':
                    return part.text ? <MarkdownMessage key={index} text={part.text} /> : null;
                case 'reasoning':
                    return <ReasoningBlock key={index} part={part} />;
                case 'action':
                    return <ActionBlock key={part.id || index} part={part} />;
                case 'media':
                    return (
                        <div key={index} className="blue-orange-llm-message-media">
                            <MediaView
                                media={{
                                    filename: part.media.filename,
                                    contentType: part.media.content_type,
                                    mediaType: part.media.media_type,
                                    url: part.media.url,
                                    mediaId: part.media.media_id,
                                    size: part.media.size,
                                }}
                            />
                        </div>
                    );
                default:
                    return null;
            }
        })}
    </>
);
