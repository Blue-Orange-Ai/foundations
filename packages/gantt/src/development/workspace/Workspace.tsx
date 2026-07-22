import React, { useState } from 'react';
import { Toggle } from '@blue-orange-ai/foundations-core';
import { Gantt } from '../../components/gantt/Gantt';
import { IGanttLink, IGanttTask } from '../../interfaces/GanttInterfaces';
import { mockLinks, mockTasks } from '../data/mockData';
import './Workspace.css';

/**
 * Local development harness for the Gantt package. Renders the {@link Gantt} with
 * mock data and a light / dark theme toggle so components can be previewed in the
 * browser via `npm start`. This file is not part of the library build.
 */
export const Workspace: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [readonly, setReadonly] = useState(false);
    const [tasks, setTasks] = useState<IGanttTask[]>(mockTasks);
    const [links, setLinks] = useState<IGanttLink[]>(mockLinks);

    return (
        <div className={dark ? 'dark' : ''}>
            <div className="gantt-workspace">
                <div className="gantt-workspace-controls">
                    <h1 className="gantt-workspace-title">Foundations Gantt</h1>
                    <div className="gantt-workspace-toggles">
                        <label className="gantt-workspace-toggle">
                            <span>Read only</span>
                            <Toggle checked={readonly} onChange={setReadonly} />
                        </label>
                        <label className="gantt-workspace-toggle">
                            <span>Dark mode</span>
                            <Toggle checked={dark} onChange={setDark} />
                        </label>
                    </div>
                </div>
                <div className="gantt-workspace-chart">
                    <Gantt
                        tasks={tasks}
                        links={links}
                        readonly={readonly}
                        onTasksChange={setTasks}
                        onLinksChange={setLinks}
                    />
                </div>
            </div>
        </div>
    );
};
