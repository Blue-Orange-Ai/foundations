import React from 'react';
import {render, screen, act} from '@testing-library/react';
import {
	MultiStageLoading,
	MultiStageLoadingAlign,
	LoadingStage,
	LoadingStageStatus,
	resolveStageStatus
} from './MultiStageLoading';

const STAGES: Array<LoadingStage> = [
	{label: 'Connecting'},
	{label: 'Downloading', description: '12 of 40 files'},
	{label: 'Indexing'},
	{label: 'Finishing up'}
];

const rows = (container: HTMLElement) => {
	return Array.from(container.querySelectorAll('.blue-orange-multi-stage-loading-stage')) as Array<HTMLElement>;
}

const track = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-multi-stage-loading-track') as HTMLElement;
}

const viewport = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-multi-stage-loading-viewport') as HTMLElement;
}

/** The animation only switches on a frame after mount. */
const settleFrame = () => {
	act(() => {
		vi.advanceTimersByTime(32);
	});
}

describe('MultiStageLoading', () => {

	beforeEach(() => {
		vi.useFakeTimers({shouldAdvanceTime: true});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders a row for every stage', () => {
		const {container} = render(<MultiStageLoading stages={STAGES} activeStage={1}></MultiStageLoading>);
		expect(rows(container)).toHaveLength(4);
		expect(screen.getByText('Indexing')).toBeInTheDocument();
	});

	it('shows the stage description', () => {
		render(<MultiStageLoading stages={STAGES} activeStage={1}></MultiStageLoading>);
		expect(screen.getByText('12 of 40 files')).toBeInTheDocument();
	});

	it('offsets the track so the active stage sits in the middle slot', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={2} rowHeight={50}></MultiStageLoading>
		);
		expect(track(container).style.transform).toBe('translateY(-100px)');
		expect(viewport(container).style.paddingTop).toBe('50px');
	});

	it('sizes the viewport to the visible window', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={0} rowHeight={40} visibleNeighbours={2}></MultiStageLoading>
		);
		expect(viewport(container).style.height).toBe('200px');
		expect(viewport(container).style.paddingTop).toBe('80px');
	});

	it('leaves the active stage at full opacity and fades its neighbours', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={1} neighbourOpacity={0.4}></MultiStageLoading>
		);
		const drawn = rows(container);
		expect(drawn[0].style.opacity).toBe('0.4');
		expect(drawn[1].style.opacity).toBe('1');
		expect(drawn[2].style.opacity).toBe('0.4');
	});

	it('hides stages outside the window entirely', () => {
		const {container} = render(<MultiStageLoading stages={STAGES} activeStage={0}></MultiStageLoading>);
		expect(rows(container)[3].style.opacity).toBe('0');
	});

	it('marks stages complete, active and pending by position', () => {
		const {container} = render(<MultiStageLoading stages={STAGES} activeStage={2}></MultiStageLoading>);
		const drawn = rows(container);
		expect(drawn[0].className).toContain('blue-orange-multi-stage-loading-stage-complete');
		expect(drawn[2].className).toContain('blue-orange-multi-stage-loading-stage-active');
		expect(drawn[3].className).toContain('blue-orange-multi-stage-loading-stage-pending');
	});

	it('lets a stage declare its own status', () => {
		const stages: Array<LoadingStage> = [
			{label: 'Connecting'},
			{label: 'Downloading', status: LoadingStageStatus.ERROR}
		];
		const {container} = render(<MultiStageLoading stages={stages} activeStage={1}></MultiStageLoading>);
		expect(rows(container)[1].className).toContain('blue-orange-multi-stage-loading-stage-error');
	});

	it('spins the active stage icon', () => {
		const {container} = render(<MultiStageLoading stages={STAGES} activeStage={1}></MultiStageLoading>);
		const spinning = container.querySelectorAll('.blue-orange-multi-stage-loading-spin');
		expect(spinning).toHaveLength(1);
		expect(rows(container)[1].contains(spinning[0])).toBe(true);
	});

	it('stops spinning when the spinner is turned off', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={1} spinner={false}></MultiStageLoading>
		);
		expect(container.querySelectorAll('.blue-orange-multi-stage-loading-spin')).toHaveLength(0);
	});

	it('drops the icon column when icons are turned off', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={1} showIcons={false}></MultiStageLoading>
		);
		expect(container.querySelectorAll('.blue-orange-multi-stage-loading-icon')).toHaveLength(0);
	});

	it('takes an icon from the stage', () => {
		const stages: Array<LoadingStage> = [{label: 'Connecting', icon: <span data-testid="own-icon"></span>}];
		render(<MultiStageLoading stages={stages} activeStage={0}></MultiStageLoading>);
		expect(screen.getByTestId('own-icon')).toBeInTheDocument();
	});

	it('renders trailing content', () => {
		const stages: Array<LoadingStage> = [{label: 'Downloading', trailing: <span>2.4 MB</span>}];
		render(<MultiStageLoading stages={stages} activeStage={0}></MultiStageLoading>);
		expect(screen.getByText('2.4 MB')).toBeInTheDocument();
	});

	it('only animates the track once it has been on screen for a frame', () => {
		const {container} = render(<MultiStageLoading stages={STAGES} activeStage={1}></MultiStageLoading>);
		expect(track(container).className).not.toContain('blue-orange-multi-stage-loading-track-animated');
		settleFrame();
		expect(track(container).className).toContain('blue-orange-multi-stage-loading-track-animated');
	});

	it('moves the track when the active stage changes', () => {
		const {container, rerender} = render(
			<MultiStageLoading stages={STAGES} activeStage={0} rowHeight={46}></MultiStageLoading>
		);
		expect(track(container).style.transform).toBe('translateY(0px)');
		rerender(<MultiStageLoading stages={STAGES} activeStage={3} rowHeight={46}></MultiStageLoading>);
		expect(track(container).style.transform).toBe('translateY(-138px)');
	});

	it('clamps an active stage past the end of the list', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={9} rowHeight={46}></MultiStageLoading>
		);
		expect(track(container).style.transform).toBe('translateY(-138px)');
	});

	it('clamps a negative active stage', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={-3} rowHeight={46}></MultiStageLoading>
		);
		expect(track(container).style.transform).toBe('translateY(0px)');
	});

	it('shows the active stage on its own when there are no neighbours', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={1} rowHeight={40} visibleNeighbours={0}></MultiStageLoading>
		);
		expect(viewport(container).style.height).toBe('40px');
		expect(viewport(container).style.paddingTop).toBe('0px');
		expect(rows(container)[0].style.opacity).toBe('0');
	});

	it('draws a progress bar across the stages', () => {
		const {container} = render(
			<MultiStageLoading stages={STAGES} activeStage={1} progress={true}></MultiStageLoading>
		);
		const bar = container.querySelector('.blue-orange-multi-stage-loading-progress-bar') as HTMLElement;
		expect(bar.style.width).toBe(String((1 / 3) * 100) + '%');
	});

	it('leaves the progress bar out by default', () => {
		const {container} = render(<MultiStageLoading stages={STAGES} activeStage={1}></MultiStageLoading>);
		expect(container.querySelector('.blue-orange-multi-stage-loading-progress')).toBeNull();
	});

	it('writes the stage count', () => {
		render(<MultiStageLoading stages={STAGES} activeStage={1} showStageCount={true}></MultiStageLoading>);
		expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
	});

	it('takes a stage count format of its own', () => {
		render(
			<MultiStageLoading
				stages={STAGES}
				activeStage={1}
				showStageCount={true}
				stageCountFormatter={(active, total) => active + '/' + total}></MultiStageLoading>
		);
		expect(screen.getByText('1/4')).toBeInTheDocument();
	});

	it('labels itself with the stage it is on', () => {
		render(<MultiStageLoading stages={STAGES} activeStage={1}></MultiStageLoading>);
		expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Step 2 of 4: Downloading');
	});

	it('centres the rows when asked to', () => {
		const {container} = render(
			<MultiStageLoading
				stages={STAGES}
				activeStage={1}
				align={MultiStageLoadingAlign.CENTER}></MultiStageLoading>
		);
		expect(container.querySelector('.blue-orange-multi-stage-loading-center')).not.toBeNull();
	});

	it('reports the stage it has settled on once the move is over', () => {
		const settled = vi.fn();
		const {rerender} = render(
			<MultiStageLoading stages={STAGES} activeStage={0} duration={300} onStageSettled={settled}></MultiStageLoading>
		);
		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(settled).toHaveBeenCalledWith(0);

		rerender(
			<MultiStageLoading stages={STAGES} activeStage={1} duration={300} onStageSettled={settled}></MultiStageLoading>
		);
		expect(settled).toHaveBeenCalledTimes(1);
		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(settled).toHaveBeenCalledWith(1);
	});

	it('does not report a stage it moved away from before the move finished', () => {
		const settled = vi.fn();
		const {rerender} = render(
			<MultiStageLoading stages={STAGES} activeStage={0} duration={300} onStageSettled={settled}></MultiStageLoading>
		);
		act(() => {
			vi.advanceTimersByTime(100);
		});
		rerender(
			<MultiStageLoading stages={STAGES} activeStage={1} duration={300} onStageSettled={settled}></MultiStageLoading>
		);
		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(settled).toHaveBeenCalledTimes(1);
		expect(settled).toHaveBeenCalledWith(1);
	});

	it('falls back to a message when there are no stages', () => {
		render(<MultiStageLoading stages={[]} activeStage={0} emptyMessage={"Nothing running"}></MultiStageLoading>);
		expect(screen.getByText('Nothing running')).toBeInTheDocument();
	});

	describe('resolveStageStatus', () => {

		it('reads a stage before the active one as complete', () => {
			expect(resolveStageStatus({label: 'a'}, 0, 2)).toBe(LoadingStageStatus.COMPLETE);
		});

		it('reads the active stage as active', () => {
			expect(resolveStageStatus({label: 'a'}, 2, 2)).toBe(LoadingStageStatus.ACTIVE);
		});

		it('reads a stage after the active one as pending', () => {
			expect(resolveStageStatus({label: 'a'}, 3, 2)).toBe(LoadingStageStatus.PENDING);
		});

		it('lets the stage override its position', () => {
			expect(resolveStageStatus({label: 'a', status: LoadingStageStatus.ERROR}, 0, 2))
				.toBe(LoadingStageStatus.ERROR);
		});
	});
});
