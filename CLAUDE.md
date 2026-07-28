# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Foundations** is a React component library monorepo by Blue Orange AI, published as `@blue-orange-ai/foundations-*` packages to GitHub Packages. It uses Lerna (v8) with npm workspaces for monorepo management, and all packages share a single version (fixed mode, currently in `lerna.json`).

## Git workflow

- **Never commit directly to the `main` branch.**
- When asked to create a branch, create a feature branch off `main` (e.g., `feature/description`).
- When asked to create a PR, target the `main` branch.

## Working with packages

Each package under `packages/` is standalone. Always `cd` into the specific package directory before running commands — each has its own `package.json` with its own scripts.

```bash
cd packages/<package-name>
npm install
npm start              # local dev server (Vite; `npm run dev` is an alias)
npm run build          # production build (vite build && tsc)
npm test               # Vitest + React Testing Library
```

### Cross-repo commands (from root)
```bash
npx lerna run build    # build all packages
npx lerna list -la     # list all packages with versions
npx lerna publish      # version, tag, push, and publish all packages
```

## Architecture

### Monorepo structure

All packages live under `packages/`. There is no root-level source code.

### Package categories

**UI Component packages** (built with Vite, output ESM + UMD):
- **core** — The main component library: accordion, alerts, avatar, breadcrumbs, buttons, charts, comments, context menus, dropdowns, emoji, file system, inputs, layouts (modal, drawer, sidebar, tabs, pages), loading, media, metrics, rules, search, tables, text decorations, tooltips
- **block-editor** — Block-based editor (depends on core, uses primitives-block-editor)
- **graph** — Graph visualization (uses ELK layout, depends on primitives-graph)
- **map** — Map components (depends on primitives-map)
- **code-editors** — Monaco-based code editors
- **llm-client** — LLM chat/interaction UI (depends on core)
- **llm-graph** — Node-based LLM agent workflow (DAG) editor for the `llm-agent` (depends on core + graph)
- **search-client** — Search UI (depends on core + clients)
- **pipelines-client** — Pipeline graph editor (depends on core + graph)
- **passport-client** — Auth/user management UI (depends on core + clients)
- **deployment-manager** — Deployment management UI (depends on core, uses Monaco)

**Non-UI package** (built with plain tsc, output CommonJS):
- **clients** — Shared API client utilities (STOMP/WebSocket, cookies, phone parsing, LRU cache)

### Dependency graph (internal)

`core` is the base UI package. `clients` is the base utility package. Higher-level packages depend on one or both:
- `block-editor` → `core`
- `llm-client` → `core`
- `llm-graph` → `core`, `graph`
- `deployment-manager` → `core`
- `pipelines-client` → `core`, `graph`
- `search-client` → `core`, `clients`
- `passport-client` → `core`, `clients`

### Build system

- Most packages use **Vite** for library builds (`vite.config.js`), producing `dist/index.mjs` (ESM) and `dist/index.umd.js` (UMD), plus `tsc` for type declarations into `dist/types/`
- The `clients` package uses plain `tsc` outputting to `lib/`
- Entry point for Vite packages: `src/vite-entry.tsx` — a barrel file re-exporting all public components
- Dev server, library build, and tests all run on **Vite**: `npm start`/`npm run dev` (Vite dev server, serves each package's root `index.html`), `npm run build` (`vite build && tsc`), `npm test` (Vitest). Monaco packages wire their editor workers via `src/monaco-environment.ts` (imported only by the dev entry, not the library build)
- React 18 **and** 19 are supported — `react`/`react-dom` peer dependencies are `^18.2.0 || ^19.0.0` across all UI packages

### Component conventions

- Components must be **React functional components (FC)** — always prefer FC over class components
- Each component lives in its own directory with a `.tsx` and a corresponding `.css` file that is imported by the component (e.g., `components/buttons/button/Button.tsx` + `Button.css`)
- CSS is plain CSS files (no CSS modules, no CSS-in-JS)
- Components are organized by category under `src/components/`
- Some packages have a `src/development/` directory with a local dev interface for testing components in the browser (`npm start`) — this code is not exported in the library build

### Key libraries used across packages

- **remixicon** for icons
- **tippy.js** for tooltips/popovers
- **chart.js** for charts
- **tiptap** for rich text editing (core)
- **monaco-editor** for code editing (code-editors, pipelines-client, deployment-manager)
- **ELK (elkjs)** for graph layout
- **shiki** for syntax highlighting
- **leaflet** for maps

### Publishing

All packages publish to GitHub Packages registry (`npm.pkg.github.com`) under the `@blue-orange-ai` scope.
