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
- **Attachment-capable composer** — autogrowing input, drag-free attach button,
  live upload progress, send / stop.
- **Per-message actions** — copy, regenerate, 👍/👎 feedback, model + token
  usage.
- **Model picker** (from `GET /config/models`) and an **extended-thinking**
  toggle.
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

## Architecture

| Layer | What it does |
|-------|--------------|
| `AgentProtocol` | 1:1 TypeScript mapping of the `llm-agent` wire types (`StreamEvent`, `DisplayAction`, `MediaReference`, `ChatRequest`, …). |
| `AgentClient` | The only transport. Streams `POST /chat` (ndjson), plus model/tool/workflow discovery, with an `abort()` for stop. |
| `StreamAccumulator` | Pure fold of the streamed `TEXT`/`THINKING` deltas + `ACTION`/`MEDIA` events into an ordered list of message *parts*. |
| `useChat` | send / stop / regenerate lifecycle; builds the `history` the stateless server needs each turn. |
| `SessionStore` | `localStorage` persistence + recency bucketing for the history sidebar. |
| `LlmAgentProvider` | Constructs the `AgentClient` + `BlueOrangeMedia` once and exposes them via context hooks (`useAgentClient`, `useMediaClient`, …). |

Everything is exported, so you can also assemble a bespoke layout from the
building blocks (`Thread`, `SessionSidebar`, `Composer`, `MessageList`,
`ReasoningBlock`, `ActionBlock`, `MediaView`, `ModelPicker`, `Suggestions`).

## Attachments

Files are uploaded through `BlueOrangeMedia` (the required media interface from
the clients package) and referenced by **uuid** in the chat request's
`attachments` — exactly what the server resolves with
`MediaService.download_with_uuid`. Auth is the shared `authorization` cookie.
