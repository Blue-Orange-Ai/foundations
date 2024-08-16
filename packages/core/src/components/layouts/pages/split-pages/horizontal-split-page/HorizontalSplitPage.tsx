import React, {useEffect, useRef, useState} from "react";

import './HorizontalSplitPage.css'
import Cookies from "js-cookie";
import {v4 as uuidv4} from "uuid";
import {SplitPageMajor} from "../split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../split-page-minor/SplitPageMinor";


export enum SplitDirectionHorizontalPage {
	TOP,
	BOTTOM
}

interface Props {
	children: React.ReactNode;
	splitDirection?: SplitDirectionHorizontalPage,
	uuid?: string;
	adjustable?: boolean;
	maxHeight?: string;
	minHeight?: string;
	defaultHeight?: number;
}

export const HorizontalSplitPage: React.FC<Props> = ({
													   children,
													   splitDirection=SplitDirectionHorizontalPage.BOTTOM,
													   uuid,
														 defaultHeight=300,
													   adjustable=true,
														 maxHeight="unset",
														 minHeight = "unset"}) => {

	const majorItems: React.ReactNode[] = [];

	const minorItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === SplitPageMajor) {
				majorItems.push(child.props.children);
			} else if (child.type === SplitPageMinor) {
				minorItems.push(child.props.children);
			}
		}
	});


	const pageHeightStore = Cookies.get(uuid ?? "");

	const initialHeight = pageHeightStore ? +pageHeightStore : defaultHeight;

	const pageRef = useRef<HTMLDivElement | null>(null);

	const [height, setHeight] = useState(initialHeight);

	const [pageUuid, setPageUuid] = useState(uuid ?? uuidv4());

	const minorSplitRef = useRef<HTMLDivElement | null>(null);

	const moving = useRef<boolean>(false);

	const handleMouseDown = () => {
		if (adjustable) {
			moving.current = true;
		}
	}

	const handleMouseUp = (ev: MouseEvent) => {
		if (moving.current) {
			const targetWidth = Math.max(250, Math.min(700, ev.x))
			Cookies.set(pageUuid, targetWidth.toString());
		}
		moving.current = false
	}

	const handleMouseMove = (ev: MouseEvent) => {
		if (moving.current && pageRef.current && splitDirection == SplitDirectionHorizontalPage.BOTTOM) {
			var containerRect = pageRef.current.getBoundingClientRect();
			setHeight(containerRect.bottom - ev.y);
		} else if (moving.current && pageRef.current && splitDirection == SplitDirectionHorizontalPage.TOP) {
			var containerRect = pageRef.current.getBoundingClientRect();
			setHeight(ev.y - containerRect.top);
		}
	}

	useEffect(() => {
		if (minorSplitRef.current) {
			minorSplitRef.current?.addEventListener('mousedown', handleMouseDown)
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			if (minorSplitRef.current) {
				minorSplitRef.current?.addEventListener('mousedown', handleMouseDown)
			}
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
	}, []);

	return (
		<div ref={pageRef} className="blue-orange-layouts-horizontal-split-page">
			{splitDirection == SplitDirectionHorizontalPage.TOP &&
				<div className="blue-orange-layouts-horizontal-split-page-minor-top"
					 style={{height: height + "px", maxHeight: maxHeight, minHeight: minHeight}}>
					<div ref={minorSplitRef}
						 className="blue-orange-layouts-horizontal-split-control-top"></div>
					{minorItems}
				</div>
			}
			<div className="blue-orange-layouts-horizontal-split-page-main">{majorItems}</div>
			{splitDirection == SplitDirectionHorizontalPage.BOTTOM &&
				<div className="blue-orange-layouts-horizontal-split-page-minor-bottom"
					 style={{height: height + "px", maxHeight: maxHeight, minHeight: minHeight}}>
					<div ref={minorSplitRef}
						 className="blue-orange-layouts-horizontal-split-control-bottom"></div>
					{minorItems}
				</div>
			}
		</div>
	)
}