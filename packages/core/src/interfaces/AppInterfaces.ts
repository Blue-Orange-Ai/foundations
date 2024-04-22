import { Instance } from 'tippy.js';
import {ReactNode} from "react";
import {IContextMenuItem} from "../components/contextmenu/ContextMenu";

export interface TippyInstance extends Instance {
    _tippy?: TippyInstance;
}

export interface TippyHTMLElement extends HTMLElement {
    _tippy?: TippyInstance;
}

export enum CellAlignment {
    LEFT,
    CENTER,
    RIGHT
}
