import React, {useEffect, useRef} from "react";

import './AdvancedTooltip.css'
import tippy, {Instance} from "tippy.js";

import {createRoot, Root} from "react-dom/client";

import 'tippy.js/dist/svg-arrow.css';

export enum ToolTipTrigger{
	MOUSE_ENTER,
	CLICK
}

interface Props {
	children: React.ReactNode,
	tooltipComponent?: string,
	trigger?: ToolTipTrigger
}

export const AdvancedTooltip: React.FC<Props> = ({children, tooltipComponent, trigger=ToolTipTrigger.CLICK}) => {

	const tooltipRef = useRef<HTMLDivElement | null>(null);

	const tooltipInstance = useRef<Instance | null>(null);

	const getTriggerType = () => {
		if (trigger == ToolTipTrigger.MOUSE_ENTER) {
			return "mouseenter focus"
		} else if (trigger == ToolTipTrigger.CLICK) {
			return "click";
		}
	}

	useEffect(() => {
		const current = tooltipRef.current;

		if (tooltipComponent && current) {
			const tooltipNode = document.createElement("div");
			let root: Root | null = null;

			const instance = tippy(current, {
				zIndex: 999999999999999,
				theme: "light",
				interactive: true, // Allow interaction with tooltip content if needed
				appendTo: "parent", // Ensure proper arrow positioning
				trigger: getTriggerType(), // Hide tooltip when mouse leaves or loses focus
				animation: "fade", // Add smooth fade animation
				render: () => {
					if (!root) {
						root = createRoot(tooltipNode);
					}

					// Render the React content inside the tooltip
					root.render(
						<div className="tooltip-content blue-orange-tippy-content">
							{tooltipComponent}
						</div>
					);

					// Return the required structure for tippy.js
					return {
						popper: tooltipNode,
						onUpdate: () => {
							// Handle updates to the tooltip content
							if (root) {
								root.render(
									<div className="tooltip-content">
										{tooltipComponent}
									</div>
								);
							}
						},
						onDestroy: () => {
							// Proper cleanup
							if (root) {
								root.unmount();
								root = null;
							}
						},
					};
				},
				onShow: () => {
					tooltipNode.classList.remove("blue-orange-tooltip-hide")
				},
				onHide: () => {
					tooltipNode.classList.add("blue-orange-tooltip-hide")
				},
			});

			tooltipInstance.current = instance;

			return () => {
				tooltipInstance.current?.destroy();
				tooltipInstance.current = null;
			};
		}
	}, [tooltipComponent]);

	return (
		<div ref={tooltipRef} style={{width: "fit-content"}}>
			{children}
		</div>
	)
}