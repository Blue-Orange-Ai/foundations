# @blue-orange-ai/foundations-pdf-viewer

A fully-featured, headless-powered PDF viewer for the Foundations component
library. It wraps the [EmbedPDF](https://www.embedpdf.com) engine and plugins
(`@embedpdf/*`) in **headless mode** and renders all of its chrome — toolbar,
thumbnails, search, outline, dialogs — using components from
[`@blue-orange-ai/foundations-core`](../core).

Everything is exposed to the parent through **props**, **callbacks**, and an
**imperative handle** (`PdfViewerApi`).

## Install

```bash
npm install @blue-orange-ai/foundations-pdf-viewer
```

`react` (>= 18) is a peer dependency. The PDFium WebAssembly binary and font
fallbacks are fetched from the jsDelivr CDN by default; override with the
`wasmUrl` prop to self-host.

## Usage

```tsx
import { useRef } from 'react';
import { PdfViewer, PdfViewerApi } from '@blue-orange-ai/foundations-pdf-viewer';

function Example() {
  const ref = useRef<PdfViewerApi>(null);

  return (
    <div style={{ height: '80vh' }}>
      <PdfViewer
        ref={ref}
        src="https://example.com/document.pdf"
        initialZoom="fit-width"
        onPageChange={(page, total) => console.log(page, total)}
        onTextSelected={(sel) => {
          // Everything the user has highlighted:
          console.log(sel.text, sel.pages, sel.rects, sel.boundingRects);
        }}
      />
      {/* Drive the viewer imperatively */}
      <button onClick={() => ref.current?.goToPage(3)}>Go to page 3</button>
      <button onClick={() => ref.current?.highlightSelection('#FFEB3B')}>Highlight</button>
    </div>
  );
}
```

## Features

| Area | Details |
| --- | --- |
| **Rendering** | Virtualized scrolling, tiled hi-res rendering, single/double page spreads, vertical/horizontal scroll |
| **View controls** | Page navigation, zoom (in/out, fit-width, fit-page, absolute), rotation, pan, fullscreen |
| **Selection** | Text selection with full callbacks (`onSelectionChange`, `onTextSelected`) returning text, page references and geometry |
| **Annotations** | Highlight, underline, ink/draw, free text — create/select/delete, change events |
| **Forms** | Fill in PDF form fields, read/write values, change events |
| **Signatures** | Draw or type a signature and place it on a page |
| **Search** | Full-text search with result navigation and highlighting |
| **Thumbnails** | Thumbnail strip with click-to-navigate and **drag-and-drop page reordering** |
| **Outline** | Document bookmarks / table of contents navigation |
| **History** | Undo / redo for edits |
| **Output** | Download the (modified) document, print, or read the raw bytes |

Every feature can be toggled off through a `enable*` / `show*` prop.

## Controlled vs uncontrolled

View state can be set once (`initialPage`, `initialZoom`, `initialRotation`,
`initialSpread`) or fully controlled (`page`, `zoom`, `rotation`, `spread`) —
the viewer follows changes to the controlled props.

## Imperative API (`PdfViewerApi`)

Obtain it from a `ref` or the `onReady` callback. Highlights:

- **Navigation** — `goToPage`, `nextPage`, `previousPage`, `getCurrentPage`, `getPageCount`
- **Zoom / layout** — `setZoom`, `zoomIn`, `zoomOut`, `getZoom`, `setRotation`, `setSpreadMode`, `setScrollMode`
- **Selection** — `getSelection`, `getSelectedText`, `clearSelection`, `highlightSelection`
- **Search** — `search`, `nextSearchResult`, `previousSearchResult`, `clearSearch`
- **Annotations** — `setAnnotationTool`, `selectAnnotation`, `deleteSelectedAnnotations`
- **Forms** — `getFormValues`, `setFormValues`
- **Signatures** — `openSignatureDialog`, `placeSignature`
- **Pages** — `movePage`, `reorderPages`, `deletePage`
- **History** — `undo`, `redo`, `canUndo`, `canRedo`
- **Output** — `download`, `getBytes`, `print`, `toggleFullscreen`
- **Documents** — `openUrl`, `openBuffer`

## Callbacks

`onDocumentLoad`, `onDocumentError`, `onPageChange`, `onZoomChange`,
`onRotationChange`, `onSelectionChange`, `onTextSelected`,
`onAnnotationsChange`, `onFormFieldChange`, `onSearchResults`,
`onPageOrderChange`, `onReady`.

## Notes on page reordering

EmbedPDF exposes no plugin-level page-reorder API, so reordering is performed at
the engine level (`mergePages`) and the document is reloaded from the rebuilt
bytes. As a result, drag-and-drop reordering rebuilds the document; unsaved
in-session annotation edits are not preserved across a reorder. Call
`getBytes()` first if you need to persist edits.

## Development

```bash
cd packages/pdf-viewer
npm install
npm start        # local dev harness (src/development)
npm run build    # vite build + type declarations
```
