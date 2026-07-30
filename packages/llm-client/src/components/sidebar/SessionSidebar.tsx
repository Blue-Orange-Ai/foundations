import React, { useState } from 'react';
import {
    Button,
    ButtonType,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalFooterRight,
    ModalHeader,
    SideBar,
    SideBarState,
    SideBarHeader,
    SideBarBody,
    SideBarFooter,
    SideBarBodyGroup,
    SideBarBodyItem,
    SideBarBodyLabel,
    SimpleTooltip,
} from '@blue-orange-ai/foundations-core';

import { ConfigAgentDto } from '../../interfaces/AgentProtocol';
import { ChatSession } from '../../interfaces/ChatInterfaces';
import { bucketForTimestamp, HISTORY_BUCKET_ORDER, HistoryBucket } from '../../services/SessionStore';
import { ModelPicker } from '../model-picker/ModelPicker';
import './SessionSidebar.css';

interface Props {
    sessions: ChatSession[];
    currentSessionId?: string;
    open: boolean;
    onStateChange: (open: boolean) => void;
    onSelect: (sessionId: string) => void;
    onDelete: (sessionId: string) => void;
    onRename: (sessionId: string, title: string) => void;
    onNewChat: () => void;
    brandingTitle?: string;
    brandingLogo?: string;
    brandingLogoIsSvg?: boolean;

    // Footer controls (moved out of the chat window header).
    models: ConfigAgentDto[];
    selectedModel?: string;
    onModelChange: (model: string) => void;
    modelPickerDisabled?: boolean;
    thinkingSupported?: boolean;
    thinking: boolean;
    onToggleThinking: (value: boolean) => void;
    isDark: boolean;
    onToggleTheme: () => void;
}

export const SessionSidebar: React.FC<Props> = ({
    sessions,
    currentSessionId,
    open,
    onStateChange,
    onSelect,
    onDelete,
    onRename,
    onNewChat,
    brandingTitle = 'Assistant',
    brandingLogo,
    brandingLogoIsSvg,
    models,
    selectedModel,
    onModelChange,
    modelPickerDisabled,
    thinkingSupported,
    thinking,
    onToggleThinking,
    isDark,
    onToggleTheme,
}) => {
    // Renaming happens in a modal rather than in place: core's SideBarBodyGroup
    // only renders its own item types, so an inline edit row is dropped from the
    // tree — the conversation would vanish from the list mid-rename.
    const [renaming, setRenaming] = useState<ChatSession | null>(null);
    const [draftTitle, setDraftTitle] = useState('');

    const startEdit = (session: ChatSession) => {
        setRenaming(session);
        setDraftTitle(session.title);
    };

    const commitEdit = () => {
        if (renaming && draftTitle.trim()) {
            onRename(renaming.id, draftTitle.trim());
        }
        setRenaming(null);
    };

    // Bucket sessions by recency, preserving reverse-chronological order within.
    const buckets: Record<HistoryBucket, ChatSession[]> = {
        Today: [],
        Yesterday: [],
        'Previous 7 days': [],
        'Previous 30 days': [],
        Older: [],
    };
    [...sessions]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .forEach((s) => buckets[bucketForTimestamp(s.updatedAt)].push(s));

    const renderItem = (session: ChatSession) => {
        const hoverItems = (
            <div className="blue-orange-llm-session-actions">
                <SimpleTooltip label="Rename">
                    <button
                        type="button"
                        className="blue-orange-llm-session-action"
                        onClick={(e) => {
                            e.stopPropagation();
                            startEdit(session);
                        }}
                    >
                        <i className="ri-pencil-line" />
                    </button>
                </SimpleTooltip>
                <SimpleTooltip label="Delete">
                    <button
                        type="button"
                        className="blue-orange-llm-session-action blue-orange-llm-session-action-danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(session.id);
                        }}
                    >
                        <i className="ri-delete-bin-line" />
                    </button>
                </SimpleTooltip>
            </div>
        );

        return (
            <SideBarBodyItem
                key={session.id}
                label={session.title || 'New chat'}
                sortable={false}
                active={session.id === currentSessionId}
                focused={false}
                hoverEffects
                icon={<i className="ri-chat-1-line" />}
                hoverItems={hoverItems}
                onClick={() => onSelect(session.id)}
            />
        );
    };

    return (
        <div className="blue-orange-llm-sidebar">
            <SideBar
                state={open ? SideBarState.OPEN : SideBarState.CLOSED}
                changeState={(s) => onStateChange(s === SideBarState.OPEN)}
                filter
                resizable
            >
                <SideBarHeader>
                    <div className="blue-orange-llm-sidebar-header">
                        <div className="blue-orange-llm-sidebar-brand">
                            <div className="blue-orange-llm-sidebar-brand-identity">
                                {brandingLogo ? (
                                    brandingLogoIsSvg ? (
                                        <span
                                            className="blue-orange-llm-sidebar-brand-logo"
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={{ __html: brandingLogo }}
                                        />
                                    ) : (
                                        <img
                                            src={brandingLogo}
                                            alt="logo"
                                            className="blue-orange-llm-sidebar-brand-logo-img"
                                        />
                                    )
                                ) : (
                                    <i className="ri-sparkling-2-fill" />
                                )}
                                {open && <span className="blue-orange-llm-sidebar-brand-name">{brandingTitle}</span>}
                            </div>
                            {open && (
                                <SimpleTooltip label="Collapse">
                                    <button
                                        type="button"
                                        className="blue-orange-llm-sidebar-collapse"
                                        onClick={() => onStateChange(false)}
                                    >
                                        <i className="ri-side-bar-line" />
                                    </button>
                                </SimpleTooltip>
                            )}
                        </div>
                        <div className="blue-orange-llm-sidebar-header-buttons">
                            <SimpleTooltip label="New chat">
                                <button
                                    type="button"
                                    className="blue-orange-llm-sidebar-newchat"
                                    onClick={onNewChat}
                                >
                                    <i className="ri-add-line" />
                                    {open && <span>New chat</span>}
                                </button>
                            </SimpleTooltip>
                        </div>
                    </div>
                </SideBarHeader>

                <SideBarBody>
                    {HISTORY_BUCKET_ORDER.filter((b) => buckets[b].length > 0).map((bucket) => (
                        <SideBarBodyGroup key={bucket} opened sortable={false}>
                            <SideBarBodyLabel label={bucket} />
                            {buckets[bucket].map(renderItem)}
                        </SideBarBodyGroup>
                    ))}
                    {sessions.length === 0 && open && (
                        <div className="blue-orange-llm-sidebar-empty">No conversations yet</div>
                    )}
                </SideBarBody>

                <SideBarFooter>
                    <div className="blue-orange-llm-sidebar-footer">
                        {models.length > 0 && (
                            <ModelPicker
                                models={models}
                                value={selectedModel}
                                onChange={onModelChange}
                                disabled={modelPickerDisabled}
                            />
                        )}
                        <div className="blue-orange-llm-sidebar-footer-toggles">
                            {thinkingSupported && (
                                <SimpleTooltip label={thinking ? 'Extended thinking on' : 'Extended thinking off'}>
                                    <button
                                        type="button"
                                        className={`blue-orange-llm-sidebar-footer-btn${
                                            thinking ? ' blue-orange-llm-sidebar-footer-btn-active' : ''
                                        }`}
                                        onClick={() => onToggleThinking(!thinking)}
                                    >
                                        <i className="ri-brain-line" />
                                        {open && <span>Thinking</span>}
                                    </button>
                                </SimpleTooltip>
                            )}
                            <SimpleTooltip label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                                <button
                                    type="button"
                                    className="blue-orange-llm-sidebar-footer-btn"
                                    onClick={onToggleTheme}
                                >
                                    <i className={isDark ? 'ri-sun-line' : 'ri-moon-line'} />
                                    {open && <span>{isDark ? 'Light' : 'Dark'}</span>}
                                </button>
                            </SimpleTooltip>
                        </div>
                    </div>
                </SideBarFooter>
            </SideBar>

            <Modal open={Boolean(renaming)} onClose={() => setRenaming(null)} width={380}>
                <ModalHeader label="Rename conversation" onClose={() => setRenaming(null)} />
                <ModalBody>
                    <Input
                        value={draftTitle}
                        label="Title"
                        placeholder="Conversation title"
                        focus
                        onChange={setDraftTitle}
                        enterEvent={commitEdit}
                    />
                </ModalBody>
                <ModalFooter>
                    <ModalFooterRight>
                        <Button
                            text="Cancel"
                            buttonType={ButtonType.SECONDARY}
                            onClick={() => setRenaming(null)}
                        />
                        <Button
                            text="Rename"
                            buttonType={ButtonType.PRIMARY}
                            isDisabled={draftTitle.trim().length === 0}
                            onClick={commitEdit}
                        />
                    </ModalFooterRight>
                </ModalFooter>
            </Modal>
        </div>
    );
};
