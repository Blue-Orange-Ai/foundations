import React, { useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader } from '@blue-orange-ai/foundations-core';

import { ReasoningPart } from '../../interfaces/ChatInterfaces';
import { MarkdownMessage } from './MarkdownMessage';
import './ReasoningBlock.css';

interface Props {
    part: ReasoningPart;
}

/**
 * Collapsible model-reasoning panel — the "thinking" treatment from
 * assistant-ui. It auto-expands while THINKING deltas are streaming and
 * collapses once the answer text begins, but the user can toggle it at any
 * time. Built on core's `Accordion` (which uses a ResizeObserver, so it grows
 * smoothly as reasoning streams in).
 */
export const ReasoningBlock: React.FC<Props> = ({ part }) => {
    const [opened, setOpened] = useState(part.inProgress);
    const [userToggled, setUserToggled] = useState(false);

    // Auto-collapse when reasoning finishes, unless the user took control.
    useEffect(() => {
        if (!userToggled) setOpened(part.inProgress);
    }, [part.inProgress, userToggled]);

    const toggle = () => {
        setUserToggled(true);
        setOpened((o) => !o);
    };

    return (
        <div className="blue-orange-llm-reasoning">
            <Accordion opened={opened}>
                <AccordionHeader>
                    <button type="button" className="blue-orange-llm-reasoning-header" onClick={toggle}>
                        <i
                            className={
                                part.inProgress
                                    ? 'ri-loader-4-line blue-orange-llm-reasoning-spin'
                                    : 'ri-brain-line'
                            }
                        />
                        <span className="blue-orange-llm-reasoning-title">
                            {part.inProgress ? 'Thinking…' : 'Reasoning'}
                        </span>
                        <i
                            className={`ri-arrow-down-s-line blue-orange-llm-reasoning-chevron${
                                opened ? ' blue-orange-llm-reasoning-chevron-open' : ''
                            }`}
                        />
                    </button>
                </AccordionHeader>
                <AccordionBody>
                    <div className="blue-orange-llm-reasoning-body">
                        <MarkdownMessage text={part.text} />
                    </div>
                </AccordionBody>
            </Accordion>
        </div>
    );
};
