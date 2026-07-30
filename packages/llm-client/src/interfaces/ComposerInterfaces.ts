// ---------------------------------------------------------------------------
// Composer configuration.
//
// The composer is a Claude-style prompt box: the message on top, a row of
// controls underneath — a "+" menu on the left (attach a file, pick a tool or a
// skill, highlighted actions like Research) and the model picker, generation
// settings, dictation and send on the right.
//
// Every part of that row is optional and driven from here, so a consumer can
// ship the full set, trim it to a bare textarea, or replace a section with its
// own nodes via `leftSlot` / `rightSlot`.
// ---------------------------------------------------------------------------

import { ReactNode } from 'react';

import { ConfigAgentDto } from './AgentProtocol';

/**
 * One row in the "+" menu. Nest `items` for a submenu (a tool or skill list),
 * set `heading` for a non-clickable section label, and `kind: 'file'` to open
 * the file picker instead of reporting a plain selection.
 */
export interface ComposerMenuItem {
    id: string;
    label: string;
    /** remixicon class, e.g. "ri-attachment-2". */
    icon?: string;
    /** Nested rows — rendered as a submenu. */
    items?: ComposerMenuItem[];
    /** Shows a check mark on the row; use for toggleable entries. */
    checked?: boolean;
    /** Renders as a section heading rather than a clickable row. */
    heading?: boolean;
    /** Draws a separator immediately above this row. */
    separatorBefore?: boolean;
    /** 'file' opens the attachment picker; 'action' (default) just reports the click. */
    kind?: 'file' | 'action';
    /** Arbitrary payload handed back to `onSelect`. */
    value?: any;
}

/**
 * A highlighted mode shown as a pill next to the "+" button — the "Research"
 * treatment. Toggling one is reported through `onQuickAction`; pass `active` to
 * drive the state yourself.
 */
export interface ComposerQuickAction {
    id: string;
    label: string;
    icon?: string;
    /** Controlled on/off state. Omit to let the composer track it. */
    active?: boolean;
    tooltip?: string;
}

export type ComposerSettingValue = boolean | number | string;

export type ComposerSettingValues = Record<string, ComposerSettingValue>;

export interface ComposerSettingOption {
    label: string;
    value: string | number;
}

/** A single control in the generation-settings panel. */
export interface ComposerSetting {
    id: string;
    label: string;
    type: 'toggle' | 'slider' | 'select';
    /** Short explanatory line under the label. */
    description?: string;
    /** slider only */
    min?: number;
    /** slider only */
    max?: number;
    /** slider only */
    step?: number;
    /** select only */
    options?: ComposerSettingOption[];
    defaultValue?: ComposerSettingValue;
    /** Formats a slider value for display; defaults to the raw number. */
    format?: (value: number) => string;
}

export interface ComposerMenuConfig {
    /** Default true when there is at least one row to show. */
    enabled?: boolean;
    icon?: string;
    tooltip?: string;
    /** Fixed menu width in pixels; omit to size to content. */
    width?: number;
    items?: ComposerMenuItem[];
    /** Prepend the built-in "Add photos and files" row (default true). */
    includeAttachFile?: boolean;
    attachLabel?: string;
    /** Fires for any clicked row the composer does not handle itself. */
    onSelect?: (item: ComposerMenuItem) => void;
}

export interface ComposerModelConfig {
    /** Default true when `models` is non-empty. */
    enabled?: boolean;
    models?: ConfigAgentDto[];
    /** Selected model `name`. */
    value?: string;
    onChange?: (model: string) => void;
    /** Group the menu under provider headings (default true). */
    groupByProvider?: boolean;
    /** Append the provider to the selected model in the trigger (default false). */
    showProvider?: boolean;
    /** Trigger label when nothing is selected. */
    placeholder?: string;
    disabled?: boolean;
}

export interface ComposerSettingsConfig {
    /** Default true when there is at least one setting to show. */
    enabled?: boolean;
    icon?: string;
    /** Trigger label; omit for an icon-only button. */
    label?: string;
    /** Panel heading. */
    title?: string;
    /** Controls to render; defaults to `DEFAULT_COMPOSER_SETTINGS`. */
    items?: ComposerSetting[];
    /** Controlled values, keyed by setting id. */
    values?: ComposerSettingValues;
    onChange?: (values: ComposerSettingValues) => void;
}

export interface ComposerVoiceConfig {
    /** Default true — the button hides itself where dictation is unsupported. */
    enabled?: boolean;
    /** BCP-47 language tag, e.g. "en-GB". Defaults to the document language. */
    language?: string;
    /** Keep listening until stopped rather than after one phrase (default true). */
    continuous?: boolean;
    /** Show partial results in the input while speaking (default true). */
    interimResults?: boolean;
    /** Add dictation to the current text (default) or replace it. */
    insert?: 'append' | 'replace';
    /** Hide rather than disable the button where unsupported (default true). */
    hideWhenUnsupported?: boolean;
    onTranscript?: (text: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
}

export interface ComposerAttachmentConfig {
    /** Default true when a media client is configured. */
    enabled?: boolean;
    /** `FileInputWrapper`-style hint: "all" | "image" | "pdf" | "audio" | "video". */
    accept?: string;
    /** Allow picking several files at once (default true). */
    multiple?: boolean;
    /** Rejected above this size, in megabytes. */
    maxSizeMb?: number;
}

/** Everything about how the composer presents itself. */
export interface ComposerConfig {
    placeholder?: string;
    /** Controls on their own row under the message (default) or inline with it. */
    layout?: 'stacked' | 'inline';
    menu?: ComposerMenuConfig;
    quickActions?: ComposerQuickAction[];
    onQuickAction?: (action: ComposerQuickAction, active: boolean) => void;
    model?: ComposerModelConfig;
    settings?: ComposerSettingsConfig;
    voice?: ComposerVoiceConfig;
    attachments?: ComposerAttachmentConfig;
    /** Extra nodes at the end of the left control group. */
    leftSlot?: ReactNode;
    /** Extra nodes before the send button. */
    rightSlot?: ReactNode;
}

/**
 * The built-in generation settings. `thinking` is part of the llm-agent chat
 * contract; `effort` and `temperature` are optional client hints — they are only
 * sent when set, and a server that does not declare them ignores them.
 */
export const DEFAULT_COMPOSER_SETTINGS: ComposerSetting[] = [
    {
        id: 'thinking',
        label: 'Extended thinking',
        type: 'toggle',
        description: 'Stream the model’s reasoning before the answer.',
        defaultValue: false,
    },
    {
        id: 'effort',
        label: 'Reasoning effort',
        type: 'select',
        description: 'How long to think before answering.',
        options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
        ],
        defaultValue: 'medium',
    },
    {
        id: 'temperature',
        label: 'Temperature',
        type: 'slider',
        description: 'Lower is more focused, higher is more varied.',
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.7,
        format: (value: number) => value.toFixed(2),
    },
];

/** Seed a value map from the settings' own defaults. */
export const defaultSettingValues = (settings: ComposerSetting[]): ComposerSettingValues =>
    settings.reduce((values, setting) => {
        if (setting.defaultValue !== undefined) values[setting.id] = setting.defaultValue;
        return values;
    }, {} as ComposerSettingValues);
