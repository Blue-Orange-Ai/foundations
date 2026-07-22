# @blue-orange-ai/foundations-timeline

A fast, canvas-rendered **timeline / keyframe editor** for the Foundations
component library. Its data model and interactions are closely modelled on
[animation-timeline-control](https://github.com/ievgennaida/animation-timeline-control):
a horizontally-scrolling ruler over stacked tracks of draggable keyframes, with
grouped keyframe ranges, a draggable time cursor, rubber-band multi-selection,
snapping, and zoom / pan interaction modes. Only the visible area is drawn, so
large models stay responsive.

The package adds **no new external dependencies** — it renders to a plain
`<canvas>` and reuses the `core` package for its optional toolbar.

## Install

```bash
npm install @blue-orange-ai/foundations-timeline
```

Import the stylesheet once in your app (the canvas reads its palette from these
CSS variables), alongside the core styles used by the toolbar:

```ts
import '@blue-orange-ai/foundations-core/dist/style.css';
import '@blue-orange-ai/foundations-timeline/dist/style.css';
```

## Usage

```tsx
import { useRef, useState } from 'react';
import {
  Timeline,
  TimelineToolbar,
  TimelineHandle,
  TimelineInteractionMode,
  ITimelineModel,
} from '@blue-orange-ai/foundations-timeline';

const model: ITimelineModel = {
  rows: [
    { title: 'Camera', keyframes: [{ val: 0 }, { val: 1500 }, { val: 4000 }] },
    {
      title: 'Position',
      groups: [{ id: 'move' }],
      keyframes: [
        { val: 1000, group: 'move' },
        { val: 3000, group: 'move' },
      ],
    },
  ],
};

function Editor() {
  const ref = useRef<TimelineHandle>(null);
  const [mode, setMode] = useState(TimelineInteractionMode.SELECTION);
  const [time, setTime] = useState(0);

  return (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <TimelineToolbar
        mode={mode}
        onModeChange={(m) => { setMode(m); ref.current?.setInteractionMode(m); }}
        onZoomIn={() => ref.current?.zoomBy(0.8)}
        onZoomOut={() => ref.current?.zoomBy(1.25)}
        onZoomFit={() => ref.current?.zoomToFit()}
        time={time}
      />
      <Timeline
        ref={ref}
        model={model}
        interactionMode={mode}
        time={time}
        options={{ max: 10000, snapEnabled: true, snapStep: 250 }}
        onTimeChanged={(e) => setTime(e.val)}
        onModelChange={(m) => {/* keyframe values changed via drag */}}
        onSelected={(e) => {/* e.selected */}}
      />
    </div>
  );
}
```

## Data model

Mirrors animation-timeline-control — a model is a list of rows, each row owns a
list of keyframes, and keyframes may be tied into groups that drag as a range:

```ts
interface ITimelineModel { rows: ITimelineRow[] }
interface ITimelineRow {
  keyframes?: ITimelineKeyframe[];
  groups?: ITimelineGroup[];
  title?: string;          // shown in the optional left labels column
  height?: number;
  draggable?: boolean;     // default true
  selectable?: boolean;    // default true
}
interface ITimelineKeyframe {
  val: number;             // position on the time axis (units, ms by default)
  group?: string;          // ties keyframes into a group by id
  selected?: boolean;
  draggable?: boolean;     // default true
  min?: number; max?: number;  // clamp while dragging
  data?: unknown;          // your payload, never touched by the control
}
```

## Interaction modes

Set through `interactionMode` (or the toolbar):

| Mode | Behaviour |
| --- | --- |
| `selection` | Click / rubber-band select keyframes, drag them. |
| `pan` | Drag empty space to pan; keyframes stay interactive. |
| `nonInteractivePan` | Drag anywhere to pan; keyframes are inert. |
| `zoom` | Drag or wheel zooms towards the cursor. |
| `none` | Read only. |

`Ctrl` / `⌘` / `Shift` toggles keyframes into a multi-selection, and
`Ctrl`/`⌘` + wheel zooms in any mode.

## Imperative handle

`Timeline` forwards a `TimelineHandle` ref:

```ts
setTime(val) / getTime()
getModel() / getSelected()
setZoom(z) / getZoom() / zoomBy(factor) / zoomToFit()
setInteractionMode(mode)
selectAll() / deselectAll()
scrollToVal(val)
redraw()
```

## Events

`onTimeChanged`, `onSelected`, `onScroll`, `onDragStarted`, `onDrag`,
`onDragFinished`, `onKeyframeChanged`, `onModelChange`, and `onContextMenu`.

## Theming

The canvas reads `--blue-orange-{light|dark}-timeline-*` CSS variables at draw
time, so it follows the same light/dark theming as the rest of Foundations. Pass
`dark` to select the palette, or override individual colours through
`options.colors`.

## Development

```bash
cd packages/timeline
npm start   # local dev harness (src/development)
npm run build
npm test
```
