import React, { useCallback, useState } from 'react';
import {
    Button,
    ButtonType,
    ButtonSize,
    ButtonIcon,
    ButtonToggle,
    FileUploadBtn,
    Input,
} from '@blue-orange-ai/foundations-core';
import {
    BlueOrangeMedia,
    GroupPermission,
    Media,
    MediaPermission,
} from '@blue-orange-ai/foundations-clients';
import { IChatBookmark } from '../../interfaces/ChatInterfaces';

import './BookmarksView.css';

type AddMode = 'link' | 'file';

const BOOKMARK_FOLDER = 'chat-bookmarks';
const BOOKMARK_PERMISSIONS: MediaPermission[] = [
    { groupName: 'everyone', permission: GroupPermission.READ },
];

interface Props {
    bookmarks: IChatBookmark[];
    onAddBookmark: (label: string, payload: { url: string } | { media: Media }) => void;
    onRemoveBookmark: (bookmarkId: string) => void;
    onClose: () => void;
}

const mediaInstance = BlueOrangeMedia.getInstance('http://localhost:8086');

export const BookmarksView: React.FC<Props> = ({
    bookmarks,
    onAddBookmark,
    onRemoveBookmark,
    onClose,
}) => {
    const [mode, setMode] = useState<AddMode>('link');
    const [label, setLabel] = useState('');
    const [url, setUrl] = useState('');
    const [media, setMedia] = useState<Media | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const reset = () => {
        setLabel('');
        setUrl('');
        setMedia(null);
        setIsUploading(false);
        setUploadPercent(0);
        setUploadError(null);
    };

    const canSubmit =
        !isUploading &&
        label.trim().length > 0 &&
        (mode === 'link' ? url.trim().length > 0 : media != null);

    const handleAdd = () => {
        if (!canSubmit) return;
        if (mode === 'link') {
            onAddBookmark(label.trim(), { url: url.trim() });
        } else if (media) {
            onAddBookmark(label.trim(), { media });
        }
        reset();
    };

    const handleFileSelect = useCallback((file: File) => {
        setUploadError(null);
        setMedia(null);
        setIsUploading(true);
        setUploadPercent(0);
        setLabel((current) => {
            if (current.trim()) return current;
            const dotIdx = file.name.lastIndexOf('.');
            return dotIdx > 0 ? file.name.slice(0, dotIdx) : file.name;
        });
        mediaInstance
            .uploadFile(file, false, BOOKMARK_FOLDER, BOOKMARK_PERMISSIONS, (pct) =>
                setUploadPercent(pct)
            )
            .then((mediaObject) => {
                setMedia(mediaObject);
                setIsUploading(false);
                setUploadPercent(100);
            })
            .catch((err) => {
                setIsUploading(false);
                setUploadPercent(0);
                setUploadError(err instanceof Error ? err.message : String(err));
            });
    }, []);

    const handleSwitchMode = (next: AddMode) => {
        if (next === mode) return;
        setMode(next);
        setUrl('');
        setMedia(null);
        setIsUploading(false);
        setUploadPercent(0);
        setUploadError(null);
    };

    return (
        <div className="blue-orange-chat-bookmarks-view">
            <div className="blue-orange-chat-bookmarks-header">
                <span className="blue-orange-chat-bookmarks-header-title">Bookmarks</span>
                <ButtonIcon
                    icon="ri-close-line"
                    label="Close bookmarks"
                    onClick={onClose}
                />
            </div>
            <div className="blue-orange-chat-bookmarks-body">
                <div className="blue-orange-chat-bookmarks-add-form">
                    <ButtonToggle
                        size={ButtonSize.SMALL}
                        value={mode}
                        onChange={(v) => handleSwitchMode(v as AddMode)}
                        options={[
                            { value: 'link', label: 'Link', icon: 'ri-link' },
                            { value: 'file', label: 'File', icon: 'ri-attachment-2' },
                        ]}
                    />
                    <div className="blue-orange-chat-bookmarks-add-form-row">
                        <div className="blue-orange-chat-bookmarks-add-field">
                            <Input
                                label="Label"
                                value={label}
                                onChange={setLabel}
                                enterEvent={handleAdd}
                                placeholder="e.g. Design docs"
                            />
                        </div>
                        {mode === 'link' ? (
                            <div className="blue-orange-chat-bookmarks-add-field">
                                <Input
                                    label="URL"
                                    value={url}
                                    onChange={setUrl}
                                    enterEvent={handleAdd}
                                    placeholder="e.g. https://..."
                                />
                            </div>
                        ) : (
                            <div className="blue-orange-chat-bookmarks-add-field">
                                <div className="blue-orange-default-input-label-cont">File</div>
                                <div className="blue-orange-chat-bookmarks-file-picker">
                                    <div className="blue-orange-chat-bookmarks-file-btn">
                                        <FileUploadBtn
                                            accept="*"
                                            label={
                                                isUploading
                                                    ? `Uploading ${Math.round(uploadPercent)}%`
                                                    : 'Choose file'
                                            }
                                            icon={true}
                                            isLoading={isUploading}
                                            onFileSelect={handleFileSelect}
                                        />
                                    </div>
                                    <span
                                        className="blue-orange-chat-bookmarks-file-name"
                                        title={media?.filename ?? ''}
                                    >
                                        {uploadError
                                            ? `Upload failed: ${uploadError}`
                                            : media
                                            ? media.filename
                                            : 'No file selected'}
                                    </span>
                                </div>
                            </div>
                        )}
                        <Button
                            text="Add"
                            buttonType={ButtonType.PRIMARY}
                            size={ButtonSize.SMALL}
                            onClick={handleAdd}
                            isDisabled={!canSubmit}
                        />
                    </div>
                </div>
                <div className="blue-orange-chat-bookmarks-list">
                    {bookmarks.length === 0 ? (
                        <div className="blue-orange-chat-bookmarks-list-empty">
                            No bookmarks yet. Add one above.
                        </div>
                    ) : (
                        bookmarks.map((bm) => {
                            const isFile = !!bm.media;
                            return (
                                <div key={bm.id} className="blue-orange-chat-bookmarks-item">
                                    <i
                                        className={
                                            isFile
                                                ? 'ri-file-line blue-orange-chat-bookmarks-item-icon'
                                                : 'ri-bookmark-fill blue-orange-chat-bookmarks-item-icon'
                                        }
                                    />
                                    <div className="blue-orange-chat-bookmarks-item-info">
                                        <span className="blue-orange-chat-bookmarks-item-label">{bm.label}</span>
                                        <span className="blue-orange-chat-bookmarks-item-url">
                                            {isFile ? bm.media?.filename : bm.url}
                                        </span>
                                    </div>
                                    <ButtonIcon
                                        icon="ri-close-line"
                                        label="Remove bookmark"
                                        onClick={() => onRemoveBookmark(bm.id)}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
