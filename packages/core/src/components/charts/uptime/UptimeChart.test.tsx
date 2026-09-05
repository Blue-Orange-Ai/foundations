import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {UptimeChart, calculateUptime, UPTIME_STATUS_COLORS} from './UptimeChart';
import {UptimeEntry, UptimeStatus} from '../types/ChartTypes';

const entry = (date: string, status: UptimeStatus, extra: Partial<UptimeEntry> = {}): UptimeEntry => {
	return {date: date, status: status, ...extra};
}

const ENTRIES: Array<UptimeEntry> = [
	entry('2026-01-01T00:00:00Z', UptimeStatus.OPERATIONAL),
	entry('2026-01-02T00:00:00Z', UptimeStatus.DEGRADED),
	entry('2026-01-03T00:00:00Z', UptimeStatus.MAJOR_OUTAGE)
];

const bars = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-uptime-chart-bar'));
}

const triggerAt = (container: HTMLElement, index: number) => {
	return container.querySelectorAll('.blue-orange-hover-card-trigger-cont')[index];
}

describe('UptimeChart', () => {

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

	it('draws one bar per entry', () => {
		const {container} = render(<UptimeChart entries={ENTRIES}></UptimeChart>);
		expect(bars(container)).toHaveLength(3);
	});

	it('colours each bar by its status', () => {
		const {container} = render(<UptimeChart entries={ENTRIES}></UptimeChart>);
		const drawn = bars(container) as Array<HTMLElement>;
		expect(drawn[0].style.backgroundColor).toBe('rgb(22, 163, 75)');
		expect(drawn[2].style.backgroundColor).toBe('rgb(225, 29, 72)');
	});

	it('lets an entry override its own colour', () => {
		const {container} = render(
			<UptimeChart entries={[entry('2026-01-01', UptimeStatus.OPERATIONAL, {color: '#000000'})]}></UptimeChart>
		);
		expect((bars(container)[0] as HTMLElement).style.backgroundColor).toBe('rgb(0, 0, 0)');
	});

	it('takes a status colour override', () => {
		const {container} = render(
			<UptimeChart
				entries={[entry('2026-01-01', UptimeStatus.OPERATIONAL)]}
				statusColors={{[UptimeStatus.OPERATIONAL]: '#123456'}}></UptimeChart>
		);
		expect((bars(container)[0] as HTMLElement).style.backgroundColor).toBe('rgb(18, 52, 86)');
	});

	it('shows the title and the worked out uptime in the header', () => {
		render(<UptimeChart entries={ENTRIES} title="API"></UptimeChart>);
		expect(screen.getByText('API')).toBeInTheDocument();
		// operational + degraded count as up, the outage does not: 200 / 3
		expect(screen.getByText('66.67 % uptime')).toBeInTheDocument();
	});

	it('prefers an explicitly given uptime', () => {
		render(<UptimeChart entries={ENTRIES} uptime={99.9} uptimePrecision={1}></UptimeChart>);
		expect(screen.getByText('99.9 % uptime')).toBeInTheDocument();
	});

	it('leaves the header out when there is nothing to put in it', () => {
		const {container} = render(<UptimeChart entries={ENTRIES} showUptime={false}></UptimeChart>);
		expect(container.querySelector('.blue-orange-uptime-chart-header')).toBeNull();
	});

	it('labels the footer with the window it covers', () => {
		render(<UptimeChart entries={ENTRIES}></UptimeChart>);
		expect(screen.getByText('3 days ago')).toBeInTheDocument();
		expect(screen.getByText('Today')).toBeInTheDocument();
	});

	it('opens a popup with the date and the status when a bar is hovered', () => {
		const {container} = render(<UptimeChart entries={ENTRIES} dateFormatter={date => date.toISOString().slice(0, 10)}></UptimeChart>);
		expect(screen.queryByText('Major outage')).toBeNull();
		fireEvent.mouseEnter(triggerAt(container, 2));
		settleTimers();
		expect(screen.getByText('2026-01-03')).toBeInTheDocument();
		expect(screen.getByText('Major outage')).toBeInTheDocument();
	});

	it('lists an entry incidents in the popup', () => {
		const withIncident = [entry('2026-01-03', UptimeStatus.PARTIAL_OUTAGE, {
			incidents: [{title: 'Elevated error rates', status: 'Investigating', duration: '14:02 – 15:20 UTC'}]
		})];
		const {container} = render(<UptimeChart entries={withIncident}></UptimeChart>);
		fireEvent.mouseEnter(triggerAt(container, 0));
		settleTimers();
		expect(screen.getByText('Elevated error rates')).toBeInTheDocument();
		expect(screen.getByText('Investigating · 14:02 – 15:20 UTC')).toBeInTheDocument();
	});

	it('renders a replacement popup body when one is given', () => {
		const {container} = render(
			<UptimeChart entries={ENTRIES} tooltipContent={(item, index) => <span>{'bar ' + index}</span>}></UptimeChart>
		);
		fireEvent.mouseEnter(triggerAt(container, 1));
		settleTimers();
		expect(screen.getByText('bar 1')).toBeInTheDocument();
	});

	it('drops the hover card entirely when the tooltip is turned off', () => {
		const {container} = render(<UptimeChart entries={ENTRIES} tooltip={false}></UptimeChart>);
		expect(container.querySelector('.blue-orange-hover-card')).toBeNull();
		expect(bars(container)).toHaveLength(3);
	});

	it('reports the entry that was clicked', () => {
		const onEntryClick = vi.fn();
		const {container} = render(<UptimeChart entries={ENTRIES} onEntryClick={onEntryClick}></UptimeChart>);
		fireEvent.click(bars(container)[1]);
		expect(onEntryClick).toHaveBeenCalledWith(ENTRIES[1], 1);
	});

	it('falls back to a message when there are no entries', () => {
		const {container} = render(<UptimeChart entries={[]} emptyMessage="Nothing yet"></UptimeChart>);
		expect(screen.getByText('Nothing yet')).toBeInTheDocument();
		expect(container.querySelector('.blue-orange-uptime-chart-bars')).toBeNull();
	});

	it('lists only the statuses present in the data in the legend', () => {
		render(<UptimeChart entries={ENTRIES} legend={true}></UptimeChart>);
		expect(screen.getByText('Operational')).toBeInTheDocument();
		expect(screen.getByText('Degraded performance')).toBeInTheDocument();
		expect(screen.queryByText('Under maintenance')).toBeNull();
	});

	it('sizes the bars evenly by default and fixes them when a width is given', () => {
		const {container: even} = render(<UptimeChart entries={ENTRIES}></UptimeChart>);
		expect((even.querySelector('.blue-orange-hover-card') as HTMLElement).style.flex).toBe('1 1 0px');

		const {container: fixed} = render(<UptimeChart entries={ENTRIES} barWidth={6}></UptimeChart>);
		expect((fixed.querySelector('.blue-orange-hover-card') as HTMLElement).style.width).toBe('6px');
	});

	it('describes each bar for a screen reader', () => {
		const {container} = render(
			<UptimeChart entries={ENTRIES} dateFormatter={date => date.toISOString().slice(0, 10)}></UptimeChart>
		);
		expect(bars(container)[0]).toHaveAttribute('aria-label', '2026-01-01: Operational');
	});

	describe('calculateUptime', () => {

		it('leaves periods with no data out of the average', () => {
			const result = calculateUptime([
				entry('2026-01-01', UptimeStatus.OPERATIONAL),
				entry('2026-01-02', UptimeStatus.NO_DATA),
				entry('2026-01-03', UptimeStatus.MAJOR_OUTAGE)
			]);
			expect(result).toBe(50);
		});

		it('takes an entry own figure over what its status implies', () => {
			const result = calculateUptime([
				entry('2026-01-01', UptimeStatus.MAJOR_OUTAGE, {uptime: 80}),
				entry('2026-01-02', UptimeStatus.OPERATIONAL, {uptime: 100})
			]);
			expect(result).toBe(90);
		});

		it('has nothing to report when every period is empty', () => {
			expect(calculateUptime([entry('2026-01-01', UptimeStatus.NO_DATA)])).toBeUndefined();
		});
	});

	it('exposes a colour for every status', () => {
		Object.values(UptimeStatus).forEach(status => {
			expect(UPTIME_STATUS_COLORS[status]).toBeTruthy();
		});
	});
});
