import React, {useRef} from "react";

import './DropdownTrigger.css'
import {Dropdown} from "../basic/Dropdown";
import {DropdownItemObj} from "../../../interfaces/AppInterfaces";

export interface DropdownTriggerProps {
	/** The options — DropdownItemText, DropdownItemIcon, DropdownItemImage, DropdownItemHeading. */
	children: React.ReactNode;
	/** Filter box at the top of the popup. */
	filter?: boolean;
	/** Turns the options into checkboxes and keeps the popup open across selections. */
	allowMultiple?: boolean;
	/** Width of the popup. Defaults to "max-content" so it sizes to the option text, not the trigger. */
	contextWidth?: number | string;
	contextMaxHeight?: number;
	/** Fires for every selection a person makes. The value the dropdown starts on is not one. */
	onSelection?: (item: DropdownItemObj) => void;
	/** With allowMultiple, the full selection after each change. Emits the starting selection too. */
	onItemsSelected?: (items: Array<DropdownItemObj>) => void;
	/** Called whenever the popup opens or closes. */
	onVisibilityChange?: (visible: boolean) => void;
	disabled?: boolean;
}

interface Props extends DropdownTriggerProps {
	/** The element the popup hangs off. Clicking anywhere on it opens the dropdown. */
	trigger: React.ReactNode;
	/** Stretches the trigger across the width it is given. */
	fill?: boolean;
	/** Extra class on the wrapper, for a variant that has to reach into its own trigger. */
	className?: string;
	/** Extra class on the popup, which is portalled to the body and so out of the wrapper's reach. */
	contextClassName?: string;
	style?: React.CSSProperties;
}

/**
 * Turns an arbitrary element into a dropdown. The dropdown input itself is laid
 * invisibly over the trigger rather than rendered beside it, so the popup is
 * positioned, themed, filtered and keyboard driven by Dropdown while the trigger
 * keeps its own appearance — the same arrangement ButtonDropdown uses.
 */
export const DropdownTrigger: React.FC<Props> = ({
													 children,
													 trigger,
													 filter,
													 allowMultiple,
													 contextWidth = "max-content",
													 contextMaxHeight,
													 onSelection,
													 onItemsSelected,
													 onVisibilityChange,
													 disabled = false,
													 fill = false,
													 className,
													 contextClassName,
													 style = {}}) => {

	// Dropdown emits its starting value on mount — the placeholder item when nothing is
	// selected — which is not a selection anybody made. Only what follows is passed on.
	const startingSelectionRef = useRef(true);

	const handleSelection = (item: DropdownItemObj) => {
		if (startingSelectionRef.current) {
			startingSelectionRef.current = false;
			return;
		}
		if (onSelection) {
			onSelection(item);
		}
	}

	const classes = ["blue-orange-dropdown-trigger"];
	if (fill) {
		classes.push("blue-orange-dropdown-trigger-fill");
	}
	if (disabled) {
		classes.push("blue-orange-dropdown-trigger-disabled");
	}
	if (className) {
		classes.push(className);
	}

	const popupClasses = ["blue-orange-dropdown-trigger-window"];
	if (contextClassName) {
		popupClasses.push(contextClassName);
	}

	return (
		<div className={classes.join(" ")} style={style}>
			{trigger}
			<div className="blue-orange-dropdown-trigger-overlay">
				<Dropdown
					style={{width: "100%", height: "100%", opacity: 0}}
					disabled={disabled}
					filter={filter}
					contextWidth={contextWidth}
					contextMaxHeight={contextMaxHeight}
					contextClassName={popupClasses.join(" ")}
					allowMultipleSelection={allowMultiple}
					onVisibilityChange={onVisibilityChange}
					onItemsSelected={onItemsSelected}
					onSelection={handleSelection}>
					{children}
				</Dropdown>
			</div>
		</div>
	)
}
