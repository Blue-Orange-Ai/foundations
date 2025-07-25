import React, {ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState} from "react";
import hljs from "highlight.js";
import {v4} from "uuid"
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify'

import './RenderMessages.css';
import 'highlight.js/styles/atom-one-dark.css';
import {
    IEndpointHeader,
    IMessage,
    IModelConfig,
    IModelMessage,
    IModelRequest,
    IModelResponse, IModelStreamMessage, IModelStreamResult, RenderMessagesHandles
} from "../../interfaces/AppInterfaces";
import {chatRequest, chatStream} from "../messageService/MessageService";

interface Props {
    followBottom: boolean,
    setFollowBlock: (followBottom: boolean) => void,
    messages: Array<IMessage>,
    modelConfig? : IModelConfig
}
export const RenderMessagesComponent: React.ForwardRefRenderFunction<RenderMessagesHandles, Props> = ({followBottom, setFollowBlock, messages, modelConfig}, ref) => {

    var messagesRef = useRef<HTMLDivElement>(null);

    var footerRef = useRef<HTMLDivElement>(null);

    var lastAutomatedScroll = new Date();

    // const [localFollowBottom, setLocalFollowBottom] = useState(followBottom);

    var localFollowBottom = useRef(followBottom);

    const [intervalIdTestRef, setIntervalIdTestRef] = useState<NodeJS.Timer | null>();

    modelConfig = modelConfig !== undefined ? modelConfig : {
        avatar: "",
        max_tokens: 2048,
        role: "assistant",
        backgroundDark: "#FFFFFF",
        backgroundLight: "",
        displayName: "Vicuna",
        stream: true,
        name: "models/ggml-vic7b-q5_1.bin",
        endpoint: {
            headers: [
                {
                    "key": "Content-type",
                    "value": "application/json"
                }
            ],
            uri: "http://localhost:8000/v1/chat/completions"
        }
    };

    useImperativeHandle(ref, () => ({
        sendMsg: (message: string) => {
            sendRequest(message);
        }
    }));

    useEffect(() => {
        localFollowBottom.current = followBottom;
    }, [followBottom]);

    var processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify);

    var componentId: string = v4();

    var _messages: Array<IMessage> = [];

    useEffect(() => {
        // Function to execute on component creation
        init()

        window.addEventListener('click', onDocumentClick);

        return () => {
            window.removeEventListener('click', onDocumentClick);
            try{
                var script:HTMLScriptElement = document.getElementById("script-" + componentId) as HTMLScriptElement;
                document.body.removeChild(script);
                if (intervalIdTestRef !== null) {
                    clearInterval(intervalIdTestRef)
                }
            } catch (e) {}
        };
    }, []);

    const init = () => {
        var messageBody: HTMLDivElement = messagesRef.current as HTMLDivElement;
        if (!messageBody.hasAttribute("blue-orange-initialised")) {
            messageBody.setAttribute("blue-orange-initialised", "true")
            initJsScripts();
            initMessages();
            // streamTest();
        }
    };

    const renderMarkdown = (markdown: string) => {
        return processor.process(markdown).then((file) => String(file));
    }

    const initMessages = () => {
        messages.forEach(message => {
            update(message);
        });
    }

    const initJsScripts = () => {
        var script:HTMLScriptElement = document.createElement("script");
        script.id = "script-" + componentId;
        document.body.appendChild(script);
    }

    const onDocumentClick = (event: MouseEvent) => {
        let element = event.target as HTMLElement;
        var target = getParentElementWithAttribute(element, "x-data-code-block-id");
        if (target != null) {
            copyCode(target);
        }
    }

    const copyCode = (element: HTMLElement) => {
        const codeBlockId = element.getAttribute("x-data-code-block-id") as string;
        const code = document.getElementById(codeBlockId)?.innerText;
        if (code !== undefined) {
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            var originalText = element.innerHTML;
            const changeContent = () => {
                element.innerHTML = "<i class=\"ri-check-line no-select\" style='margin-right: 10px'></i>Copied"; // Replace 'New content' with the desired content
                setTimeout(() => {
                    element.innerHTML = originalText;
                }, 3000);
            };
            changeContent();
        }
    }

    const updateJs = (message: IMessage) => {
            var script:HTMLScriptElement = document.getElementById("script-" + componentId) as HTMLScriptElement;
            var js = script.innerText;
            if (js.indexOf(message.js) > -1) {
            js = js + "\n\n" + message.js;
            script.innerText = js;
        }
    }

    const addCodeHighlighting = (elem: HTMLDivElement) => {
        const codeBlocks = elem.querySelectorAll('code');
        codeBlocks.forEach((codeBlock) => {
            hljs.highlightBlock(codeBlock);
        });
        return elem;
    }

    const getCodeBlockName = (classname: string) => {
        var possibleNames = classname.split(" ");
        for (var i=0; i < possibleNames.length; i++) {
            if (possibleNames[i].startsWith("language-")) {
                return possibleNames[i].replace(/^language-/, '');
            }
        }
        return "text";
    }

    const addCopyCode = (elem: HTMLDivElement) => {
        const codeBlocks = elem.querySelectorAll('pre');
        codeBlocks.forEach((codeBlock:HTMLElement) => {
            var uuid = v4();

            var codeBlockCont = document.createElement("div");
            codeBlockCont.className = "blue-orange-code-block";
            codeBlock.children[0].id = uuid;

            var codeBlockHeader = document.createElement("div");
            codeBlockHeader.className = "blue-orange-code-block-header";

            var codeBlockName = document.createElement("div");
            codeBlockName.innerText = getCodeBlockName(codeBlock.children[0].className);
            codeBlockHeader.appendChild(codeBlockName);

            var copyCodeElem = document.createElement("button") as HTMLButtonElement;
            copyCodeElem.setAttribute("x-data-code-block-id", uuid);
            copyCodeElem.className = "blue-orange-copy-code";
            copyCodeElem.innerHTML = "<i class=\"ri-clipboard-line no-select\" style='margin-right: 10px'></i>Copy To Clipboard";
            codeBlockHeader.appendChild(copyCodeElem);
            codeBlockCont.appendChild(codeBlockHeader);
            codeBlockCont.appendChild(codeBlock.cloneNode(true));
            codeBlock.replaceWith(codeBlockCont);
        });
        return elem;
    }

    const addCursorModifier = (message: IMessage, elem: HTMLDivElement):HTMLDivElement => {
        var modifier = message.complete ? "" : "<span class='blue-orange-message-cursor'></span>";
        const lastChild:HTMLElement = elem.lastChild as HTMLElement;
        if (lastChild !== undefined && lastChild !== null && (
            lastChild.nodeName.toString().toLowerCase() === "p" ||
            lastChild.nodeName.toString().toLowerCase() === "h1" ||
            lastChild.nodeName.toString().toLowerCase() === "h2" ||
            lastChild.nodeName.toString().toLowerCase() === "h3" ||
            lastChild.nodeName.toString().toLowerCase() === "h4" ||
            lastChild.nodeName.toString().toLowerCase() === "h5" ||
            lastChild.nodeName.toString().toLowerCase() === "h6")) {
            modifier = message.complete ? "" : "<span class='blue-orange-message-cursor blue-orange-message-cursor-left'></span>";
            lastChild.innerHTML = lastChild.innerHTML + modifier;
            return elem;
        }
        elem.innerHTML = elem.innerHTML + modifier;
        return elem;
    }

    const addMessageMarkup = (message: IMessage, markdown: string) => {
        var elem: HTMLDivElement = document.createElement("div");
        elem.innerHTML = markdown;
        elem = addCursorModifier(message, elem);
        elem = addCodeHighlighting(elem);
        elem = addCopyCode(elem);
        return elem.innerHTML;
    }

    const renderImg = (avatar: HTMLDivElement, message: IMessage) => {
        if (message.avatar !== undefined && message.avatar !== '') {
            var avatarImg: HTMLImageElement = document.createElement("img");
            avatarImg.style.height = "100%";
            avatarImg.style.width = "100%";
            avatarImg.style.objectFit = "contain";
            avatarImg.src = message.avatar;
            avatar.appendChild(avatarImg);
        }
    }

    const createMessageAvatar = (message: IMessage) => {
            var avatar:HTMLDivElement = document.createElement("div");
            avatar.id = "avatar-" + message.uuid;
            avatar.className = "blue-orange-message-avatar";
            renderImg(avatar, message);
            return avatar;
    }

    const updateMessageAvatar = (message: IMessage) => {
        var avatar: HTMLDivElement = document.getElementById("avatar-" + message.uuid) as HTMLDivElement;
        avatar.innerHTML = "";
        renderImg(avatar, message);
    }

    const createMessageHtmlAbove = (message: IMessage) => {
        if (message.htmlAbove !== null && message.htmlAbove !== "") {
            var html = document.createElement("div");
            html.id = "message-html-above-" + message.uuid;
            html.innerHTML = message.htmlAbove;
            return html;
        }
        return "";
    }

    const createMessageHtmlBelow = (message: IMessage) => {
            var validMessageBelow = !message.complete || (message.showHtmlAfterComplete && message.complete);
            if (message.htmlBelow !== null && message.htmlBelow !== "" && validMessageBelow) {
            var html = document.createElement("div");
            html.innerHTML = message.htmlBelow;
            return html.outerHTML;
        }
        return "";
    }

    const createMessageText = (message: IMessage) => {
        var msg: HTMLDivElement = document.createElement("div");
        msg.id = "message-" + message.uuid;
        msg.className = "blue-orange-message-txt";
        renderMarkdown(message.message).then(m => {
            msg.innerHTML = createMessageHtmlAbove(message) + addMessageMarkup(message, m)
                + createMessageHtmlBelow(message);
        });
        return msg;
    }

    const updateStoredMessage = (message: IMessage) => {
        _messages = _messages.map(obj => obj.uuid === message.uuid ? message : obj);
    }

    const updateMessageText = (message: IMessage) => {
        var msg: HTMLDivElement = document.getElementById("message-" + message.uuid) as HTMLDivElement;
        renderMarkdown(message.message).then(m => {
            msg.innerHTML = createMessageHtmlAbove(message)
                + addMessageMarkup(message, m) + createMessageHtmlBelow(message);
        });
    }

    const createMessageGroup = (message: IMessage) => {
        var msgGroup: HTMLDivElement = document.createElement("div");
        msgGroup.id = message.uuid;
        msgGroup.className = "blue-orange-message-group";
        msgGroup.style.background = message.backgroundLight;

        var msgCont: HTMLDivElement = document.createElement("div");
        msgCont.id = message.uuid;
        msgCont.className = "blue-orange-message";

        msgCont.appendChild(createMessageAvatar(message));
        msgCont.appendChild(createMessageText(message));
        msgGroup.appendChild(msgCont);

        var messageBody: HTMLDivElement = messagesRef.current as HTMLDivElement;
        messageBody.prepend(msgGroup);
        _messages.push(message);
    }

    const updateMessageGroup = (message: IMessage) => {
        updateMessageAvatar(message);
        updateMessageText(message);
        updateStoredMessage(message);
    }

    const messageExists = (message: IMessage) => {
        return document.getElementById(message.uuid) !== null;
    }

    const update = (message: IMessage) => {
        if (messageExists(message)) {
            updateMessageGroup(message);
        } else {
            createMessageGroup(message);
        }
        var currentTime = new Date();
        const millisecondsDiff = currentTime.getTime() - lastAutomatedScroll.getTime();
        if (localFollowBottom.current && millisecondsDiff > 60) {
            lastAutomatedScroll = currentTime;
            var footer = footerRef.current as HTMLElement;
            setFollowBlock(true);
            footer.scrollIntoView();
        }
    }

    const transformStreamResponse = (uuid: string, message: string, complete: boolean) : IMessage => {
        return {
            avatar: modelConfig?.avatar,
            role: modelConfig?.role,
            backgroundDark: modelConfig?.backgroundDark,
            backgroundLight: modelConfig?.backgroundLight,
            complete: complete,
            helpful: false,
            helpfulResponded: false,
            htmlAbove: "",
            htmlBelow: "",
            js: "",
            message: message,
            robot: true,
            showHtmlAfterComplete: false,
            time: new Date(),
            username: "",
            uuid: uuid
        } as IMessage
    }
    const transformModelResponse = (response: IModelResponse, complete: boolean) : IMessage => {
        return {
            avatar: modelConfig?.avatar,
            role: response.choices[0].message.role,
            backgroundDark: modelConfig?.backgroundDark,
            backgroundLight: modelConfig?.backgroundLight,
            complete: complete,
            helpful: false,
            helpfulResponded: false,
            htmlAbove: "",
            htmlBelow: "",
            js: "",
            message: response.choices[0].message.content,
            robot: true,
            showHtmlAfterComplete: false,
            time: new Date(),
            username: "",
            uuid: response.id
        } as IMessage
    }

    const receiveRobotResponse = (response: IModelResponse, complete: boolean) => {
        var message: IMessage = transformModelResponse(response, complete);
        update(message);
    }

    const generateContext = (): Array<IModelMessage> => {
        if (messages !== undefined) {
            const context: Array<IModelMessage> = _messages.map((message) => {
                const modelMessage: IModelMessage = {
                    content: message.message,
                    role: message.role
                };
                return modelMessage;
            });
            return context;
        }
        return [];
    }

    const streamRequest = async (requestData: IModelRequest) => {
        if (modelConfig !== undefined) {
            var uuid = v4();
            var m = "";
            update(transformStreamResponse(uuid, m, false));
            const response = await chatStream(modelConfig?.endpoint, requestData);
            if (response !== undefined && response.body) {
                const reader = response.body.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    var data = new TextDecoder('utf-8').decode(value);
                    console.log("Chunk Received")
                    console.log(data);
                    const lines = data
                        .split("\n")
                        .filter((line: string) => line.trim() !== "");
                    for (const line of lines) {
                        const message = line.replace(/^data: /, "");
                        if (message.startsWith("[DONE]")) {
                            update(transformStreamResponse(uuid, m, true));
                            break;
                        }
                        try {
                            const parsed = JSON.parse(message) as IModelStreamResult;
                            if (parsed.choices[0].delta.content !== undefined) {
                                m += parsed.choices[0].delta.content;
                                update(transformStreamResponse(uuid, m, false));
                            }
                        } catch (error) {
                            console.error("Could not JSON parse stream message", message, error);
                        }
                    }
                    if (done) break;
                }
            }

        }

    }

    const staticRequest = async (requestData: IModelRequest) => {
        if (modelConfig !== undefined) {
            const result = await chatRequest(modelConfig?.endpoint, requestData);
            update(transformModelResponse(result, true));
        }

    }

    const queryModel = () => {
        var requestData: IModelRequest = {
            messages: generateContext(),
            max_tokens: modelConfig?.max_tokens,
            stream: modelConfig?.stream
        }
        if (modelConfig?.stream) {
            streamRequest(requestData);
        } else {
            staticRequest(requestData);
        }

    }

    const sendRequest = (request: string) => {
        var message: IMessage = {
            avatar: "",
            role: "user",
            backgroundDark: "#FFFFFF",
            backgroundLight: "",
            complete: true,
            helpful: false,
            helpfulResponded: false,
            htmlAbove: "",
            htmlBelow: "",
            js: "",
            message: request,
            robot: false,
            showHtmlAfterComplete: false,
            time: new Date(),
            username: "",
            uuid: v4()
        }
        update(message);
        queryModel();
    }

    const streamTest = () => {
        var markdown = getTestString();
        var message: IMessage = {
            role: "",
            avatar: "",
            backgroundDark: "#FFFFFF",
            backgroundLight: "",
            complete: false,
            helpful: false,
            helpfulResponded: false,
            htmlAbove: "",
            htmlBelow: "",
            js: "",
            message: "",
            robot: false,
            showHtmlAfterComplete: false,
            time: new Date(),
            username: "",
            uuid: v4()
        }
        let currentIndex = 0;
        update(message);
        const interval = setInterval(() => {
            try{
                if (currentIndex >= markdown.length) {
                    clearInterval(interval);
                    message.complete = true;
                    update(message);
                    return;
                }
                message.message += markdown[currentIndex];
                update(message);
                currentIndex++;
            } catch (e) {
                clearInterval(interval);
            }

        }, 5);
        setIntervalIdTestRef(interval);
    }

    const getTestString = () => {
        return `
# My Markdown Document

## Table of Contents

| Heading |
| ------- |
| [Section 1](#section-1) |
| [Section 2](#section-2) |
| [Section 3](#section-3) |

## Section 1

This is some text in section 1.

\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`

## Section 2

This is some text in section 2.

\`\`\`python
def greet():
  print("Hello, World!")
\`\`\`

## Section 3

This is some text in section 3.

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |
# My Markdown Document

## Table of Contents

| Heading |
| ------- |
| [Section 1](#section-1) |
| [Section 2](#section-2) |
| [Section 3](#section-3) |

## Section 1

This is some text in section 1.

\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`

## Section 2

This is some text in section 2.

\`\`\`python
def greet():
  print("Hello, World!")
\`\`\`

## Section 3

This is some text in section 3.

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |
# My Markdown Document

## Table of Contents

| Heading |
| ------- |
| [Section 1](#section-1) |
| [Section 2](#section-2) |
| [Section 3](#section-3) |

## Section 1

This is some text in section 1.

\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`

## Section 2

This is some text in section 2.

\`\`\`python
def greet():
  print("Hello, World!")
\`\`\`

## Section 3

This is some text in section 3.

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |
# My Markdown Document

## Table of Contents

| Heading |
| ------- |
| [Section 1](#section-1) |
| [Section 2](#section-2) |
| [Section 3](#section-3) |

## Section 1

This is some text in section 1.

\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`

## Section 2

This is some text in section 2.

\`\`\`python
def greet():
  print("Hello, World!")
\`\`\`

## Section 3

This is some text in section 3.

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |
# My Markdown Document

## Table of Contents

| Heading |
| ------- |
| [Section 1](#section-1) |
| [Section 2](#section-2) |
| [Section 3](#section-3) |

## Section 1

This is some text in section 1.

\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`

## Section 2

This is some text in section 2.

\`\`\`python
def greet():
  print("Hello, World!")
\`\`\`

## Section 3

This is some text in section 3.

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |
# My Markdown Document

## Table of Contents

| Heading |
| ------- |
| [Section 1](#section-1) |
| [Section 2](#section-2) |
| [Section 3](#section-3) |

## Section 1

This is some text in section 1.

\`\`\`javascript
function helloWorld() {
  console.log('Hello, World!');
}
\`\`\`

## Section 2

This is some text in section 2.

\`\`\`python
def greet():
  print("Hello, World!")
\`\`\`

## Section 3

This is some text in section 3.

| Name | Age |
| ---- | --- |
| John | 25  |
| Jane | 30  |
`;
    }

    const isDescendantAttribute = (child: HTMLElement, attribute: string) => {
        if (child.hasAttribute(attribute)) {
            return true;
        }
        var node = child.parentElement;
        while (node != null){
            if (node.hasAttribute(attribute)){
                return true;
            }
            node = node.parentElement;
        }
        return false;
    }

    const getParentElementWithAttribute = (child: HTMLElement, attribute: string) => {
        if (child.hasAttribute(attribute)) {
            return child;
        }
        var node = child.parentElement;
        while (node != null){
            if (node.hasAttribute(attribute)){
                return node;
            }
            node = node.parentElement;
        }
        return null;
    }


    return (
        <div className="blue-orange-message-window">
            <div
                ref={messagesRef}
                className="blue-orange-message-container"
            ></div>
            <div
                ref={footerRef}
                className="blue-orange-message-window-footer"></div>
        </div>
    );
};

export const RenderMessages = React.forwardRef(RenderMessagesComponent);