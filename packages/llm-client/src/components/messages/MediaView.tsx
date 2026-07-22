import React, { useEffect, useState } from 'react';
import { Image, Pdf } from '@blue-orange-ai/foundations-core';

import { useMediaClient } from '../providers/LlmAgentProvider';
import './MediaView.css';

export interface MediaViewData {
    filename?: string | null;
    contentType?: string | null;
    mediaType?: string | null;
    url?: string | null;
    mediaId?: number | null;
    size?: number | null;
}

interface Props {
    media: MediaViewData;
    /** Rendered pixel height for images (drives fragment selection). */
    height?: number;
    compact?: boolean;
}

const isImage = (m: MediaViewData): boolean =>
    (m.mediaType || '').toUpperCase() === 'IMAGE' || (m.contentType || '').startsWith('image/');

const isPdf = (m: MediaViewData): boolean =>
    (m.mediaType || '').toUpperCase() === 'PDF' || m.contentType === 'application/pdf';

const humanSize = (bytes?: number | null): string => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Resolves a media reference to a displayable URL through `BlueOrangeMedia`
 * (the required media interface from the clients package) and renders it —
 * inline image, embedded PDF, or a download chip for everything else.
 */
export const MediaView: React.FC<Props> = ({ media, height = 240, compact }) => {
    const mediaClient = useMediaClient();
    const [url, setUrl] = useState<string | undefined>(media.url || undefined);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        if (media.url) {
            setUrl(media.url);
            return;
        }
        if (mediaClient && media.mediaId != null) {
            mediaClient
                .getUrlFromMediaId(media.mediaId, 60, isImage(media) ? height : undefined)
                .then((resolved) => {
                    if (!cancelled) setUrl(resolved);
                })
                .catch(() => {
                    if (!cancelled) setFailed(true);
                });
        }
        return () => {
            cancelled = true;
        };
    }, [media, mediaClient, height]);

    const name = media.filename || 'attachment';

    if (isImage(media) && url && !failed) {
        return (
            <a href={url} target="_blank" rel="noreferrer" className="blue-orange-llm-media-image-link">
                <Image src={url} alt={name} height={compact ? 64 : height} borderRadius="8px" fit="cover" />
            </a>
        );
    }

    if (isPdf(media) && url && !compact) {
        return (
            <div className="blue-orange-llm-media-pdf">
                <Pdf src={url} />
            </div>
        );
    }

    // Fallback: a file chip (also used while a URL is still resolving).
    const icon = isImage(media)
        ? 'ri-image-line'
        : isPdf(media)
        ? 'ri-file-pdf-2-line'
        : (media.contentType || '').startsWith('audio/')
        ? 'ri-music-2-line'
        : (media.contentType || '').startsWith('video/')
        ? 'ri-film-line'
        : 'ri-file-3-line';

    const chip = (
        <div className="blue-orange-llm-media-chip">
            <i className={`${icon} blue-orange-llm-media-chip-icon`} />
            <div className="blue-orange-llm-media-chip-meta">
                <span className="blue-orange-llm-media-chip-name">{name}</span>
                {media.size ? (
                    <span className="blue-orange-llm-media-chip-size">{humanSize(media.size)}</span>
                ) : null}
            </div>
            {url && <i className="ri-download-line blue-orange-llm-media-chip-dl" />}
        </div>
    );

    return url ? (
        <a href={url} target="_blank" rel="noreferrer" className="blue-orange-llm-media-chip-link">
            {chip}
        </a>
    ) : (
        chip
    );
};
