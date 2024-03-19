import { Instance } from 'tippy.js';

export interface TippyInstance extends Instance {
    _tippy?: TippyInstance;
}

export interface TippyHTMLElement extends HTMLElement {
    _tippy?: TippyInstance;
}
