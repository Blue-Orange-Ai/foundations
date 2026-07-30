// ---------------------------------------------------------------------------
// Composer — the prompt box.
//
// Laid out the way Claude's is: the message on top, then a row of controls
// underneath rather than inline with the text. Bottom-left is a "+" menu (attach
// a file, pick a tool or a skill, run a highlighted action like Research);
// bottom-right is the model picker, the generation settings, dictation and send.
//
// Every control is optional and configured through `ComposerConfig`, so a
// consumer can ship all of it, none of it, or splice in their own nodes with
// `leftSlot` / `rightSlot`. Attachments still upload through `BlueOrangeMedia`.
// ---------------------------------------------------------------------------

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SimpleTooltip } from '@blue-orange-ai/foundations-core';

import { Attachment } from '../../interfaces/ChatInterfaces';
import {
    ComposerConfig,
    ComposerMenuItem,
    ComposerQuickAction,
    ComposerSettingValue,
    ComposerSettingValues,
    DEFAULT_COMPOSER_SETTINGS,
    defaultSettingValues,
} from '../../interfaces/ComposerInterfaces';
import { useSpeechRecognition } from '../../services/useSpeechRecognition';
import { useLlmConfig, useMediaClient } from '../providers/LlmAgentProvider';
import { AttachmentPreview } from './AttachmentPreview';
import { ComposerAddMenu } from './ComposerAddMenu';
import { ComposerModelMenu } from './ComposerModelMenu';
import { ComposerSettingsMenu } from './ComposerSettingsMenu';
import './Composer.css';

export interface ComposerProps extends ComposerConfig {
    onSend: (text: string, attachments: Attachment[]) => void;
    onStop?: () => void;
    isRunning: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    /** @deprecated use `placeholder` from ComposerConfig */
    className?: string;
}

interface LocalAttachment extends Attachment {
    localId: string;
}

const MAX_TEXTAREA_HEIGHT = 220;

const ACCEPT_MIME: Record<string, string> = {
    all: '*/*',
    image: 'image/*',
    pdf: 'application/pdf',
    audio: 'audio/*',
    video: 'video/*',
};

export const Composer: React.FC<ComposerProps> = ({
    onSend,
    onStop,
    isRunning,
    autoFocus,
    disabled,
    className,
    placeholder = 'Message the assistant…',
    layout = 'stacked',
    menu,
    quickActions,
    onQuickAction,
    model,
    settings,
    voice,
    attachments: attachmentConfig,
    leftSlot,
    rightSlot,
}) => {
    const media = useMediaClient();
    const config = useLlmConfig();
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [internalSettings, setInternalSettings] = useState<ComposerSettingValues>(() =>
        defaultSettingValues(settings?.items || DEFAULT_COMPOSER_SETTINGS),
    );
    const [internalModes, setInternalModes] = useState<string[]>(() =>
        (quickActions || []).filter((action) => action.active).map((action) => action.id),
    );
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    /** Text present when dictation started, so results can be appended to it. */
    const voiceBaseRef = useRef('');

    // -- Message box -------------------------------------------------------

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

    // -- Attachments -------------------------------------------------------

    const attachmentsEnabled = attachmentConfig?.enabled ?? Boolean(media);
    const accept = attachmentConfig?.accept || 'all';
    const multiple = attachmentConfig?.multiple ?? true;

    const patchAttachment = (localId: string, patch: Partial<LocalAttachment>) => {
        setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, ...patch } : a)));
    };

    const uploadFile = useCallback(
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

            const maxSizeMb = attachmentConfig?.maxSizeMb;
            if (maxSizeMb !== undefined && file.size > maxSizeMb * 1024 * 1024) {
                patchAttachment(localId, { error: `Larger than ${maxSizeMb}MB`, progress: undefined });
                return;
            }
            if (!media) {
                patchAttachment(localId, { error: 'Media service not configured', progress: undefined });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [media, config.media, attachmentConfig?.maxSizeMb],
    );

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        files.forEach(uploadFile);
        // Reset so picking the same file twice still fires a change event.
        event.target.value = '';
    };

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const removeAttachment = (localId: string) => {
        setAttachments((prev) => prev.filter((a) => a.localId !== localId));
    };

    // -- Dictation ---------------------------------------------------------

    const voiceEnabled = voice?.enabled ?? true;
    const speech = useSpeechRecognition({
        language: voice?.language,
        continuous: voice?.continuous ?? true,
        interimResults: voice?.interimResults ?? true,
        onResult: (transcript, isFinal) => {
            const base = voice?.insert === 'replace' ? '' : voiceBaseRef.current;
            const joiner = base && !base.endsWith(' ') ? ' ' : '';
            setText(`${base}${joiner}${transcript}`);
            voice?.onTranscript?.(transcript, isFinal);
        },
        onError: voice?.onError,
    });

    const toggleVoice = () => {
        if (!speech.listening) {
            voiceBaseRef.current = voice?.insert === 'replace' ? '' : text;
            textareaRef.current?.focus();
        }
        speech.toggle();
    };

    // -- Menu --------------------------------------------------------------

    const menuItems = useMemo<ComposerMenuItem[]>(() => {
        const provided = menu?.items || [];
        const includeAttach = (menu?.includeAttachFile ?? true) && attachmentsEnabled;
        if (!includeAttach) return provided;
        const attachItem: ComposerMenuItem = {
            id: 'attach-file',
            label: menu?.attachLabel || 'Add photos and files',
            icon: 'ri-attachment-2',
            kind: 'file',
        };
        return [attachItem, ...provided];
    }, [menu?.items, menu?.includeAttachFile, menu?.attachLabel, attachmentsEnabled]);

    const menuEnabled = (menu?.enabled ?? true) && menuItems.length > 0;

    const handleMenuSelect = (item: ComposerMenuItem) => {
        if (item.kind === 'file') {
            openFilePicker();
            return;
        }
        menu?.onSelect?.(item);
    };

    // -- Quick actions -----------------------------------------------------

    const isModeActive = (action: ComposerQuickAction): boolean =>
        action.active !== undefined ? action.active : internalModes.includes(action.id);

    const toggleMode = (action: ComposerQuickAction) => {
        const next = !isModeActive(action);
        if (action.active === undefined) {
            setInternalModes((prev) =>
                next ? [...prev, action.id] : prev.filter((id) => id !== action.id),
            );
        }
        onQuickAction?.(action, next);
    };

    // -- Settings ----------------------------------------------------------

    const settingItems = settings?.items || DEFAULT_COMPOSER_SETTINGS;
    const settingValues = settings?.values || internalSettings;
    const settingsEnabled = (settings?.enabled ?? true) && settingItems.length > 0;

    const handleSettingChange = (id: string, value: ComposerSettingValue) => {
        const next = { ...settingValues, [id]: value };
        if (!settings?.values) setInternalSettings(next);
        settings?.onChange?.(next);
    };

    // -- Send --------------------------------------------------------------

    const uploading = attachments.some((a) => a.progress !== undefined && a.progress < 100 && !a.error);
    const canSend = (text.trim().length > 0 || attachments.some((a) => a.uuid)) && !uploading && !disabled;

    const submit = () => {
        if (isRunning || !canSend) return;
        if (speech.listening) speech.stop();
        const ready = attachments
            .filter((a) => a.uuid && !a.error)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ localId, ...rest }) => rest as Attachment);
        onSend(text.trim(), ready);
        setText('');
        setAttachments([]);
        voiceBaseRef.current = '';
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    };

    // -- Render ------------------------------------------------------------

    const showVoice =
        voiceEnabled && (speech.supported || (voice?.hideWhenUnsupported ?? true) === false);

    const voiceLabel = !speech.supported
        ? 'Dictation is not supported in this browser'
        : speech.error
        ? `Dictation unavailable: ${speech.error}`
        : speech.listening
        ? 'Stop dictation'
        : 'Dictate a message';

    const sendButton = isRunning ? (
        <SimpleTooltip label="Stop">
            <button
                type="button"
                className="blue-orange-llm-composer-send blue-orange-llm-composer-stop"
                onClick={onStop}
                aria-label="Stop"
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
            <i className="ri-arrow-up-line" />
        </button>
    );

    const leftControls = (
        <div className="blue-orange-llm-composer-controls-left">
            {menuEnabled && (
                <ComposerAddMenu
                    items={menuItems}
                    onSelect={handleMenuSelect}
                    icon={menu?.icon}
                    tooltip={menu?.tooltip}
                    width={menu?.width}
                    disabled={disabled}
                />
            )}
            {(quickActions || []).map((action) => (
                <SimpleTooltip key={action.id} label={action.tooltip || action.label}>
                    <button
                        type="button"
                        className={`blue-orange-llm-composer-pill${
                            isModeActive(action) ? ' blue-orange-llm-composer-pill-active' : ''
                        }`}
                        onClick={() => toggleMode(action)}
                        disabled={disabled}
                        aria-pressed={isModeActive(action)}
                    >
                        {action.icon && <i className={action.icon} />}
                        <span>{action.label}</span>
                    </button>
                </SimpleTooltip>
            ))}
            {leftSlot}
        </div>
    );

    const rightControls = (
        <div className="blue-orange-llm-composer-controls-right">
            {(model?.enabled ?? Boolean(model?.models?.length)) && (
                <ComposerModelMenu
                    models={model?.models || []}
                    value={model?.value}
                    onChange={(next) => model?.onChange?.(next)}
                    groupByProvider={model?.groupByProvider}
                    showProvider={model?.showProvider}
                    placeholder={model?.placeholder}
                    disabled={model?.disabled || disabled}
                />
            )}
            {settingsEnabled && (
                <ComposerSettingsMenu
                    items={settingItems}
                    values={settingValues}
                    onChange={handleSettingChange}
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    icon={settings?.icon}
                    label={settings?.label}
                    title={settings?.title}
                    disabled={disabled}
                />
            )}
            {showVoice && (
                // Core's SimpleTooltip binds its content once, so the key remounts
                // it when the state (and therefore the label) changes.
                <SimpleTooltip key={voiceLabel} label={voiceLabel}>
                    <button
                        type="button"
                        className={`blue-orange-llm-composer-icon-btn${
                            speech.listening ? ' blue-orange-llm-composer-icon-btn-live' : ''
                        }`}
                        onClick={toggleVoice}
                        disabled={disabled || !speech.supported}
                        aria-label="Dictate a message"
                        aria-pressed={speech.listening}
                    >
                        <i className={speech.listening ? 'ri-mic-fill' : 'ri-mic-line'} />
                    </button>
                </SimpleTooltip>
            )}
            {rightSlot}
            {sendButton}
        </div>
    );

    const textbox = (
        <textarea
            ref={textareaRef}
            className="blue-orange-llm-composer-textarea"
            value={text}
            placeholder={speech.listening ? 'Listening…' : placeholder}
            rows={1}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );

    return (
        <div
            className={`blue-orange-llm-composer blue-orange-llm-composer-${layout}${
                className ? ` ${className}` : ''
            }`}
        >
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

            {layout === 'inline' ? (
                // Everything on one line — the pre-stacked arrangement, kept for
                // consumers who want a single-row prompt box.
                <div className="blue-orange-llm-composer-row">
                    {leftControls}
                    {textbox}
                    {rightControls}
                </div>
            ) : (
                <>
                    <div className="blue-orange-llm-composer-message">{textbox}</div>
                    <div className="blue-orange-llm-composer-controls">
                        {leftControls}
                        {rightControls}
                    </div>
                </>
            )}

            {attachmentsEnabled && (
                <input
                    type="file"
                    ref={fileInputRef}
                    className="blue-orange-llm-composer-file-input"
                    accept={ACCEPT_MIME[accept.toLowerCase()] || accept}
                    multiple={multiple}
                    onChange={handleFileInputChange}
                />
            )}
        </div>
    );
};
