import React from "react";
import "./DotifiedText.css"; // Import CSS for static styles

interface Props {
    text: string;
    dot?: string;
    maxLines?: number;
}

export const DotifiedText: React.FC<Props> = ({ text, dot = "●", maxLines }) => {
    // Replace all spaces with the specified dot character
    const dotifiedText = text.replace(/ /g, dot);

    return (
        <div
            className="dotify-text"
            style={{
                WebkitLineClamp: maxLines,
                maxHeight: maxLines ? `${maxLines * 1.5}em` : undefined, // Adjust line height
            }}
            title={dotifiedText} // Tooltip to show full text
        >
            {dotifiedText}
        </div>
    );
};