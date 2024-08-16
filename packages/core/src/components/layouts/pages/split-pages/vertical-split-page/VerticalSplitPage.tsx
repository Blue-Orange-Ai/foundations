import React, {useEffect, useRef, useState} from "react";

import './VerticalSplitPage.css'
import Cookies from "js-cookie";
import {v4 as uuidv4} from "uuid";
import {SplitPageMajor} from "../split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../split-page-minor/SplitPageMinor";


export enum SplitDirectionVerticalPage {
	LEFT,
	RIGHT
}

interface Props {
	children: React.ReactNode;
	splitDirection?: SplitDirectionVerticalPage,
	uuid?: string;
	adjustable?: boolean;
	maxWidth?: string;
	minWidth?: string;
	defaultWidth?: number;
}

export const VerticalSplitPage: React.FC<Props> = ({
													   children,
													   splitDirection=SplitDirectionVerticalPage.RIGHT,
													   uuid,
													   defaultWidth=300,
													   adjustable=true,
													   maxWidth="unset",
													   minWidth = "unset"}) => {

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


	const pageWidthStore = Cookies.get(uuid ?? "");

	const initialWidth = pageWidthStore ? +pageWidthStore : defaultWidth;

	const pageRef = useRef<HTMLDivElement | null>(null);

	const [width, setWidth] = useState(initialWidth);

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
		if (moving.current && pageRef.current && splitDirection == SplitDirectionVerticalPage.RIGHT) {
			var containerRect = pageRef.current.getBoundingClientRect();
			setWidth(containerRect.right - ev.x);
		} else if (moving.current && pageRef.current && splitDirection == SplitDirectionVerticalPage.LEFT) {
			var containerRect = pageRef.current.getBoundingClientRect();
			setWidth(ev.x - containerRect.left);
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
		<div ref={pageRef} className="blue-orange-layouts-vertical-split-page">
			{splitDirection == SplitDirectionVerticalPage.LEFT &&
				<div className="blue-orange-layouts-vertical-split-page-minor-left"
					 style={{width: width + "px", maxWidth: maxWidth, minWidth: minWidth}}>
					<div ref={minorSplitRef}
						 className="blue-orange-layouts-vertical-split-control-left"></div>
					{minorItems}
				</div>
			}
			<div className="blue-orange-layouts-vertical-split-page-main">{majorItems}</div>
			{splitDirection == SplitDirectionVerticalPage.RIGHT &&
				<div className="blue-orange-layouts-vertical-split-page-minor-right"
					 style={{width: width + "px", maxWidth: maxWidth, minWidth: minWidth}}>
					<div ref={minorSplitRef}
						 className="blue-orange-layouts-vertical-split-control-right"></div>
					{minorItems}
				</div>
			}
		</div>
	)
}