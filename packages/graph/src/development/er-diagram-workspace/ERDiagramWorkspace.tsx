import React, {useRef, useState} from "react";

import './ERDiagramWorkspace.css'
import {BlueOrangeERDiagramWrapper, ERTheme} from "../../components/er-diagram/BlueOrangeERDiagramWrapper";
import {DevNav} from "../dev-nav/DevNav";
import {EventLog, useEventLog} from "../event-log/EventLog";
import {BlueOrangeERDiagram} from "@blue-orange-ai/primitives-graph";

interface Props {
}

const sql = `
CREATE TABLE customers (
    id int PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) UNIQUE
);

CREATE TABLE orders (
    id int PRIMARY KEY,
    customer_id int REFERENCES customers(id),
    total numeric,
    created_at timestamp
);

CREATE TABLE order_items (
    id int PRIMARY KEY,
    order_id int REFERENCES orders(id),
    product_id int REFERENCES products(id),
    quantity int
);

CREATE TABLE products (
    id int PRIMARY KEY,
    name varchar(255),
    price numeric
);
`;

export const ERDiagramWorkspace: React.FC<Props> = ({}) => {

	const [theme, setTheme] = useState<ERTheme>("light");

	const erRef = useRef<BlueOrangeERDiagram | null>(null);

	const [entries, log, clear] = useEventLog();

	const withER = (action: (er: BlueOrangeERDiagram) => void) => {
		if (erRef.current) {
			action(erRef.current);
		}
	}

	return (

		<div className="er-diagram-workspace-main-window">
			<DevNav />
			<div className="er-diagram-workspace-content">
				<div className="er-diagram-workspace-display-window">
					<BlueOrangeERDiagramWrapper
						sql={sql}
						theme={theme}
						instance={(er) => erRef.current = er}
						entityCreated={(entity) => log("entityCreated: " + (entity ? entity.name : "?"))}
						entityRenamed={(id, name) => log("entityRenamed: " + id + " -> \"" + name + "\"")}
						columnChanged={(entityId, column) => log("columnChanged: " + entityId + "." + column.name)}
						columnClicked={(detail) => log("columnClicked: " + detail.entityId + "." + detail.column.name + " (" + detail.column.type + ")")}
						relationshipCreated={(r) => log("relationshipCreated: " + r.sourceTable + "." + r.sourceColumn + " -> " + r.targetTable + "." + r.targetColumn)}
						relationshipClicked={(detail) => log("relationshipClicked: " + detail.relationship.sourceTable + "." + detail.relationship.sourceColumn + " -> " + detail.relationship.targetTable + "." + detail.relationship.targetColumn)}
						themeChanged={(changedTheme) => log("themeChanged: " + changedTheme)}
						entityClicked={(entity, n) => log("entityClicked: " + (entity ? entity.name : n.id))}
						entityDblClick={(entity, n) => log("entityDblClick: " + (entity ? entity.name : n.id))}
						onSelection={(nodes, edges) => log("onSelection: " + nodes.length + " entities, " + edges.length + " relationships")}
						onChange={(nodes, edges) => log("onChange: " + nodes.length + " entities, " + edges.length + " relationships")} />
				</div>
				<div className="er-diagram-workspace-sidebar">
					<div className="er-diagram-workspace-controls">
						<strong>Theme</strong>
						<button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
							Toggle theme ({theme})
						</button>

						<strong>Programmatic API</strong>
						<button onClick={() => withER((er) => {
							er.addEntity({
								name: "reviews",
								columns: [
									{name: "id", type: "int", pk: true},
									{name: "product_id", type: "int", references: {table: "products", column: "id"}, nullable: false},
									{name: "rating", type: "int", nullable: false}
								]
							});
							log("addEntity: reviews (FK -> products)");
						})}>Add reviews table</button>
						<button onClick={() => withER((er) => {
							er.addColumn("customers", {name: "is_active", type: "boolean", nullable: false});
							log("addColumn: customers.is_active");
						})}>Add column to customers</button>
						<button onClick={() => withER((er) => er.arrangeTables("right"))}>Arrange → right</button>
						<button onClick={() => withER((er) => er.arrangeTables("down"))}>Arrange ↓ down</button>
						<button onClick={() => withER((er) => console.log("er.toJSON()", er.toJSON()))}>Print toJSON() to console</button>

						<div className="er-diagram-workspace-hints">
							<div>• This diagram is built from SQL DDL via the wrapper's sql prop (parseSql)</div>
							<div>• Drag a table — relationship lines re-anchor to the facing column rows</div>
							<div>• Double-click a table or column name to rename it inline</div>
							<div>• Click a column row or a relationship line — see the event log</div>
						</div>
					</div>
					<EventLog entries={entries} onClear={clear} />
				</div>
			</div>
		</div>
	)
}
