import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

import './DevNav.css'

const LINKS = [
	{to: "/", label: "Graph"},
	{to: "/diagram", label: "Diagram"},
	{to: "/er-diagram", label: "ER diagram"}
];

export const DevNav: React.FC = () => {

	const location = useLocation();

	// Dark mode is driven the way a consuming app drives it: a `dark` class on
	// <body>. The wrapped components read it themselves, so nothing has to be
	// re-mounted or re-configured when it flips.
	const [darkMode, setDarkMode] = useState<boolean>(
		() => typeof document !== "undefined" && document.body.classList.contains("dark"));

	useEffect(() => {
		document.body.classList.toggle("dark", darkMode);
		return () => {
			document.body.classList.remove("dark");
		}
	}, [darkMode]);

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
			<button
				className="dev-nav-theme-toggle"
				onClick={() => setDarkMode((on) => !on)}>
				{darkMode ? "☀ Light mode" : "☾ Dark mode"}
			</button>
		</div>
	)
}
