// @ts-ignore
import React, { useState } from 'react';
import {
    Button,
    ButtonType,
    ButtonSize,
    DefaultBlockAlert,
    ErrorBlockAlert,
    SuccessBlockAlert,
} from '@blue-orange-ai/foundations-core';
import { ResponsivePreview } from '../../components/responsive-preview/ResponsivePreview';
import { ResponsiveDemoCard } from './ResponsiveDemoCard';
import './Gallery.css';

interface GalleryEntry {
    id: string;
    label: string;
    render: () => React.ReactNode;
}

/**
 * Demo catalogue for the dev-tools package. Each entry renders a real component
 * inside the ResponsivePreview so it can be exercised across viewport sizes.
 */
const ENTRIES: GalleryEntry[] = [
    {
        id: 'responsive-demo',
        label: 'Responsive demo (@media)',
        render: () => <ResponsiveDemoCard />,
    },
    {
        id: 'buttons',
        label: 'Buttons',
        render: () => (
            <div style={{ display: 'flex', gap: 12, padding: 24, flexWrap: 'wrap' }}>
                <Button text="Primary" buttonType={ButtonType.PRIMARY} />
                <Button text="Secondary" buttonType={ButtonType.SECONDARY} />
                <Button text="Success" buttonType={ButtonType.SUCCESS} />
                <Button text="Danger" buttonType={ButtonType.DANGER} />
                <Button
                    text="Small"
                    buttonType={ButtonType.PRIMARY}
                    size={ButtonSize.SMALL}
                />
            </div>
        ),
    },
    {
        id: 'alerts',
        label: 'Alerts',
        render: () => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
                <DefaultBlockAlert
                    title="Heads up"
                    description="This is a default block alert rendered inside the preview frame."
                />
                <SuccessBlockAlert
                    title="Saved"
                    description="Your changes were stored successfully."
                />
                <ErrorBlockAlert
                    title="Something went wrong"
                    description="Please try again in a moment."
                />
            </div>
        ),
    },
];

export const Gallery: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string>(ENTRIES[0].id);
    const selected = ENTRIES.find((e) => e.id === selectedId) ?? ENTRIES[0];

    return (
        <div className="dev-tools-gallery">
            <aside className="dev-tools-gallery-sidebar">
                <div className="dev-tools-gallery-brand">
                    <i className="ri-ruler-2-line"></i>
                    <span>Foundations Dev Tools</span>
                </div>
                <nav className="dev-tools-gallery-nav">
                    {ENTRIES.map((entry) => (
                        <button
                            key={entry.id}
                            type="button"
                            className={`dev-tools-gallery-nav-item${
                                entry.id === selectedId ? ' active' : ''
                            }`}
                            onClick={() => setSelectedId(entry.id)}
                        >
                            {entry.label}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="dev-tools-gallery-main">
                <ResponsivePreview title={selected.label} key={selected.id}>
                    {selected.render()}
                </ResponsivePreview>
            </main>
        </div>
    );
};
