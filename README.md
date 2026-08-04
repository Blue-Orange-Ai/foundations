# Foundations

A comprehensive React component library monorepo by [Blue Orange AI](https://github.com/Blue-Orange-Ai), published as `@blue-orange-ai/foundations-*` packages to GitHub Packages.

---

## Table of Contents

- [Overview](#overview)
- [Packages](#packages)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Authenticating with GitHub Packages](#authenticating-with-github-packages)
- [Development](#development)
  - [Running a Package Locally](#running-a-package-locally)
  - [Building](#building)
  - [Testing](#testing)
- [Architecture](#architecture)
  - [Monorepo Structure](#monorepo-structure)
  - [Dependency Graph](#dependency-graph)
  - [Build System](#build-system)
  - [Component Conventions](#component-conventions)
- [Publishing](#publishing)
- [Key Libraries](#key-libraries)
- [License](#license)

---

## Overview

Foundations is a modular UI component ecosystem built with **React** (18 & 19 compatible) and **TypeScript**. It uses **Lerna v8** with **npm workspaces** for monorepo management. All packages follow **fixed versioning** — every package shares the same version number, currently managed in `lerna.json`.

The library covers a wide range of UI needs: core components (buttons, inputs, tables, modals), rich text editing, code editors, graph visualization, maps, chat interfaces, search UIs, and more.

---

## Packages

| Package | Description | Type |
|---------|-------------|------|
| **[core](packages/core)** | Main component library — accordion, alerts, avatar, breadcrumbs, buttons, charts, comments, context menus, dropdowns, emoji, file system, inputs, layouts, loading, media, metrics, search, tables, tooltips, and more | UI |
| **[block-editor](packages/block-editor)** | Block-based rich text editor | UI |
| **[chat](packages/chat)** | Chat UI components for messaging interfaces | UI |
| **[code-editors](packages/code-editors)** | Monaco-based code editors | UI |
| **[graph](packages/graph)** | Graph visualization with ELK layout engine | UI |
| **[icons](packages/icons)** | SVG icon set — `<Icon icon="…" />`, per-icon components, sizes and intents | UI |
| **[map](packages/map)** | Map components built on Leaflet | UI |
| **[llm-client](packages/llm-client)** | LLM chat and interaction UI | UI |
| **[search-client](packages/search-client)** | Search interface UI | UI |
| **[pipelines-client](packages/pipelines-client)** | Pipeline graph editor | UI |
| **[passport-client](packages/passport-client)** | Authentication and user management UI | UI |
| **[deployment-manager](packages/deployment-manager)** | Deployment management UI | UI |
| **[clients](packages/clients)** | Shared API client utilities — STOMP/WebSocket, cookies, phone parsing, LRU cache | Non-UI |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **React** >= 18.2.0 (peer dependency for all UI packages)

### Installation

Clone the repository and install all dependencies from the root:

```bash
git clone https://github.com/Blue-Orange-Ai/foundations.git
cd foundations
npm install
```

npm workspaces will automatically link local packages together.

### Authenticating with GitHub Packages

Foundations packages are published to the GitHub Packages npm registry. To install them in your own project, configure your `.npmrc`:

```
@blue-orange-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install any package:

```bash
npm install @blue-orange-ai/foundations-core
npm install @blue-orange-ai/foundations-block-editor
# ... etc.
```

---

## Development

### Running a Package Locally

Each package has its own development server. Navigate into the package directory and start it:

```bash
cd packages/core
npm start
```

This launches a local **Vite** dev server (serving the package's root `index.html`) where you can test components in the browser. `npm run dev` is an alias for `npm start`. Each package has a `src/development/` directory with a local dev interface that is **not** included in the library build.

### Building

Build a single package:

```bash
cd packages/core
npm run build
```

Build all packages at once from the root:

```bash
npx lerna run build
```

UI packages produce:
- `dist/index.mjs` — ESM module
- `dist/index.umd.js` — UMD bundle
- `dist/types/` — TypeScript declarations

The `clients` package produces CommonJS output in `lib/`.

### Testing

Run tests for a specific package:

```bash
cd packages/core
npm test
```

Tests use **Vitest** with **React Testing Library** (jsdom environment). Use `npm test` for a single run or `npm run test:watch` for watch mode.

---

## Architecture

### Monorepo Structure

```
foundations/
├── .github/workflows/      # CI, versioning, release and publish automation
├── lerna.json              # Lerna config (fixed versioning)
├── package.json            # Root workspace config
├── package-lock.json
├── .npmrc                  # Registry configuration
├── CLAUDE.md               # AI assistant guidance
├── LERNA_GUIDE.md          # Lerna workflow documentation
└── packages/
    ├── block-editor/       # Block-based editor
    ├── chat/               # Chat UI
    ├── clients/            # API client utilities (non-UI)
    ├── code-editors/       # Monaco code editors
    ├── core/               # Core component library
    ├── deployment-manager/ # Deployment management UI
    ├── graph/              # Graph visualization
    ├── icons/              # SVG icon set
    ├── llm-client/         # LLM interaction UI
    ├── map/                # Map components
    ├── passport-client/    # Auth/user management UI
    ├── pipelines-client/   # Pipeline graph editor
    └── search-client/      # Search UI
```

Each package contains:
```
packages/<name>/
├── src/
│   ├── components/         # Component source code
│   ├── development/        # Local dev interface (not exported)
│   └── vite-entry.tsx      # Barrel file for library exports
├── dist/                   # Build output
├── package.json
├── tsconfig.json
└── vite.config.js          # Vite build configuration
```

### Dependency Graph

`core` is the base UI package. `clients` is the base utility package. Higher-level packages depend on one or both:

```
                    ┌─────────┐
                    │  core   │
                    └────┬────┘
         ┌───────┬───────┼───────┬──────────┐
         │       │       │       │          │
    block-editor chat  llm    deploy   pipelines
                  │    client  manager   client
                  │                        │
                  │    ┌─────────┐         │
                  ├───►│ clients │         │
                  │    └─────────┘    ┌────┴────┐
             passport    search       │  graph  │
             client      client       └─────────┘
```

- `block-editor` → `core`
- `chat` → `core`, `clients`
- `llm-client` → `core`
- `deployment-manager` → `core`
- `search-client` → `core`, `clients`
- `passport-client` → `core`, `clients`
- `pipelines-client` → `core`, `graph`

### Build System

- **UI packages** use **Vite** end-to-end: dev server (`vite`), library build (`vite build`, producing ESM and UMD output), and tests (**Vitest**), plus `tsc` for type declarations
- The **clients** package uses plain `tsc`, outputting CommonJS to `lib/`
- Entry point for Vite packages is `src/vite-entry.tsx` — a barrel file re-exporting all public components
- Each package has a root `index.html` that loads `src/index.tsx` — this is the Vite dev-server entry. Monaco-based packages wire their editor workers via `src/monaco-environment.ts` (imported only by the dev entry, not the library build)
- **TypeScript** target: ES5, module: ESNext, strict mode enabled

### Component Conventions

- All components are **React functional components (FC)**
- Each component lives in its own directory with a `.tsx` file and a corresponding `.css` file:
  ```
  components/buttons/button/
  ├── Button.tsx
  └── Button.css
  ```
- Styling uses **plain CSS files** (no CSS modules, no CSS-in-JS) — imported directly by the component
- Components are organized by category under `src/components/`

---

## Publishing

All packages are published to the **GitHub Packages** npm registry under the `@blue-orange-ai` scope. Releases are automated by GitHub Actions — see [.github/workflows/README.md](.github/workflows/README.md) for the full flow.

### Releasing from `main`

The bump is taken from the head commit message (with squash merges, the PR title):

| Commit / PR title | Result |
|-------------------|--------|
| `[major] drop React 17 support` | `0.2.0` → `1.0.0` |
| `[minor] add calendar range picker` | `0.2.0` → `0.3.0` |
| `fix dropdown overflow` | `0.2.0` → `0.2.1` |

Each release commits the version bump, creates the `vX.Y.Z` tag, opens a `release/vX.Y.Z` branch at that tag, publishes a GitHub Release, and then builds and publishes every package.

### Patching an older release

Check out the release branch for the version (`release/v0.1.4`), or run the **Open Maintenance Branch from Tag** workflow for tags that have none, and push your fix. The next patch in that line (`v0.1.5`) is cut and published under a `v0.1` dist-tag, leaving `latest` on the newest release:

```bash
npm install @blue-orange-ai/foundations-core@v0.1
```

### Dirty builds

Put `[dirty]` in a commit message on a feature branch to publish a prerelease of every package without merging:

```bash
npm install @blue-orange-ai/foundations-core@dirty
```

### Manual publishing

List all packages and their versions:

```bash
npx lerna list -la
```

Publish all packages (bumps version, tags, pushes, and publishes):

```bash
npx lerna publish
```

Lerna uses **fixed versioning** — all packages are always on the same version. The current version is tracked in `lerna.json`.

For more details on Lerna workflows, see [LERNA_GUIDE.md](LERNA_GUIDE.md).

---

## Key Libraries

| Library | Usage |
|---------|-------|
| [React 18 / 19](https://react.dev) | UI framework (peer dependency, `^18.2.0 \|\| ^19.0.0`) |
| [TypeScript](https://www.typescriptlang.org) | Type safety across all packages |
| [Vite](https://vitejs.dev) | Dev server, library build, and test tooling |
| [Vitest](https://vitest.dev) | Unit testing (with React Testing Library) |
| [Lerna](https://lerna.js.org) | Monorepo management |
| [TipTap](https://tiptap.dev) | Rich text editing (core) |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editing (code-editors, pipelines, deployment-manager) |
| [Chart.js](https://www.chartjs.org) | Charts and data visualization |
| [ELK (elkjs)](https://www.eclipse.org/elk/) | Graph layout engine |
| [Leaflet](https://leafletjs.com) | Interactive maps |
| [Shiki](https://shiki.matsu.io) | Syntax highlighting |
| [Remixicon](https://remixicon.com) | Icon library |
| [Tippy.js](https://atomiks.github.io/tippyjs/) | Tooltips and popovers |
| [KaTeX](https://katex.org) | Math rendering |
| [STOMP / SockJS](https://stomp-js.github.io/) | WebSocket communication (clients) |

---

## License

This project is proprietary to Blue Orange AI. All rights reserved.
