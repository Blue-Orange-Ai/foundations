import React, { useState } from 'react';
import './GanttChartDevelopment.css';
import { GanttChart } from '../../../components/gantt/gantt-chart/GanttChart';
import { IGanttItem, IGanttGroup, IGanttDependency, GanttViewMode } from '../../../components/gantt/types/GanttTypes';
import { HorizontalSplitPage } from '../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage';
import { SplitPageMajor } from '../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor';
import { SplitPageMinor } from '../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor';
import { PaddedPage } from '../../../components/layouts/pages/padded-page/PaddedPage';
import { PageHeading } from '../../../components/text-decorations/page-heading/PageHeading';
import { Checkbox } from '../../../components/inputs/checkbox/Checkbox';
import { FormHeading } from '../../../components/text-decorations/form-heading/FormHeading';
import moment from 'moment';

const today = moment();

const sampleGroups: IGanttGroup[] = [
  { id: 'engineering', label: 'Engineering', defaultOpen: true },
  { id: 'frontend', label: 'Frontend', parentGroupId: 'engineering', defaultOpen: true },
  { id: 'marketing', label: 'Marketing', defaultOpen: true },
];

const sampleItems: IGanttItem[] = [
  {
    id: 'design-system',
    label: 'Design System Refresh',
    startDate: today.clone().subtract(3, 'weeks').toDate(),
    endDate: today.clone().add(1, 'week').toDate(),
    color: '#4A90D9',
    groupId: 'frontend',
  },
  {
    id: 'component-migration',
    label: 'Component Library Migration',
    startDate: today.clone().subtract(1, 'week').toDate(),
    endDate: today.clone().add(3, 'weeks').toDate(),
    color: '#27AE60',
    groupId: 'frontend',
  },
  {
    id: 'backend-api',
    label: 'Backend API v2',
    startDate: today.clone().subtract(2, 'weeks').toDate(),
    endDate: today.clone().add(2, 'weeks').toDate(),
    color: '#E67E22',
    groupId: 'engineering',
  },
  {
    id: 'db-migration',
    label: 'Database Migration',
    startDate: today.clone().subtract(1, 'week').toDate(),
    endDate: today.clone().add(4, 'weeks').toDate(),
    color: '#8E44AD',
    groupId: 'engineering',
  },
  {
    id: 'q1-campaign',
    label: 'Q1 Campaign',
    startDate: today.clone().subtract(2, 'weeks').toDate(),
    endDate: today.clone().add(2, 'weeks').toDate(),
    color: '#E74C3C',
    groupId: 'marketing',
  },
  {
    id: 'brand-refresh',
    label: 'Brand Refresh',
    startDate: today.clone().add(1, 'week').toDate(),
    endDate: today.clone().add(5, 'weeks').toDate(),
    color: '#16A085',
    groupId: 'marketing',
  },
  {
    id: 'product-roadmap',
    label: 'Product Roadmap Review',
    startDate: today.clone().subtract(1, 'week').toDate(),
    endDate: today.clone().add(1, 'week').toDate(),
    color: '#2980B9',
  },
  {
    id: 'stakeholder-presentation',
    label: 'Stakeholder Presentation',
    startDate: today.clone().add(2, 'weeks').toDate(),
    endDate: today.clone().add(3, 'weeks').toDate(),
    color: '#F39C12',
  },
];

const sampleDependencies: IGanttDependency[] = [
  { fromId: 'backend-api', toId: 'component-migration' },
  { fromId: 'design-system', toId: 'backend-api' },
  { fromId: 'db-migration', toId: 'brand-refresh' },
  { fromId: 'q1-campaign', toId: 'stakeholder-presentation' },
];

interface Props {}

export const GanttChartDevelopment: React.FC<Props> = () => {
  const [showTodayLine, setShowTodayLine] = useState(true);
  const [viewMode, setViewMode] = useState<GanttViewMode>('week');
  const [lastClicked, setLastClicked] = useState<IGanttItem | null>(null);

  return (
    <HorizontalSplitPage>
      <SplitPageMajor>
        <PaddedPage>
          <PageHeading>Gantt Chart</PageHeading>
          <div style={{ height: '600px' }}>
            <GanttChart
              items={sampleItems}
              groups={sampleGroups}
              dependencies={sampleDependencies}
              viewMode={viewMode}
              showTodayLine={showTodayLine}
              onBarClick={setLastClicked}
            />
          </div>
        </PaddedPage>
      </SplitPageMajor>
      <SplitPageMinor>
        <div className="blue-orange-gantt-dev-controls">
          <FormHeading>Controls</FormHeading>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox
              checked={showTodayLine}
              onCheckboxChange={setShowTodayLine}
            />
            <span>Show Today Line</span>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem' }}>
              View Mode
            </label>
            <select
              className="blue-orange-gantt-dev-viewmode"
              value={viewMode}
              onChange={e => setViewMode(e.target.value as GanttViewMode)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          <FormHeading>Last Clicked Item</FormHeading>
          <pre>{JSON.stringify(lastClicked, null, 2)}</pre>
        </div>
      </SplitPageMinor>
    </HorizontalSplitPage>
  );
};
