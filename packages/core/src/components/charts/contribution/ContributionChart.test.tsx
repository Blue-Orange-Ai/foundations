import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {ContributionChart, contributionTotal, toContributionDate, CONTRIBUTION_LEVEL_COLORS} from './ContributionChart';
import {ContributionEntry} from '../types/ChartTypes';

const entry = (date: string, count: number, extra: Partial<ContributionEntry> = {}): ContributionEntry => {
	return {date: date, count: count, ...extra};
}

// 2026-01-04 is a Sunday, so a Sunday-start grid opens on a whole week.
const ENTRIES: Array<ContributionEntry> = [
	entry('2026-01-04', 0),
	entry('2026-01-05', 4),
	entry('2026-01-06', 8),
	entry('2026-01-07', 12)
];

/**
 * The days are local, so the popup has to be checked against local parts —
 * toISOString would read them in UTC and slide the date either side of
 * midnight depending on where the tests happen to run.
 */
const isoDay = (date: Date): string => {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return date.getFullYear() + '-' + month + '-' + day;
}

const squares = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-contribution-chart-day'));
}

/** The band each square landed on, read back off the variable it is painted in. */
const bands = (container: HTMLElement): Array<number> => {
	return squares(container).map(square => {
		const painted = (square as HTMLElement).style.backgroundColor;
		return Number(painted.replace('var(--blue-orange-contribution-level-', '').replace(')', ''));
	});
}

const triggerAt = (container: HTMLElement, index: number) => {
	return container.querySelectorAll('.blue-orange-hover-card-trigger-cont')[index];
}

describe('ContributionChart', () => {

	beforeEach(() => {
		vi.useFakeTimers({shouldAdvanceTime: true});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const settleTimers = () => {
		act(() => {
			vi.runOnlyPendingTimers();
		});
	}

	it('draws one square per day in the window', () => {
		const {container} = render(<ContributionChart entries={ENTRIES}></ContributionChart>);
		expect(squares(container)).toHaveLength(4);
	});

	it('fills the days between the entries that carry no data', () => {
		const {container} = render(
			<ContributionChart entries={[entry('2026-01-04', 1), entry('2026-01-08', 1)]}></ContributionChart>
		);
		expect(squares(container)).toHaveLength(5);
	});

	it('puts each square on the row its weekday belongs to', () => {
		// The window opens on a Monday, so the one square sits on the second day
		// row — under the month names, which take the first row of the grid.
		const {container} = render(<ContributionChart entries={[entry('2026-01-05', 1)]}></ContributionChart>);
		const placed = container.querySelector('.blue-orange-contribution-chart-grid > .blue-orange-hover-card') as HTMLElement;
		expect(placed.style.gridRow).toBe('3');
		expect(placed.style.gridColumn).toBe('2');
	});

	it('drops the month row and the weekday column out of the placement when they are off', () => {
		const {container} = render(
			<ContributionChart
				entries={[entry('2026-01-05', 1)]}
				showMonthLabels={false}
				showWeekdayLabels={false}></ContributionChart>
		);
		const placed = container.querySelector('.blue-orange-contribution-chart-grid > .blue-orange-hover-card') as HTMLElement;
		expect(placed.style.gridRow).toBe('2');
		expect(placed.style.gridColumn).toBe('1');
	});

	it('shades each square by how it compares to the busiest day', () => {
		const {container} = render(<ContributionChart entries={ENTRIES}></ContributionChart>);
		// 12 busiest over 4 bands is a band every 3: 0, 4, 8 and 12 land on
		// levels 0, 2, 3 and 4.
		expect(bands(container)).toEqual([0, 2, 3, 4]);
	});

	it('paints the untouched scale as variables so the theme can swap it', () => {
		const {container} = render(<ContributionChart entries={ENTRIES}></ContributionChart>);
		expect((squares(container)[0] as HTMLElement).style.backgroundColor)
			.toBe('var(--blue-orange-contribution-level-0)');
	});

	it('paints a palette of its own as given', () => {
		const {container} = render(
			<ContributionChart entries={ENTRIES} levelColors={['#000000', '#ffffff']}></ContributionChart>
		);
		const drawn = squares(container) as Array<HTMLElement>;
		expect(drawn[0].style.backgroundColor).toBe('rgb(0, 0, 0)');
		expect(drawn[3].style.backgroundColor).toBe('rgb(255, 255, 255)');
	});

	it('takes explicit thresholds over the worked out bands', () => {
		const {container} = render(<ContributionChart entries={ENTRIES} levels={[1, 2, 3]}></ContributionChart>);
		// Three thresholds for five colours only reach as far as band three, and
		// every count here clears all of them.
		expect(bands(container)).toEqual([0, 3, 3, 3]);
	});

	it('works a band out itself when given a levelFor', () => {
		const {container} = render(
			<ContributionChart entries={ENTRIES} levelFor={count => count > 0 ? 1 : 0}></ContributionChart>
		);
		expect(bands(container)).toEqual([0, 1, 1, 1]);
	});

	it('lets an entry pin its own level and its own colour', () => {
		const {container} = render(
			<ContributionChart entries={[
				entry('2026-01-04', 1, {level: 4}),
				entry('2026-01-05', 1, {color: '#000000'})
			]}></ContributionChart>
		);
		expect(bands(container)[0]).toBe(4);
		expect((squares(container)[1] as HTMLElement).style.backgroundColor).toBe('rgb(0, 0, 0)');
	});

	it('adds up two entries that land on the same day', () => {
		const {container} = render(
			<ContributionChart entries={[entry('2026-01-04', 3), entry('2026-01-04', 5)]}></ContributionChart>
		);
		expect(squares(container)).toHaveLength(1);
		expect(screen.getByText('8 contributions')).toBeInTheDocument();
	});

	it('shows the title and the total in the header', () => {
		render(<ContributionChart entries={ENTRIES} title="Commits"></ContributionChart>);
		expect(screen.getByText('Commits')).toBeInTheDocument();
		expect(screen.getByText('24 contributions')).toBeInTheDocument();
	});

	it('prefers an explicitly given total', () => {
		render(<ContributionChart entries={ENTRIES} total={1}></ContributionChart>);
		expect(screen.getByText('1 contribution')).toBeInTheDocument();
	});

	it('leaves the header out when there is nothing to put in it', () => {
		const {container} = render(<ContributionChart entries={ENTRIES} showTotal={false}></ContributionChart>);
		expect(container.querySelector('.blue-orange-contribution-chart-header')).toBeNull();
	});

	it('walks a whole year without stalling on a daylight saving change', () => {
		// Adding a day's worth of milliseconds lands on the same date again when
		// the clocks go back, so a year-long window has to be stepped by calendar
		// date instead. A year covers every timezone's changeover.
		const {container} = render(
			<ContributionChart
				entries={[entry('2026-01-04', 1)]}
				startDate="2025-09-07"
				endDate="2026-09-05"></ContributionChart>
		);
		expect(squares(container)).toHaveLength(364);
	});

	it('divides the width between the weeks by default, so it fills its container', () => {
		const {container} = render(<ContributionChart entries={ENTRIES}></ContributionChart>);
		const grid = container.querySelector('.blue-orange-contribution-chart-grid') as HTMLElement;
		expect(grid.style.gridTemplateColumns).toBe('auto repeat(1, minmax(8px, 1fr))');
		expect(grid.style.gridTemplateRows).toBe('auto repeat(7, auto)');
	});

	it('stops dividing at the floor, below which the grid scrolls instead', () => {
		const {container} = render(<ContributionChart entries={ENTRIES} minCellSize={14}></ContributionChart>);
		const grid = container.querySelector('.blue-orange-contribution-chart-grid') as HTMLElement;
		expect(grid.style.gridTemplateColumns).toBe('auto repeat(1, minmax(14px, 1fr))');
	});

	it('fixes the squares when a size is given', () => {
		const {container} = render(<ContributionChart entries={ENTRIES} cellSize={12}></ContributionChart>);
		const grid = container.querySelector('.blue-orange-contribution-chart-grid') as HTMLElement;
		expect(grid.style.gridTemplateColumns).toBe('auto repeat(1, 12px)');
		expect(grid.style.gridTemplateRows).toBe('auto repeat(7, 12px)');
	});

	it('honours a window wider than the entries themselves', () => {
		const {container} = render(
			<ContributionChart entries={[entry('2026-01-05', 1)]} startDate="2026-01-04" endDate="2026-01-10"></ContributionChart>
		);
		expect(squares(container)).toHaveLength(7);
	});

	it('names the months above the weeks they cover', () => {
		render(<ContributionChart entries={[entry('2026-01-04', 1)]} startDate="2026-01-04" endDate="2026-03-28"></ContributionChart>);
		expect(screen.getByText('Jan')).toBeInTheDocument();
		expect(screen.getByText('Feb')).toBeInTheDocument();
		expect(screen.getByText('Mar')).toBeInTheDocument();
	});

	it('names every other weekday, rotated to the day the weeks start on', () => {
		const {container} = render(<ContributionChart entries={ENTRIES}></ContributionChart>);
		const named = Array.from(container.querySelectorAll('.blue-orange-contribution-chart-weekday'))
			.map(node => node.textContent)
			.filter(Boolean);
		expect(named).toEqual(['Mon', 'Wed', 'Fri']);
	});

	it('opens a popup with the count and the date when a square is hovered', () => {
		const {container} = render(
			<ContributionChart entries={ENTRIES} dateFormatter={isoDay}></ContributionChart>
		);
		expect(screen.queryByText('12 contributions')).toBeNull();
		fireEvent.mouseEnter(triggerAt(container, 3));
		settleTimers();
		expect(screen.getByText('12 contributions')).toBeInTheDocument();
		expect(screen.getByText('2026-01-07')).toBeInTheDocument();
	});

	it('shows a note under the count when the entry carries one', () => {
		const {container} = render(
			<ContributionChart entries={[entry('2026-01-04', 2, {note: 'Release day'})]}></ContributionChart>
		);
		fireEvent.mouseEnter(triggerAt(container, 0));
		settleTimers();
		expect(screen.getByText('Release day')).toBeInTheDocument();
	});

	it('renders a replacement popup body when one is given', () => {
		const {container} = render(
			<ContributionChart
				entries={ENTRIES}
				tooltipContent={(date, item, count) => <span>{'count ' + count}</span>}></ContributionChart>
		);
		fireEvent.mouseEnter(triggerAt(container, 2));
		settleTimers();
		expect(screen.getByText('count 8')).toBeInTheDocument();
	});

	it('drops the hover card entirely when the tooltip is turned off', () => {
		const {container} = render(<ContributionChart entries={ENTRIES} tooltip={false}></ContributionChart>);
		expect(container.querySelector('.blue-orange-hover-card')).toBeNull();
		expect(squares(container)).toHaveLength(4);
	});

	it('reports the day that was clicked', () => {
		const onDayClick = vi.fn();
		const {container} = render(<ContributionChart entries={ENTRIES} onDayClick={onDayClick}></ContributionChart>);
		fireEvent.click(squares(container)[1]);
		expect(onDayClick).toHaveBeenCalledWith(expect.any(Date), ENTRIES[1], 4);
	});

	it('falls back to a message when there is nothing to draw', () => {
		const {container} = render(<ContributionChart entries={[]} emptyMessage="Nothing yet"></ContributionChart>);
		expect(screen.getByText('Nothing yet')).toBeInTheDocument();
		expect(container.querySelector('.blue-orange-contribution-chart-grid')).toBeNull();
	});

	it('draws a swatch per shade in the legend', () => {
		const {container} = render(<ContributionChart entries={ENTRIES}></ContributionChart>);
		expect(container.querySelectorAll('.blue-orange-contribution-chart-legend-swatch'))
			.toHaveLength(CONTRIBUTION_LEVEL_COLORS.length);
		expect(screen.getByText('Less')).toBeInTheDocument();
		expect(screen.getByText('More')).toBeInTheDocument();
	});

	it('describes each square for a screen reader', () => {
		const {container} = render(
			<ContributionChart entries={ENTRIES} dateFormatter={isoDay}></ContributionChart>
		);
		expect(squares(container)[1]).toHaveAttribute('aria-label', '4 contributions on 2026-01-05');
		expect(squares(container)[0]).toHaveAttribute('aria-label', 'No contributions on 2026-01-04');
	});

	describe('toContributionDate', () => {

		it('reads a bare date as a local day rather than a UTC instant', () => {
			const date = toContributionDate('2026-01-04');
			expect(date.getFullYear()).toBe(2026);
			expect(date.getMonth()).toBe(0);
			expect(date.getDate()).toBe(4);
		});

		it('passes a Date straight through', () => {
			const given = new Date(2026, 0, 4);
			expect(toContributionDate(given)).toBe(given);
		});
	});

	describe('contributionTotal', () => {

		it('adds up every count', () => {
			expect(contributionTotal(ENTRIES)).toBe(24);
		});

		it('leaves negative counts out rather than subtracting them', () => {
			expect(contributionTotal([entry('2026-01-04', 5), entry('2026-01-05', -3)])).toBe(5);
		});
	});
});
