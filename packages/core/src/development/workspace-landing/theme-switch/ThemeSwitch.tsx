import React from "react";

import './ThemeSwitch.css'
import {SideBarState} from "../../../components/layouts/sidebar/default/SideBar";
import {Toggle} from "../../../components/inputs/toggle/Toggle";

interface Props {
	dark: boolean;
	state: SideBarState;
	onChange: (dark: boolean) => void;
}

export const ThemeSwitch: React.FC<Props> = ({dark, state, onChange}) => {

	if (state === SideBarState.CLOSED) {
		return (
			<div className="blue-orange-theme-switch blue-orange-theme-switch-closed">
				<button
					type="button"
					className="blue-orange-theme-switch-icon-btn"
					aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
					onClick={() => onChange(!dark)}
				>
					<i className={dark ? "ri-moon-fill" : "ri-sun-fill"}></i>
				</button>
			</div>
		)
	}

	return (
		<div className="blue-orange-theme-switch">
			<div className="blue-orange-theme-switch-label">
				<i className={dark ? "ri-moon-fill" : "ri-sun-fill"}></i>
				<span>{dark ? "Dark Mode" : "Light Mode"}</span>
			</div>
			<Toggle checked={dark} update={new Date()} onChange={onChange}></Toggle>
		</div>
	)
}
