# Foundations Graph

Foundations graph is the react graph component library from Blue Orange AI. It wraps the
`@blue-orange-ai/primitives-graph` views as react functional components.

To install the library run the following command:

``
npm install @blue-orange-ai/foundations-graph
``

## Components

| Component | Wraps | Use for |
|-----------|-------|---------|
| `BlueOrangeGraphWrapper` | `BlueOrangeGraph` | Generic node and edge graphs |
| `BlueOrangeDiagramWrapper` | `BlueOrangeDiagram` | draw.io style diagrams built from a shape palette |
| `BlueOrangeERDiagramWrapper` | `BlueOrangeERDiagram` | Entity relationship (database schema) diagrams |

Every wrapper renders a full width / full height `div`, so size the container you place it in.
The underlying primitive instance is handed back through the `instance` callback if you need the
imperative API (adding shapes, exporting `toJSON()`, undo / redo, layout, ...).

### BlueOrangeDiagramWrapper

```tsx
import {BlueOrangeDiagramWrapper} from "@blue-orange-ai/foundations-graph";

<BlueOrangeDiagramWrapper
    shapes={[
        {id: "api", type: "api", x: 320, y: 120, text: "API Gateway"},
        {id: "db", type: "database", x: 560, y: 120, text: "Postgres"}
    ]}
    connections={[{sourceId: "api", targetId: "db", label: "SQL"}]}
    options={{diagram: {showPalette: true}}}
    instance={(diagram) => setDiagram(diagram)}
    shapeCreated={(shape) => console.log(shape)}
    onChange={(nodes, edges) => save(nodes, edges)} />
```

Shape events (`shapeCreated`, `freehandCreated`, `shapeResized`, `shapeRotated`,
`shapeTextChanged`, `shapeColourChanged`, `shapesAligned`, `shapesDistributed`, `layerChanged`,
`editStart`, `editEnd`), connection events (`connectionCreated`, `connectionClicked`,
`connectionDblClick`, `connectionRightClick`, `connectionLabelChanged`, `connectionColourChanged`)
and the graph level `onSelection` / `onChange` are all exposed as props.

The image and file tools ask the host application for their content: return (or resolve) a
descriptor from `imageRequested` / `fileRequested` to drop the media onto the canvas.

```tsx
<BlueOrangeDiagramWrapper
    imageRequested={async () => ({src: await pickImage(), width: 160, height: 120})}
    fileRequested={() => ({fileName: "report.pdf", href: "/files/report.pdf"})} />
```

### BlueOrangeERDiagramWrapper

```tsx
import {BlueOrangeERDiagramWrapper} from "@blue-orange-ai/foundations-graph";

<BlueOrangeERDiagramWrapper
    entities={[
        {id: "customers", name: "customers", columns: [
            {name: "id", type: "int", pk: true},
            {name: "email", type: "varchar(255)", unique: true}
        ]},
        {id: "orders", name: "orders", columns: [
            {name: "id", type: "int", pk: true},
            {name: "customer_id", type: "int", references: {table: "customers", column: "id"}}
        ]}
    ]}
    relationships={[{sourceTable: "orders", sourceColumn: "customer_id", targetTable: "customers", cardinality: "N:1"}]}
    theme="light"
    columnClicked={(detail) => console.log(detail.entityId, detail.column.name)} />
```

A schema can also be supplied as SQL DDL through the `sql` prop, which is parsed on mount and
merged ahead of any `entities` / `relationships` you pass:

```tsx
<BlueOrangeERDiagramWrapper sql={"CREATE TABLE customers (id int PRIMARY KEY, email varchar(255));"} />
```

`theme` is reactive — changing it between `"light"` and `"dark"` switches the live diagram over
while keeping per entity colour overrides. `entityCreated`, `entityRenamed`, `columnChanged`,
`columnClicked`, `relationshipCreated`, `relationshipClicked`, `themeChanged`, the entity click
events and the graph level `onSelection` / `onChange` are exposed as props.

## Development

```bash
npm install
npm start   # http://localhost:3000 (/ graph, /diagram, /er-diagram)
npm run build
npm test
```
