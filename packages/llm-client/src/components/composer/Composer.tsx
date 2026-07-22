import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileInputWrapper, SimpleTooltip } from '@blue-orange-ai/foundations-core';

import { Attachment } from '../../interfaces/ChatInterfaces';
import { useLlmConfig, useMediaClient } from '../providers/LlmAgentProvider';
import { AttachmentPreview } from './AttachmentPreview';
import './Composer.css';

interface Props {
    onSend: (text: string, attachments: Attachment[]) => void;
    onStop?: () => void;
    isRunning: boolean;
    placeholder?: string;
    /** Rendered above the composer (e.g. suggestions on the welcome screen). */
    autoFocus?: boolean;
    disabled?: boolean;
}

interface LocalAttachment extends Attachment {
    localId: string;
}

const MAX_TEXTAREA_HEIGHT = 220;

export const Composer: React.FC<Props> = ({
    onSend,
    onStop,
    isRunning,
    placeholder = 'Message the assistant…',
    autoFocus,
    disabled,
}) => {
    const media = useMediaClient();
    const config = useLlmConfig();
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const autosize = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }, []);

    useEffect(() => {
        autosize();
    }, [text, autosize]);

    useEffect(() => {
        if (autoFocus) textareaRef.current?.focus();
    }, [autoFocus]);

    const patchAttachment = (localId: string, patch: Partial<LocalAttachment>) => {
        setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, ...patch } : a)));
    };

    const handleFileSelect = useCallback(
        (file: File) => {
            const localId = uuidv4();
            const placeholderAtt: LocalAttachment = {
                localId,
                uuid: '',
                filename: file.name,
                contentType: file.type,
                size: file.size,
                progress: 0,
            };
            setAttachments((prev) => [...prev, placeholderAtt]);

            if (!media) {
                patchAttachment(localId, { error: 'Media service not configured' });
                return;
            }

            media
                .uploadFile(
                    file,
                    config.media?.public ?? false,
                    config.media?.folder || 'llm-chat-attachments',
                    config.media?.permissions || [],
                    (pct: number) => patchAttachment(localId, { progress: pct }),
                )
                .then((uploaded) => {
                    patchAttachment(localId, {
                        uuid: uploaded.uuid,
                        mediaId: uploaded.id,
                        url: uploaded.url,
                        progress: 100,
                    });
                })
                .catch(() => {
                    patchAttachment(localId, { error: 'Upload failed', progress: undefined });
                });
        },
        [media, config.media],
    );

    const removeAttachment = (localId: string) => {
        setAttachments((prev) => prev.filter((a) => a.localId !== localId));
    };

    const uploading = attachments.some((a) => a.progress !== undefined && a.progress < 100 && !a.error);
    const canSend = (text.trim().length > 0 || attachments.some((a) => a.uuid)) && !uploading && !disabled;

    const submit = () => {
        if (isRunning || !canSend) return;
        const ready = attachments
            .filter((a) => a.uuid && !a.error)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ localId, ...rest }) => rest as Attachment);
        onSend(text.trim(), ready);
        setText('');
        setAttachments([]);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    };

    return (
        <div className="blue-orange-llm-composer">
            {attachments.length > 0 && (
                <div className="blue-orange-llm-composer-attachments">
                    {attachments.map((a) => (
                        <AttachmentPreview
                            key={a.localId}
                            attachment={a}
                            onRemove={() => removeAttachment(a.localId)}
                        />
                    ))}
                </div>
            )}

            <div className="blue-orange-llm-composer-row">
                {media && (
                    <FileInputWrapper accept="all" onFileSelect={handleFileSelect}>
                        <SimpleTooltip label="Attach file">
                            <button type="button" className="blue-orange-llm-composer-attach" disabled={disabled}>
                                <i className="ri-attachment-2" />
                            </button>
                        </SimpleTooltip>
                    </FileInputWrapper>
                )}

                <textarea
                    ref={textareaRef}
                    className="blue-orange-llm-composer-textarea"
                    value={text}
                    placeholder={placeholder}
                    rows={1}
                    disabled={disabled}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {isRunning ? (
                    <SimpleTooltip label="Stop">
                        <button
                            type="button"
                            className="blue-orange-llm-composer-send blue-orange-llm-composer-stop"
                            onClick={onStop}
                        >
                            <i className="ri-stop-fill" />
                        </button>
                    </SimpleTooltip>
                ) : (
                    <button
                        type="button"
                        className={`blue-orange-llm-composer-send${
                            canSend ? ' blue-orange-llm-composer-send-active' : ''
                        }`}
                        onClick={submit}
                        disabled={!canSend}
                        aria-label="Send"
                    >
                        <i className="ri-send-plane-2-fill" />
                    </button>
                )}
            </div>
        </div>
    );
};
