import React from "react";

import {Dropdown, DropdownItemText} from "@blue-orange-ai/foundations-core";

export interface ChartSelectOption {
	value: string,
	label: string,
}

interface Props {
	label?: string,
	value: string,
	options: Array<ChartSelectOption>,
	disabled?: boolean,
	filter?: boolean,
	onChange: (value: string) => void,
}

/**
 * Single-select dropdown over a plain string value.
 *
 * The core Dropdown seeds its displayed value from the `selected` flags on
 * mount and keeps it in its own state afterwards, so the key pins the rendered
 * instance to the value it was built from — otherwise a value changed from
 * elsewhere (picking a chart type that rewrites every series' mark, say) would
 * leave the closed dropdown showing the old label.
 */
export const ChartSelect: React.FC<Props> = ({
												 label,
												 value,
												 options,
												 disabled = false,
												 filter = false,
												 onChange,
											 }) => (
	<Dropdown
		key={value}
		label={label}
		disabled={disabled}
		filter={filter}
		contextWidth={"100%"}
		onSelection={(item) => {
			if (item.reference !== value) {
				onChange(item.reference);
			}
		}}
	>
		{options.map((option) => (
			<DropdownItemText
				key={option.value}
				label={option.label}
				value={option.value}
				selected={option.value === value}
			></DropdownItemText>
		))}
	</Dropdown>
);
