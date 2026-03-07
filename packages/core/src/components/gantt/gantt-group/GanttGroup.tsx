import React, { ReactNode } from 'react';
import { IGanttGroup } from '../types/GanttTypes';
import { Accordion } from '../../accordion/accordion/Accordion';
import { AccordionHeader } from '../../accordion/accordion-header/AccordionHeader';
import { AccordionBody } from '../../accordion/accordion-body/AccordionBody';
import './GanttGroup.css';

interface Props {
  group: IGanttGroup;
  children: ReactNode;
  labelPanelWidth: number;
  rowHeight: number;
  indentLevel: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const GanttGroup: React.FC<Props> = ({
  group,
  children,
  labelPanelWidth,
  rowHeight,
  indentLevel,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="blue-orange-gantt-group">
      <Accordion opened={isOpen}>
        <AccordionHeader>
          <div
            className="blue-orange-gantt-group-header"
            style={{ height: rowHeight }}
            onClick={onToggle}
          >
            <div
              className="blue-orange-gantt-group-label-panel"
              style={{ width: labelPanelWidth, paddingLeft: 12 + indentLevel * 16 }}
            >
              <i className={isOpen ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
              <span className="blue-orange-gantt-group-label">{group.label}</span>
            </div>
            <div className="blue-orange-gantt-group-timeline-spacer" />
          </div>
        </AccordionHeader>
        <AccordionBody>
          {children}
        </AccordionBody>
      </Accordion>
    </div>
  );
};
