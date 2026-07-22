# Foundations Gantt

An interactive, hierarchical Gantt chart for the Blue Orange AI Foundations
design system, published as `@blue-orange-ai/foundations-gantt`.

The feature set follows [SVAR React Gantt](https://github.com/svar-widgets/react-gantt):
a data grid beside a zoomable timeline, drag / resize / progress editing,
dependency links, milestones and summary roll-ups. All chrome (buttons, inputs,
modal, tooltips) is built from `@blue-orange-ai/foundations-core`, and the whole
component is themed with the shared CSS variables (light and dark).

## Install

```
npm install @blue-orange-ai/foundations-gantt
```

The package has a single internal dependency, `@blue-orange-ai/foundations-core`
(a peer/runtime dependency), plus `moment` for date maths and `tippy.js` /
`remixicon` (already used across Foundations) for tooltips and icons.

## Usage

```tsx
import { useState } from 'react';
import { Gantt, IGanttTask, IGanttLink } from '@blue-orange-ai/foundations-gantt';
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css';
import '@blue-orange-ai/foundations-core/dist/style.css';

const initialTasks: IGanttTask[] = [
    { id: 'p1', text: 'Design', type: 'summary' },
    { id: 't1', text: 'Wireframes', parent: 'p1', start: new Date(2026, 2, 1), duration: 5, progress: 60 },
    { id: 't2', text: 'Visual design', parent: 'p1', start: new Date(2026, 2, 6), duration: 6 },
    { id: 'm1', text: 'Launch', type: 'milestone', start: new Date(2026, 2, 20) },
];

const initialLinks: IGanttLink[] = [
    { id: 'l1', source: 't1', target: 't2' },
];

export function Example() {
    const [tasks, setTasks] = useState(initialTasks);
    const [links, setLinks] = useState(initialLinks);
    return (
        <div style={{ height: 600 }}>
            <Gantt
                tasks={tasks}
                links={links}
                onTasksChange={setTasks}
                onLinksChange={setLinks}
            />
        </div>
    );
}
```

`Gantt` works **controlled** (pass `tasks` + `onTasksChange`, feed the new array
back) or **uncontrolled** (pass an initial `tasks` and omit the callback — it
keeps its own state). Give the wrapper a height; the chart fills it.

## Features

- **Data grid** with an expand / collapse tree, task name, start date, duration
  and an "add sub-task" action. Columns are configurable via the `columns` prop.
- **Zoomable timeline** — Hours, Days, Weeks, Months, Quarters — via the toolbar.
  Cell positions are interpolated inside each period so variable-length months
  and years stay accurate.
- **Drag to move**, **drag the ends to resize**, and **drag the diamond handle to
  set progress**. All changes snap to the current scale's unit.
- **Dependency links** — drag from a bar's edge connector to another bar to
  create an end-to-start link; click a link to remove it. Cycles and duplicates
  are rejected.
- **Milestones** (diamonds) and **summary tasks** whose span and progress roll up
  from their children.
- **Create / edit form** built from core `Modal`, `Input`, `DateInput`,
  `TextArea` and `ButtonToggle` — opens on double-click, or via "Add task".
- **Today marker**, weekend shading and full light / dark theming.

## Component props (`Gantt`)

| Prop | Type | Description |
|------|------|-------------|
| `tasks` | `IGanttTask[]` | The tasks to render (required). |
| `links` | `IGanttLink[]` | Dependency links. |
| `columns` | `IGanttColumn[]` | Grid columns. Defaults to name / start / days / add. |
| `defaultZoom` | `string` | Initial zoom level name. Defaults to `"Days"`. |
| `readonly` | `boolean` | Disable all editing interactions. |
| `showToolbar` | `boolean` | Show the built-in toolbar. Defaults to `true`. |
| `showToday` | `boolean` | Show the "today" marker. Defaults to `true`. |
| `useTaskForm` | `boolean` | Open the built-in edit form on double-click. Defaults to `true`. |
| `onTasksChange` | `(tasks) => void` | Called with the next task array on any change. |
| `onLinksChange` | `(links) => void` | Called with the next link array on any change. |
| `onSelect` | `(task \| null) => void` | Fired when the selected task changes. |
| `onTaskDoubleClick` | `(task) => void` | Fired on double-click, before the form opens. |

## Data model

A task needs any two of `start` / `end` / `duration`; the third is derived.
Summary tasks need no dates — their span is rolled up from their children.

```ts
interface IGanttTask {
    id: string | number;
    text: string;
    start?: Date;
    end?: Date;
    duration?: number;   // days
    progress?: number;   // 0–100
    type?: 'task' | 'summary' | 'milestone';
    parent?: string | number;
    open?: boolean;      // summary expanded (default true)
    details?: string;
    color?: string;
    readonly?: boolean;
    raw?: unknown;
}

interface IGanttLink {
    id: string | number;
    source: string | number;
    target: string | number;
    type?: 'e2s' | 's2s' | 'e2e' | 's2e'; // defaults to end-to-start
}
```

## Development

```
cd packages/gantt
npm install
npm start      # dev workspace with mock data and a light/dark toggle
npm run build  # vite library build + type declarations
npm test       # jest unit tests for the timeline / hierarchy utilities
```

The exported sub-components (`GanttToolbar`, `GanttGrid`, `GanttChart`,
`GanttTimeline`, `GanttTaskBar`, `GanttLinks`, `GanttTaskForm`) and the utilities
in `ganttUtils` are available for composing a custom layout.
