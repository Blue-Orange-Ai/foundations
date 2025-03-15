

export class Utilities {

    public static generateNodeHtml(
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
        iconCont.innerHTML = icon;
        iconCont.style.color = iconColor;
        iconCont.style.backgroundColor = iconBackground;
        parentElement.appendChild(iconCont);

        var bodyCont = document.createElement("div");
        bodyCont.className = "blue-orange-pipeline-editor-node-body";

        var titleCont = document.createElement("div");
        titleCont.className = "blue-orange-pipeline-editor-node-body-title";
        titleCont.innerText = title;
        titleCont.style.color = fontColor;
        bodyCont.appendChild(titleCont);

        var descriptionCont = document.createElement("div");
        descriptionCont.className = "blue-orange-pipeline-editor-node-body-description";
        descriptionCont.innerText = description;
        descriptionCont.style.color = fontColor;
        bodyCont.appendChild(descriptionCont);

        parentElement.appendChild(bodyCont);
        return parentElement.outerHTML;
    }

    public static getNodeTitle(nodeHtml: string) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = nodeHtml;
        var titleElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node-body-title") as HTMLElement;
        return titleElement ? titleElement.innerText : null;
    }

    public static getNodeDescription(nodeHtml: string) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = nodeHtml;
        var descriptionElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node-body-description") as HTMLElement;
        return descriptionElement ? descriptionElement.innerText : null;
    }

    public static getNodeIcon(nodeHtml: string) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = nodeHtml;
        var iconElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node-icon") as HTMLElement;
        return iconElement ? iconElement.innerHTML : null;
    }

    public static getNodeIconColor(nodeHtml: string) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = nodeHtml;
        var nodeElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node") as HTMLElement;
        try {
            return nodeElement.getAttribute("icon-color");
        } catch (e) {
            return null;
        }
    }

    public static getNodeIconBackgroundColor(nodeHtml: string) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = nodeHtml;
        var nodeElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node") as HTMLElement;
        try {
            return nodeElement.getAttribute("icon-background");
        } catch (e) {
            return null;
        }
    }

    public static getNodeFontColor(nodeHtml: string) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = nodeHtml;
        var nodeElement = tempDiv.querySelector(".blue-orange-pipeline-editor-node") as HTMLElement;
        try {
            return nodeElement.getAttribute("font-color");
        } catch (e) {
            return null;
        }
    }

}