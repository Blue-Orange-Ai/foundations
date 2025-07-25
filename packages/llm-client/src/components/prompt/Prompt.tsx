import React, {useRef, useState} from "react";
import './Prompt.css';

interface Props {
    onSend: (message: string) => void,
    placeholder?: string,
    text?: string
}
export const Prompt: React.FC<Props> = ({onSend, placeholder, text}) => {

    const [message, setMessage] = useState(text === undefined ? "" : text);

    var textareaRef = useRef<HTMLTextAreaElement>(null);

    placeholder = placeholder === undefined ? "Enter Text Here..." : placeholder;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        var textArea = textareaRef.current as HTMLTextAreaElement;
        textArea.style.height = '24px';
        textArea.style.height = (textArea.scrollHeight - 4) + 'px';
    };
    const handleSend = () => {
        onSend(message);
        setMessage('');
    };

    return (
        <div className="blue-orange-prompt-container">
            <div className="blue-orange-prompt">
                <textarea
                    ref={textareaRef}
                    className="blue-orange-prompt-text-area"
                    placeholder={placeholder}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    value={message}></textarea>
                <div className={`container ${message === '' 
                    ? 'blue-orange-prompt-send-btn' 
                    : 'blue-orange-prompt-send-btn blue-orange-prompt-send-btn-active'}`}
                     onClick={handleSend}>
                    <i className="ri-send-plane-2-fill"></i>
                </div>
            </div>
        </div>
    );
};
