import React, {ReactNode, useState} from "react";

import './SideBarHeaderItem.css'
import {SideBarState} from "../../default/SideBar";
import {Media} from "@blue-orange-ai/foundations-clients";
import {RenderMedia} from "../../../../media/default/RenderMedia";
import {ButtonIcon} from "../../../../buttons/button-icon/ButtonIcon";

interface Props {
	label: string,
	labelStyle?: React.CSSProperties,
	state: SideBarState,
	media?: Media,
	action?: ReactNode,
	headerItemClicked?: () => void,
	changeState?: (state: SideBarState) => void
}

export const SideBarHeaderItem: React.FC<Props> = ({
													   label,
													   state,
													   media,
													   labelStyle={},
													   action,
													   headerItemClicked,
													   changeState}) => {


	const [closedHoverState, setClosedHoverState] = useState(false);

	const collapsed = state == SideBarState.CLOSED;

	const changeSideBarState = (state: SideBarState) => {
		if (changeState) {
			changeState(state);
		}
	}

	const leftHeaderItemClicked = () => {
		// Collapsed there is no label left to click, so the header doubles as the
		// control that reopens the sidebar — the same job the branding square
		// does in the shadcn rail.
		if (collapsed) {
			changeSideBarState(SideBarState.OPEN);
			return;
		}

		if (headerItemClicked) {
			headerItemClicked()
		}
	}

	// With no media there is nothing to hover over, so the expand button is the
	// permanent occupant of the icon slot rather than a hover state.
	const showExpandButton = collapsed && (media == undefined || closedHoverState);

	// One tree for both states rather than a branch per state: swapping the
	// markup mid-transition would leave the header jumping while the rail
	// around it animates.
	return (
		<div className="blue-orange-sidebar-header-item no-select">
			<div className="blue-orange-sidebar-header-item-cont">
				<div
					className="blue-orange-sidebar-header-item-left-cont"
					onClick={leftHeaderItemClicked}
					onMouseOver={() => setClosedHoverState(true)}
					onMouseLeave={() => setClosedHoverState(false)}>
					{(media != undefined || collapsed) &&
						<div className="blue-orange-sidebar-header-item-media">
							{showExpandButton &&
								<ButtonIcon
									icon="ri-arrow-right-double-fill"
									onClick={() => changeSideBarState(SideBarState.OPEN)}></ButtonIcon>
							}
							{!showExpandButton && media != undefined &&
								<RenderMedia media={(media as Media)} height={32} width={32} borderRadius={"8px"}></RenderMedia>
							}
						</div>
					}
					<div className="blue-orange-sidebar-header-item-media-body" style={labelStyle}>{label}</div>
				</div>
				{action &&
					<div className="blue-orange-sidebar-header-item-action">
						{action}
					</div>
				}
			</div>
		</div>
	)
}
