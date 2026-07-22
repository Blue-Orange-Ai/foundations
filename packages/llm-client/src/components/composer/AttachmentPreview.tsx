import React from 'react';

import { Attachment } from '../../interfaces/ChatInterfaces';
import './Composer.css';

interface Props {
    attachment: Attachment;
    onRemove: () => void;
}

const iconFor = (contentType?: string): string => {
    if (!contentType) return 'ri-file-3-line';
    if (contentType.startsWith('image/')) return 'ri-image-line';
    if (contentType === 'application/pdf') return 'ri-file-pdf-2-line';
    if (contentType.startsWith('audio/')) return 'ri-music-2-line';
    if (contentType.startsWith('video/')) return 'ri-film-line';
    return 'ri-file-3-line';
};

export const AttachmentPreview: React.FC<Props> = ({ attachment, onRemove }) => {
    const uploading =
        attachment.progress !== undefined && attachment.progress < 100 && !attachment.error;

    return (
        <div
            className={`blue-orange-llm-attach-preview${
                attachment.error ? ' blue-orange-llm-attach-preview-error' : ''
            }`}
        >
            <i className={`${iconFor(attachment.contentType)} blue-orange-llm-attach-icon`} />
            <span className="blue-orange-llm-attach-name">{attachment.filename}</span>

            {uploading && (
                <span className="blue-orange-llm-attach-progress">{Math.round(attachment.progress || 0)}%</span>
            )}
            {attachment.error && <i className="ri-error-warning-line blue-orange-llm-attach-err-icon" />}

            <button type="button" className="blue-orange-llm-attach-remove" onClick={onRemove} aria-label="Remove">
                <i className="ri-close-line" />
            </button>

            {uploading && (
                <div className="blue-orange-llm-attach-bar">
                    <div
                        className="blue-orange-llm-attach-bar-fill"
                        style={{ width: `${attachment.progress || 0}%` }}
                    />
                </div>
            )}
        </div>
    );
};
