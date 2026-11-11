import React, {useState} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Trace} from './Trace';
import {TraceStatus} from './TraceContext';
import {TraceLine} from '../trace-line/TraceLine';
import {TraceIcon} from '../trace-icon/TraceIcon';
import {TraceTitle} from '../trace-title/TraceTitle';
import {TraceDescription} from '../trace-description/TraceDescription';
import {TraceCollapsible} from '../trace-collapsible/TraceCollapsible';
import {TraceCollapsibleTrigger} from '../trace-collapsible-trigger/TraceCollapsibleTrigger';
import {TraceCollapsibleContent} from '../trace-collapsible-content/TraceCollapsibleContent';

const renderCollapsible = (props: React.ComponentProps<typeof TraceCollapsible> = {}) => {
	return render(
		<Trace>
			<TraceCollapsible {...props}>
				<TraceCollapsibleTrigger>
					<TraceLine>
						<TraceIcon icon="ri-terminal-line"></TraceIcon>
						<TraceTitle>Ran node --version</TraceTitle>
					</TraceLine>
				</TraceCollapsibleTrigger>
				<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
			</TraceCollapsible>
		</Trace>
	);
}

describe('Trace', () => {

	it('renders a line with its title and description', () => {
		const {container} = render(
			<Trace>
				<TraceLine>
					<TraceIcon icon="ri-terminal-line"></TraceIcon>
					<TraceTitle>Ran pnpm build</TraceTitle>
					<TraceDescription>2.4s</TraceDescription>
				</TraceLine>
			</Trace>
		);
		expect(container.querySelector('.blue-orange-trace')).toBeInTheDocument();
		expect(screen.getByText('Ran pnpm build')).toBeInTheDocument();
		expect(screen.getByText('2.4s')).toBeInTheDocument();
	});

	it('hides the icon from assistive tech', () => {
		const {container} = render(<TraceIcon icon="ri-terminal-line"></TraceIcon>);
		expect(container.querySelector('.blue-orange-trace-icon')).toHaveAttribute('aria-hidden', 'true');
		expect(container.querySelector('i.ri-terminal-line')).toBeInTheDocument();
	});

	it('spins the icon with the spinner', () => {
		const {container} = render(<TraceIcon spin></TraceIcon>);
		expect(container.querySelector('.blue-orange-spinner')).toBeInTheDocument();
	});

	it.each([
		[TraceStatus.RUNNING, 'blue-orange-trace-line-running', 'running'],
		[TraceStatus.ERROR, 'blue-orange-trace-line-error', 'error'],
		[TraceStatus.PENDING, 'blue-orange-trace-line-pending', 'pending'],
	])('marks a %s line', (status, className, dataStatus) => {
		const {container} = render(<TraceLine status={status}><TraceTitle>Step</TraceTitle></TraceLine>);
		const line = container.querySelector('.blue-orange-trace-line');
		expect(line).toHaveClass(className);
		expect(line).toHaveAttribute('data-status', dataStatus);
	});

	it('starts closed and opens on click', () => {
		const {container} = renderCollapsible();
		const trigger = screen.getByRole('button', {name: /Ran node --version/});
		const content = container.querySelector('.blue-orange-trace-collapsible-content')!;
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(content).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByText('v24.18.0')).not.toBeInTheDocument();

		fireEvent.click(trigger);

		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(content).toHaveAttribute('aria-hidden', 'false');
		expect(screen.getByText('v24.18.0')).toBeInTheDocument();
	});

	it('ties the trigger to the content it controls', () => {
		const {container} = renderCollapsible({defaultOpen: true});
		const trigger = screen.getByRole('button');
		const content = container.querySelector('.blue-orange-trace-collapsible-content')!;
		expect(trigger.getAttribute('aria-controls')).toBe(content.id);
		expect(screen.getByText('v24.18.0')).toBeInTheDocument();
	});

	it('drops the detail once the close animation ends', () => {
		const {container} = renderCollapsible({defaultOpen: true});
		fireEvent.click(screen.getByRole('button'));
		const content = container.querySelector('.blue-orange-trace-collapsible-content')!;
		// still shown while it animates shut
		expect(screen.getByText('v24.18.0')).toBeInTheDocument();
		fireEvent.transitionEnd(content);
		expect(screen.queryByText('v24.18.0')).not.toBeInTheDocument();
	});

	it('follows a controlled open prop and reports clicks', () => {
		const changes: Array<boolean> = [];
		const Controlled = () => {
			const [open, setOpen] = useState<boolean>(true);
			return (
				<TraceCollapsible open={open} onOpenChange={next => { changes.push(next); setOpen(next); }}>
					<TraceCollapsibleTrigger>
						<TraceLine><TraceTitle>Thought for 5s</TraceTitle></TraceLine>
					</TraceCollapsibleTrigger>
					<TraceCollapsibleContent>Detail</TraceCollapsibleContent>
				</TraceCollapsible>
			);
		}
		render(<Controlled></Controlled>);
		const trigger = screen.getByRole('button');
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		fireEvent.click(trigger);
		expect(changes).toEqual([false]);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not toggle when disabled', () => {
		render(
			<TraceCollapsible>
				<TraceCollapsibleTrigger disabled>
					<TraceLine><TraceTitle>Step</TraceTitle></TraceLine>
				</TraceCollapsibleTrigger>
				<TraceCollapsibleContent>Detail</TraceCollapsibleContent>
			</TraceCollapsible>
		);
		const trigger = screen.getByRole('button');
		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
});
