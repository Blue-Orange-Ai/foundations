import { Instance, Props } from 'tippy.js';

export interface IAvatar {
    id: number,
    uri: string,
    enabled: number
}

export interface IGroup {
    id: number,
    name: string
}

export enum IconPos {
    LEFT,
    RIGHT
}

export interface IUser {
    id: number,
    username: string,
    email: string,
    password: string,
    color: string,
    avatar: IAvatar,
    lastActive: Date,
    locked: boolean,
    disabled: boolean,
    forcePasswordReset: boolean,
    groups: Array<IGroup>
}

export interface TippyInstance extends Instance {
    _tippy?: TippyInstance;
}

export interface TippyHTMLElement extends HTMLElement {
    _tippy?: TippyInstance;
}

export interface IContextMenuItem {
    label: string,
    icon?: string,
    value: any
}
