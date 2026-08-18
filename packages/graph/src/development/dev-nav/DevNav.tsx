import React from "react";
import {Link, useLocation} from "react-router-dom";

import './DevNav.css'

const LINKS = [
	{to: "/", label: "Graph"},
	{to: "/diagram", label: "Diagram"},
	{to: "/er-diagram", label: "ER diagram"}
];

export const DevNav: React.FC = () => {

	const location = useLocation();

	return (
		<div className="dev-nav">
			<span className="dev-nav-title">primitives-graph wrappers</span>
			{LINKS.map((link) => (
				<Link
					key={link.to}
					to={link.to}
					className={"dev-nav-link" + (location.pathname === link.to ? " dev-nav-link-active" : "")}>
					{link.label}
				</Link>
			))}
		</div>
	)
}
