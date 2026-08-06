import React, {useRef} from "react";

import './ThemePreferenceSelector.css'
import {ResolvedTheme, ThemePreference} from "../../../utils/appearance/ThemePreference";

interface ThemeOption {
	preference: ThemePreference;
	label: string;
	description: string;
	icon: string;
}

const OPTIONS: ThemeOption[] = [
	{
		preference: ThemePreference.LIGHT,
		label: "Light",
		description: "Always use the light theme.",
		icon: "ri-sun-line"
	},
	{
		preference: ThemePreference.DARK,
		label: "Dark",
		description: "Always use the dark theme.",
		icon: "ri-moon-line"
	},
	{
		preference: ThemePreference.SYSTEM,
		label: "System",
		description: "Match your device setting.",
		icon: "ri-computer-line"
	}
];

interface Props {
	value: ThemePreference;
	onChange: (preference: ThemePreference) => void;
	/** The theme the system option currently resolves to, shown so the outcome is visible. */
	systemTheme?: ResolvedTheme;
	/** Accessible name for the group. Defaults to "Theme". */
	label?: string;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The Light / Dark / System choice, drawn as three previewed tiles. Each tile
 * paints itself in the theme it selects, so the row reads as a comparison rather
 * than as three words.
 */
export const ThemePreferenceSelector: React.FC<Props> = ({
															 value,
															 onChange,
															 systemTheme,
															 label = "Theme",
															 classes = "",
															 style = {}}) => {

	const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

	// Arrow keys move the selection, which is how a radio group is expected to
	// behave — the buttons handle Enter and Space by themselves.
	const moveSelection = (from: number, delta: number) => {
		const next = (from + delta + OPTIONS.length) % OPTIONS.length;
		const node = optionRefs.current[next];
		if (node) {
			node.focus();
		}
		onChange(OPTIONS[next].preference);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			event.preventDefault();
			moveSelection(index, 1);
			return;
		}
		if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			event.preventDefault();
			moveSelection(index, -1);
		}
	};

	const optionClassName = (option: ThemeOption) => {
		let className = "blue-orange-blocks-theme-option";
		className += " blue-orange-blocks-theme-option-" + option.preference;
		if (value === option.preference) {
			className += " blue-orange-blocks-theme-option-selected";
		}
		return className;
	};

	return (
		<div
			role="radiogroup"
			aria-label={label}
			className={"blue-orange-blocks-theme-options" + (classes ? " " + classes : "")}
			style={style}>
			{OPTIONS.map((option, index) => (
				<button
					key={option.preference}
					type="button"
					role="radio"
					aria-checked={value === option.preference}
					tabIndex={value === option.preference ? 0 : -1}
					ref={(node) => {optionRefs.current[index] = node}}
					className={optionClassName(option)}
					onClick={() => onChange(option.preference)}
					onKeyDown={(event) => handleKeyDown(event, index)}>
					<span className="blue-orange-blocks-theme-preview" aria-hidden="true">
						<span className="blue-orange-blocks-theme-preview-sidebar"></span>
						<span className="blue-orange-blocks-theme-preview-body">
							<span className="blue-orange-blocks-theme-preview-line"></span>
							<span className="blue-orange-blocks-theme-preview-line blue-orange-blocks-theme-preview-line-short"></span>
						</span>
					</span>
					<span className="blue-orange-blocks-theme-option-label">
						<i className={option.icon}></i>
						{option.label}
						{value === option.preference && (
							<i className="ri-check-line blue-orange-blocks-theme-option-check"></i>
						)}
					</span>
					<span className="blue-orange-blocks-theme-option-description">
						{option.preference === ThemePreference.SYSTEM && systemTheme
							? "Match your device setting — currently " + systemTheme + "."
							: option.description}
					</span>
				</button>
			))}
		</div>
	)
}
