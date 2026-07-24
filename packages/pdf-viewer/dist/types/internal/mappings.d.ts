/**
 * Conversions between the viewer's friendly public types and the enums used by
 * the underlying @embedpdf plugins, plus geometry flattening helpers.
 */
import { Rotation, type Rect } from '@embedpdf/models';
import { type ZoomLevel } from '@embedpdf/plugin-zoom';
import { SpreadMode } from '@embedpdf/plugin-spread';
import { ScrollStrategy } from '@embedpdf/plugin-scroll';
import type { PdfRotation, PdfSpreadMode, PdfScrollMode, PdfZoomLevel, PdfRect } from '../types';
export declare const toZoomLevel: (level: PdfZoomLevel) => ZoomLevel;
export declare const fromZoomLevel: (level: ZoomLevel) => PdfZoomLevel;
export declare const toRotation: (deg: PdfRotation) => Rotation;
export declare const fromRotation: (rotation: Rotation) => PdfRotation;
export declare const toSpreadMode: (mode: PdfSpreadMode) => SpreadMode;
export declare const fromSpreadMode: (mode: SpreadMode) => PdfSpreadMode;
export declare const toScrollStrategy: (mode: PdfScrollMode) => ScrollStrategy;
export declare const flattenRect: (rect: Rect, pageIndex: number) => PdfRect;
