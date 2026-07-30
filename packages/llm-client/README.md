# `@blue-orange-ai/foundations-llm-client`

A full **assistant-ui-style** chat experience for the
[`llm-agent`](https://github.com/blue-orange-ai/llm-agent) service, built
entirely from `@blue-orange-ai/foundations-core` components (plus the media
interface from `@blue-orange-ai/foundations-clients`). No third-party chat
framework.

It gives you a complete window out of the box:

- **Sessions / history sidebar** — conversations bucketed by recency (Today,
  Yesterday, Previous 7 days…), with rename, delete and fuzzy filter. Persisted
  in `localStorage` (the agent service is stateless — history is a client
  concern).
- **Centred welcome screen** — logo, greeting and starter-prompt suggestions,
  with the composer in the middle of the screen for a new chat (it docks to the
  bottom once the conversation starts).
- **Streaming thread** that renders every part of a turn the way assistant-ui
  does:
  - **Answer text** as markdown (via core `MarkdownText` — GFM, math, code
    highlighting + copy).
  - **Thinking / reasoning** in a collapsible panel that streams live and
    auto-collapses when the answer begins.
  - **Tool calls / display actions** with a per-type icon, a
    `RUNNING → COMPLETE/ERROR` status and an expandable view of the call
    arguments and result — including provider **built-in tools** (web search,
    code execution).
  - **Media** — user attachments and assistant-generated artefacts, resolved
    and rendered through `BlueOrangeMedia` (inline image / embedded PDF / file
    chip).
- **Claude-style composer** — the message on top, controls on their own row
  underneath: a "+" menu (files, tools, skills, bespoke actions), highlighted
  modes like Research, the model picker, generation settings, dictation and
  send / stop. Every control is optional and configurable — see
  [Composer](#composer).
- **Per-message actions** — copy, regenerate, 👍/👎 feedback, model + token
  usage.
- **Dark mode** via the core `.dark` convention; theme-aware throughout.

## Install

```bash
npm i @blue-orange-ai/foundations-llm-client \
      @blue-orange-ai/foundations-core \
      @blue-orange-ai/foundations-clients
```

The consuming app must load the icon/theme/math stylesheets once:

```ts
import 'remixicon/fonts/remixicon.css';
import 'katex/dist/katex.min.css';
import '@blue-orange-ai/foundations-core/dist/style.css';
import '@blue-orange-ai/foundations-llm-client/dist/style.css';
```

## Usage

```tsx
import { LlmAgentProvider, Assistant } from '@blue-orange-ai/foundations-llm-client';

export const Chat = () => (
    <LlmAgentProvider
        uri="http://localhost:6012"          // llm-agent base URL
        token={bearerToken}                   // passport auth (or rely on cookie)
        media={{ uri: 'http://localhost:8086', folder: 'llm-chat-attachments' }}
        welcome={{
            appName: 'Blue Orange AI',
            title: 'How can I help you today?',
            subtitle: 'Ask anything — I can reason, use tools and work with files.',
        }}
        suggestions={[
            { label: 'Summarise a document I upload', icon: 'ri-file-text-line' },
            { label: 'Write and debug some code', icon: 'ri-code-s-slash-line' },
        ]}
        thinking
    >
        <Assistant />
    </LlmAgentProvider>
);
```

Give the container a height — the assistant fills its parent.

## Composer

```
┌──────────────────────────────────────────────┐
│  Message the assistant…                      │
│                                              │
│  (+)  [Research]        Claude Opus 5 ⌄ ⚙ 🎤 ↑│
└──────────────────────────────────────────────┘
```

Everything in the control row comes from one `ComposerConfig`, passed on the
provider (`composer={…}`) or on `Assistant` (which merges its own over it):

```tsx
<Assistant
    composer={{
        placeholder: 'Message the assistant…',
        // Bottom-left "+" menu. Nested `items` become submenus; `checked` marks a
        // row; `separatorBefore` groups them. The attach-a-file row is built in.
        menu: {
            items: [
                { id: 'skills', label: 'Add skill', icon: 'ri-shapes-line', items: skillRows },
                { id: 'connect', label: 'Connect an app', icon: 'ri-plug-line', separatorBefore: true },
            ],
            onSelect: (item) => handle(item),
        },
        // Highlighted modes, rendered as pills next to the "+".
        quickActions: [{ id: 'research', label: 'Research', icon: 'ri-telescope-line' }],
        // Generation settings panel — declare any controls the deployment supports.
        settings: {
            items: [
                { id: 'thinking', label: 'Extended thinking', type: 'toggle', defaultValue: false },
                { id: 'effort', label: 'Reasoning effort', type: 'select', options: effortOptions },
                { id: 'temperature', label: 'Temperature', type: 'slider', min: 0, max: 1, step: 0.05 },
            ],
        },
        voice: { language: 'en-GB', insert: 'append' },
        attachments: { accept: 'all', multiple: true, maxSizeMb: 25 },
        // Splice in your own nodes anywhere in the row.
        rightSlot: <MyButton />,
    }}
/>
```

Notes:

- **Model picker** — `Assistant` wires it to `GET /config/models` and the session's
  model automatically; grouped under provider headings, with a check on the
  current one. Set `composer.model.enabled: false` to hide it, or pass your own
  `models` / `value` / `onChange`.
- **Tools** — with `autoLoadTools` on the provider, the enabled entries from
  `GET /tools` appear as a checkable "Add tool" submenu and the selection is sent
  as `tool_ids`.
- **Settings** → request: `thinking` maps to the chat contract's own field;
  `effort` and `temperature` are sent as optional hints (a service that does not
  declare them ignores them); any other setting id is forwarded verbatim. Active
  modes are sent as `modes: ["research"]`.
- **Dictation** uses the browser's `SpeechRecognition` — no extra dependency. The
  button hides itself where that API is missing (set
  `voice.hideWhenUnsupported: false` to show it disabled instead).
- `layout: 'inline'` puts everything back on a single row.
- The model picker and thinking toggle used to live in the sidebar footer. They
  are in the composer now; pass `showModelControls` to `Assistant` to bring the
  sidebar pair back as well.
- Surfaces follow core's input treatment — 4px radius, the input background and
  border, a 1.5px focus outline — and the menus are core's own `ContextMenu`, so
  the prompt box sits alongside the rest of the library rather than beside it.

## Local development (simulated backend)

```bash
cd packages/llm-client
npm start
```

The dev workspace stands up a **mock llm-agent and a mock media service** in the
browser (`src/development/mock`), so the whole app is usable with nothing else
running. It intercepts `fetch` for the configured agent/media hosts only — plus
the `XMLHttpRequest` calls `BlueOrangeMedia` makes for uploads — and answers the
same routes with the same content types, so `AgentClient`'s real ndjson framing,
abort handling and event taxonomy are all exercised.

What it simulates:

- `GET /config/models`, `/config/embedders`, `/tools`, `/workflows` — a populated
  model picker and tool registry.
- `POST /chat` — scripted ndjson turns covering markdown (tables, code, math,
  quotes, links), streaming reasoning, every display-action type and status,
  generated image/file media, token usage and a mid-stream provider error.
  The `thinking` flag and selected model really do change the response.
- `POST /workflows/{id}/advance` — a streamed turn plus its terminal `STATE`.
- Media presign + upload — attachments upload with live progress and render in
  the transcript (small files become data URLs, so they survive a reload).
- Seeded conversation history across every sidebar recency bucket.

The dev workspace also configures the composer end to end — a skills submenu, the
auto-loaded tool registry, a Research mode and the settings panel — and the mock
logs each request's model, thinking, effort, temperature, modes and tool ids to
the console, so you can see the controls reach the wire.

The **Mock server** panel (bottom-right) picks which scripted reply comes next,
sets the stream speed (`Slow` is useful for the stop button), reseeds or clears
history, and can switch the app over to the real services on localhost.

None of this ships: `src/development` is not referenced by `src/vite-entry.tsx`.

## Architecture

| Layer | What it does |
|-------|--------------|
| `AgentProtocol` | 1:1 TypeScript mapping of the `llm-agent` wire types (`StreamEvent`, `DisplayAction`, `MediaReference`, `ChatRequest`, …). |
| `AgentClient` | The only transport. Streams `POST /chat` (ndjson), plus model/tool/workflow discovery, with an `abort()` for stop. |
| `StreamAccumulator` | Pure fold of the streamed `TEXT`/`THINKING` deltas + `ACTION`/`MEDIA` events into an ordered list of message *parts*. |
| `useChat` | send / stop / regenerate lifecycle; builds the `history` the stateless server needs each turn. |
| `SessionStore` | `localStorage` persistence + recency bucketing for the history sidebar. |
| `LlmAgentProvider` | Constructs the `AgentClient` + `BlueOrangeMedia` once and exposes them via context hooks (`useAgentClient`, `useMediaClient`, …). |
| `ComposerConfig` | Declarative description of the prompt box's controls — menu rows, modes, model picker, settings, dictation, attachments. |
| `useSpeechRecognition` | Wraps the browser's own `SpeechRecognition` for composer dictation. |

### A note on core's stylesheet

`@blue-orange-ai/foundations-core/dist/style.css` ships the component rules but
not the variable definitions they read (those live in core's dev-only
`index.css`), and `.shadow` / `.no-select` are in the same position. `llm-theme.css`
therefore restates what core's context menus, modals and dropdowns need from the
`--llm-*` tokens, scoped to `.blue-orange-llm` — without it those components
render with missing colours (invisible menu separators, unstyled panels) in any
app that has not copied core's `index.css` verbatim.

Everything is exported, so you can also assemble a bespoke layout from the
building blocks (`Thread`, `SessionSidebar`, `Composer`, `MessageList`,
`ReasoningBlock`, `ActionBlock`, `MediaView`, `ModelPicker`, `Suggestions`).

## Attachments

Files are uploaded through `BlueOrangeMedia` (the required media interface from
the clients package) and referenced by **uuid** in the chat request's
`attachments` — exactly what the server resolves with
`MediaService.download_with_uuid`. Auth is the shared `authorization` cookie.
