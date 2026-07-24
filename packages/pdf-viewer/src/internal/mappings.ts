/**
 * Conversions between the viewer's friendly public types and the enums used by
 * the underlying @embedpdf plugins, plus geometry flattening helpers.
 */
import { Rotation, type Rect } from '@embedpdf/models';
import { ZoomMode, type ZoomLevel } from '@embedpdf/plugin-zoom';
import { SpreadMode } from '@embedpdf/plugin-spread';
import { ScrollStrategy } from '@embedpdf/plugin-scroll';
import type {
	PdfRotation,
	PdfSpreadMode,
	PdfScrollMode,
	PdfZoomLevel,
	PdfRect,
} from '../types';

/* ---- zoom ---- */

export const toZoomLevel = (level: PdfZoomLevel): ZoomLevel => {
	switch (level) {
		case 'automatic':
			return ZoomMode.Automatic;
		case 'fit-page':
			return ZoomMode.FitPage;
		case 'fit-width':
			return ZoomMode.FitWidth;
		default:
			return level as number;
	}
};

export const fromZoomLevel = (level: ZoomLevel): PdfZoomLevel => {
	switch (level) {
		case ZoomMode.Automatic:
			return 'automatic';
		case ZoomMode.FitPage:
			return 'fit-page';
		case ZoomMode.FitWidth:
			return 'fit-width';
		default:
			return level as number;
	}
};

/* ---- rotation ---- */

export const toRotation = (deg: PdfRotation): Rotation => {
	switch (deg) {
		case 90:
			return Rotation.Degree90;
		case 180:
			return Rotation.Degree180;
		case 270:
			return Rotation.Degree270;
		default:
			return Rotation.Degree0;
	}
};

export const fromRotation = (rotation: Rotation): PdfRotation => {
	switch (rotation) {
		case Rotation.Degree90:
			return 90;
		case Rotation.Degree180:
			return 180;
		case Rotation.Degree270:
			return 270;
		default:
			return 0;
	}
};

/* ---- spread ---- */

export const toSpreadMode = (mode: PdfSpreadMode): SpreadMode => {
	switch (mode) {
		case 'odd':
			return SpreadMode.Odd;
		case 'even':
			return SpreadMode.Even;
		default:
			return SpreadMode.None;
	}
};

export const fromSpreadMode = (mode: SpreadMode): PdfSpreadMode => {
	switch (mode) {
		case SpreadMode.Odd:
			return 'odd';
		case SpreadMode.Even:
			return 'even';
		default:
			return 'none';
	}
};

/* ---- scroll ---- */

export const toScrollStrategy = (mode: PdfScrollMode): ScrollStrategy =>
	mode === 'horizontal' ? ScrollStrategy.Horizontal : ScrollStrategy.Vertical;

/* ---- geometry ---- */

export const flattenRect = (rect: Rect, pageIndex: number): PdfRect => ({
	pageIndex,
	x: rect.origin.x,
	y: rect.origin.y,
	width: rect.size.width,
	height: rect.size.height,
});
