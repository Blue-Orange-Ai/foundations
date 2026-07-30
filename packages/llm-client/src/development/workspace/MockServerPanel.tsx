// ---------------------------------------------------------------------------
// MockServerPanel — dev-only controls for the simulated backend.
//
// Lets you choose which scripted answer the next turn returns, how fast it
// streams (useful for exercising the stop button and the scroll-to-bottom
// affordance), and reset the seeded conversation history.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';

import {
    clearDemoSessions,
    getMockSettings,
    isMockDisabled,
    LatencyKey,
    ScenarioKey,
    SCENARIOS,
    seedDemoSessions,
    setMockDisabled,
    setMockSettings,
    subscribeMockSettings,
} from '../mock';
import './MockServerPanel.css';

const LATENCIES: Array<{ key: LatencyKey; label: string }> = [
    { key: 'instant', label: 'Instant' },
    { key: 'normal', label: 'Normal' },
    { key: 'slow', label: 'Slow' },
];

interface Props {
    /** Session namespace the provider persists history under. */
    sessionNamespace?: string;
}

export const MockServerPanel: React.FC<Props> = ({ sessionNamespace }) => {
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState(getMockSettings());
    const disabled = isMockDisabled();

    useEffect(() => subscribeMockSettings(setSettings), []);

    const reseed = () => {
        seedDemoSessions(sessionNamespace, true);
        window.location.reload();
    };

    const clear = () => {
        clearDemoSessions(sessionNamespace);
        window.location.reload();
    };

    const toggleMock = () => {
        setMockDisabled(!disabled);
        window.location.reload();
    };

    if (!open) {
        return (
            <button type="button" className="mock-panel-chip" onClick={() => setOpen(true)}>
                <span className={`mock-panel-dot${disabled ? ' mock-panel-dot-off' : ''}`} />
                Mock server
            </button>
        );
    }

    return (
        <div className="mock-panel">
            <div className="mock-panel-header">
                <span className={`mock-panel-dot${disabled ? ' mock-panel-dot-off' : ''}`} />
                <span className="mock-panel-title">Mock server</span>
                <button type="button" className="mock-panel-close" onClick={() => setOpen(false)} aria-label="Close">
                    <i className="ri-close-line" />
                </button>
            </div>

            {disabled ? (
                <p className="mock-panel-note">
                    Disabled — requests go to the real services on localhost.
                </p>
            ) : (
                <>
                    <label className="mock-panel-field">
                        <span>Next reply</span>
                        <select
                            value={settings.scenario}
                            onChange={(event) =>
                                setMockSettings({ scenario: event.target.value as ScenarioKey })
                            }
                        >
                            <option value="auto">Auto (from the prompt)</option>
                            {SCENARIOS.map((scenario) => (
                                <option key={scenario.key} value={scenario.key}>
                                    {scenario.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="mock-panel-field">
                        <span>Stream speed</span>
                        <select
                            value={settings.latency}
                            onChange={(event) =>
                                setMockSettings({ latency: event.target.value as LatencyKey })
                            }
                        >
                            {LATENCIES.map((latency) => (
                                <option key={latency.key} value={latency.key}>
                                    {latency.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <p className="mock-panel-note">
                        Send anything — replies are scripted. On “Auto” the prompt picks the scenario: mention
                        a chart, code, tools, an error or a long answer.
                    </p>
                </>
            )}

            <div className="mock-panel-actions">
                <button type="button" onClick={reseed}>
                    Reseed history
                </button>
                <button type="button" onClick={clear}>
                    Clear history
                </button>
                <button type="button" onClick={toggleMock}>
                    {disabled ? 'Enable mock' : 'Use real services'}
                </button>
            </div>
        </div>
    );
};
