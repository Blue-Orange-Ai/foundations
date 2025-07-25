

export interface IPromptInput {
    message: string,
    time: Date
}

export interface IModelConfig {
    name: string,
    role: string,
    displayName: string,
    backgroundLight: string,
    backgroundDark: string,
    stream: boolean,
    endpoint: IEndpoint,
    max_tokens: number,
    avatar: string
}

export interface IMessage {
    uuid: string,
    htmlAbove: string,
    message: string,
    htmlBelow: string,
    showHtmlAfterComplete: boolean,
    complete: boolean,
    robot: boolean,
    backgroundLight: string,
    backgroundDark: string,
    avatar: string,
    helpful: boolean,
    helpfulResponded: boolean,
    username: string,
    js: string,
    role: string,
    time: Date
}

export interface IBranding {
    svg: string,
    height: number,
    width: number,
    svgColor: string,
    href: string,
    marginRight: number,
    text?: string
}

export interface ISideBarItem {
    type: string,
    reference: string,
    text: string,
    active: boolean,
    icon?: string,
    iconMargin?: number
}

export interface ISideBarUpdateEvent {
    type: string,
    reference: string
}

export interface IEndpointHeader {
    key: string,
    value: string
}

export interface IEndpoint {
    headers: Array<IEndpointHeader>
    uri: string
}

export interface IModelMessage {
    role: string,
    content: string
}

export interface IModelStreamMessage {
    content: string
}

export interface IModelRequest {
    model?: string,
    messages: Array<IModelMessage>
    temperature?: number,
    top_p?: number,
    n?: number,
    stream?: boolean,
    max_tokens?: number,
    presence_penalty?: number,
    frequency_penalty?: number
}

export interface IModelUsage {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
}

export interface IModelChoice {
    message: IModelMessage,
    finish_reason: string,
    index: number
}

export interface IModelStreamChoice {
    delta: IModelStreamMessage,
    finish_reason: string,
    index: number
}

export interface IModelResponse {
    id: string,
    object: string,
    created: number,
    model: string,
    usage: IModelUsage,
    choices: Array<IModelChoice>
}

export interface IModelStreamResult {
    id: string,
    object: string,
    created: number,
    model: string,
    usage: IModelUsage,
    choices: Array<IModelStreamChoice>
}

export interface RenderMessagesHandles {
    sendMsg: (message: string) => void;
}
