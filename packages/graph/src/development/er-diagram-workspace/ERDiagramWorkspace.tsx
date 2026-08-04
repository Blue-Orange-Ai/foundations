import React, {useState} from "react";

import './ERDiagramWorkspace.css'
import {BlueOrangeERDiagramWrapper, ERTheme} from "../../components/er-diagram/BlueOrangeERDiagramWrapper";

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

	return (

		<div className="er-diagram-workspace-main-window">
			<div className="er-diagram-workspace-controls">
				<button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
					Toggle theme ({theme})
				</button>
			</div>
			<div className="er-diagram-workspace-display-window">
				<BlueOrangeERDiagramWrapper
					sql={sql}
					theme={theme}
					columnClicked={(detail) => console.log("column clicked", detail.entityId, detail.column.name)}
					relationshipClicked={(detail) => console.log("relationship clicked", detail.relationship)}
					onChange={(nodes, edges) => console.log("changed", nodes.length, edges.length)} />
			</div>
		</div>
	)
}
