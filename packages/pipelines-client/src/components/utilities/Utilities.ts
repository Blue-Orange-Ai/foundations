

import {sanitizeHtml} from "@blue-orange-ai/foundations-core";

// A node's markup is saved with the pipeline and read back from it, so it is
// treated as data. It is parsed in an inert document — never through innerHTML,
// which loads images and runs their handlers even on an element that is not in
// the page — its text is read as text, and its icon is sanitized before it is
// put back into a node.
export class Utilities {

    private static parse(nodeHtml: string): HTMLElement {
        return new DOMParser().parseFromString(nodeHtml ?? "", "text/html").body;
    }

    public static generateGeneralNodeHtml(
        icon: string,
        iconColor: string,
        iconBackground: string,
        title: string,
        description: string,
        fontColor: string) {
        var parentElement = document.createElement("div");
        parentElement.className = "blue-orange-pipeline-editor-node";
        parentElement.setAttribute("icon-color", iconColor);
        parentElement.setAttribute("icon-background", iconBackground);
        parentElement.setAttribute("font-color", fontColor);

        var iconCont = document.createElement("div");
        iconCont.className = "blue-orange-pipeline-editor-node-icon"
        iconCont.innerHTML = sanitizeHtml(icon, {allowStyles: false});
        iconCont.style.color = iconColor;
        iconCont.style.backgroundColor = iconBackground;
        parentElement.appendChild(iconCont);

        var bodyCont = document.createElement("div");
        bodyCont.className = "blue-orange-pipeline-editor-node-body";

        var titleCont = document.createElement("div");
        titleCont.className = "blue-orange-pipeline-editor-node-body-title";
        titleCont.textContent = title;
        titleCont.style.color = fontColor;
        bodyCont.appendChild(titleCont);

        var descriptionCont = document.createElement("div");
        descriptionCont.className = "blue-orange-pipeline-editor-node-body-description";
        descriptionCont.textContent = description;
        descriptionCont.style.color = fontColor;
        bodyCont.appendChild(descriptionCont);

        parentElement.appendChild(bodyCont);
        return parentElement.outerHTML;
    }

    public static getNodeTitle(nodeHtml: string): string {
        var tempDiv = Utilities.parse(nodeHtml);
        var titleElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node-body-title") as HTMLElement;
        return titleElement ? titleElement.textContent ?? "" : "";
    }

    public static getNodeDescription(nodeHtml: string): string {
        var tempDiv = Utilities.parse(nodeHtml);
        var descriptionElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node-body-description") as HTMLElement;
        return descriptionElement ? descriptionElement.textContent ?? "" : "";
    }

    public static getNodeIcon(nodeHtml: string): string {
        var tempDiv = Utilities.parse(nodeHtml);
        var iconElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node-icon") as HTMLElement;
        return iconElement ? sanitizeHtml(iconElement.innerHTML, {allowStyles: false}) : "";
    }

    public static getNodeIconColor(nodeHtml: string): string {
        var tempDiv = Utilities.parse(nodeHtml);
        var nodeElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node") as HTMLElement;
        try {
            return nodeElement.getAttribute("icon-color") ?? "";
        } catch (e) {
            return "";
        }
    }

    public static getNodeIconBackgroundColor(nodeHtml: string): string {
        var tempDiv = Utilities.parse(nodeHtml);
        var nodeElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node") as HTMLElement;
        try {
            return nodeElement.getAttribute("icon-background") ?? "";
        } catch (e) {
            return "";
        }
    }

    public static getNodeFontColor(nodeHtml: string): string {
        var tempDiv = Utilities.parse(nodeHtml);
        var nodeElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node") as HTMLElement;
        try {
            return nodeElement.getAttribute("font-color") ?? "";
        } catch (e) {
            return "";
        }
    }

}