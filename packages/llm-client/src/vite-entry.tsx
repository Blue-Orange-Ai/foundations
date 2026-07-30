// Public API of @blue-orange-ai/foundations-llm-client.
//
// A full assistant-ui-style chat experience for the llm-agent service: a
// sessions/history sidebar, a streaming thread with thinking, tool actions and
// media, a welcome screen with suggestions, and an attachment-capable composer.

// Provider + hooks -----------------------------------------------------------
export * from './components/providers/LlmAgentProvider';

// Top-level experience -------------------------------------------------------
export * from './components/assistant/Assistant';

// Composed building blocks (for bespoke layouts) -----------------------------
export * from './components/thread/Thread';
export * from './components/thread/ThreadWelcome';
export * from './components/sidebar/SessionSidebar';
export * from './components/composer/Composer';
export * from './components/composer/ComposerAddMenu';
export * from './components/composer/ComposerModelMenu';
export * from './components/composer/ComposerSettingsMenu';
export * from './components/composer/ComposerPopover';
export * from './components/composer/AttachmentPreview';
export * from './components/suggestions/Suggestions';
export * from './components/model-picker/ModelPicker';

// Message rendering ----------------------------------------------------------
export * from './components/messages/MessageList';
export * from './components/messages/UserMessage';
export * from './components/messages/AssistantMessage';
export * from './components/messages/MessageParts';
export * from './components/messages/MarkdownMessage';
export * from './components/messages/ReasoningBlock';
export * from './components/messages/ActionBlock';
export * from './components/messages/MediaView';

// Services -------------------------------------------------------------------
export * from './services/AgentClient';
export * from './services/SessionStore';
export * from './services/StreamAccumulator';
export * from './services/useChat';
export * from './services/useSpeechRecognition';

// Types ----------------------------------------------------------------------
export * from './interfaces/AgentProtocol';
export * from './interfaces/ChatInterfaces';
export * from './interfaces/ComposerInterfaces';
