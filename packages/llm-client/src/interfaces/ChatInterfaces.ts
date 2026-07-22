// ---------------------------------------------------------------------------
// UI-side chat model.
//
// Where `AgentProtocol` is the wire format, this is the shape the components
// render. A message is a list of ordered *parts* (text, reasoning/thinking,
// tool actions, media) — the same content-parts model assistant-ui uses — so a
// single assistant turn can interleave thinking, tool calls and answer text and
// render each with the right widget.
// ---------------------------------------------------------------------------

import {
    ActionStatus,
    DisplayAction,
    DisplayActionType,
    MediaReference,
    Usage,
} from './AgentProtocol';

export type MessageRole = 'user' | 'assistant';

export type MessagePartType = 'text' | 'reasoning' | 'action' | 'media';

/** Streamed answer text (accumulated from TEXT deltas). */
export interface TextPart {
    type: 'text';
    text: string;
}

/** Model reasoning (accumulated from THINKING deltas). Rendered collapsible. */
export interface ReasoningPart {
    type: 'reasoning';
    text: string;
    /** True while THINKING deltas are still arriving. */
    inProgress: boolean;
}

/** A tool call / display action, with its RUNNING -> COMPLETE/ERROR lifecycle. */
export interface ActionPart {
    type: 'action';
    id: string;
    actionType: DisplayActionType;
    title: string;
    detail?: string | null;
    status: ActionStatus;
    toolName?: string | null;
    arguments?: Record<string, any>;
}

/** A media reference emitted by the assistant (generated artefact). */
export interface MediaPart {
    type: 'media';
    media: MediaReference;
}

export type MessagePart = TextPart | ReasoningPart | ActionPart | MediaPart;

/** A user-supplied attachment (already uploaded through BlueOrangeMedia). */
export interface Attachment {
    /** Media UUID — what gets sent to the server in `attachments`. */
    uuid: string;
    mediaId?: number;
    filename: string;
    contentType?: string;
    /** A resolved, displayable URL (thumbnail / download link). */
    url?: string;
    size?: number;
    /** Upload progress 0-100 while the file is being uploaded. */
    progress?: number;
    /** Set when the upload failed. */
    error?: string;
}

export type MessageStatus = 'complete' | 'streaming' | 'error' | 'cancelled';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    parts: MessagePart[];
    /** Attachments the user added to a prompt. */
    attachments?: Attachment[];
    status: MessageStatus;
    createdAt: number;
    provider?: string | null;
    model?: string | null;
    usage?: Usage | null;
    /** In-band error text when status === 'error'. */
    error?: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
    /** Model name selected for this session (server model `name`). */
    model?: string;
    /** Tool ids enabled for this session. */
    toolIds?: string[];
}

/** A starter prompt shown on the empty-state welcome screen. */
export interface Suggestion {
    /** Short label shown on the chip. */
    label: string;
    /** Optional longer prompt sent when clicked (defaults to `label`). */
    prompt?: string;
    /** Optional remixicon class, e.g. "ri-lightbulb-line". */
    icon?: string;
}

/** Branding shown on the centred welcome screen (logo + greeting). */
export interface WelcomeBranding {
    /** Inline SVG markup or an <img> src for the logo. */
    logo?: string;
    /** Whether `logo` is raw SVG markup (true) or an image URL (false). */
    logoIsSvg?: boolean;
    /** Short product name shown in the sidebar header (e.g. "Assistant"). */
    appName?: string;
    /** Large greeting on the welcome screen. */
    title?: string;
    subtitle?: string;
}

// -- Helpers ----------------------------------------------------------------

/** Fold a DisplayAction wire object into an ActionPart. */
export const actionToPart = (action: DisplayAction): ActionPart => ({
    type: 'action',
    id: action.id,
    actionType: action.action_type,
    title: action.title,
    detail: action.detail ?? null,
    status: action.status,
    toolName: action.tool_name ?? null,
    arguments: (action.metadata && action.metadata.arguments) || undefined,
});

/** Concatenate all text parts of a message (used for history + titles). */
export const messageText = (message: ChatMessage): string =>
    message.parts
        .filter((p): p is TextPart => p.type === 'text')
        .map((p) => p.text)
        .join('');
