import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {IconText, IconTextPosition, IconTextSize} from './IconText';

describe('IconText', () => {

	it('renders the text it is given', () => {
		render(<IconText icon="ri-server-line">agent-demo-10</IconText>);
		expect(screen.getByText('agent-demo-10')).not.toBeNull();
	});

	it('renders the icon class it is given', () => {
		const {container} = render(<IconText icon="ri-server-line">agent-demo-10</IconText>);
		expect(container.querySelector('i.ri-server-line')).not.toBeNull();
	});

	it('renders nothing in place of the icon when none is given', () => {
		const {container} = render(<IconText>agent-demo-10</IconText>);
		expect(container.querySelector('.blue-orange-icon-text-icon')).toBeNull();
	});

	it('renders an icon element in place of an icon class', () => {
		const {container} = render(
			<IconText icon="ri-server-line" iconElement={<span>Dot</span>}>agent-demo-10</IconText>
		);
		expect(screen.getByText('Dot')).not.toBeNull();
		expect(container.querySelector('i.ri-server-line')).toBeNull();
	});

	it('puts the icon before the text by default', () => {
		const {container} = render(<IconText icon="ri-server-line">agent-demo-10</IconText>);
		const line = container.querySelector('.blue-orange-icon-text')!;
		expect(line.firstElementChild!.classList.contains('blue-orange-icon-text-icon')).toBe(true);
	});

	it('puts the icon after the text when asked to', () => {
		const {container} = render(
			<IconText icon="ri-arrow-right-line" iconPosition={IconTextPosition.RIGHT}>Next</IconText>
		);
		const line = container.querySelector('.blue-orange-icon-text')!;
		expect(line.lastElementChild!.classList.contains('blue-orange-icon-text-icon')).toBe(true);
	});

	it('mutes the icon by default', () => {
		const {container} = render(<IconText icon="ri-server-line">agent-demo-10</IconText>);
		expect(container.querySelector('.blue-orange-icon-text-muted-icon')).not.toBeNull();
	});

	it('leaves the icon at full strength when told not to mute it', () => {
		const {container} = render(
			<IconText icon="ri-server-line" mutedIcon={false}>agent-demo-10</IconText>
		);
		expect(container.querySelector('.blue-orange-icon-text-muted-icon')).toBeNull();
	});

	it('colours the icon on its own', () => {
		const {container} = render(
			<IconText icon="ri-checkbox-circle-fill" iconColor="green">Healthy</IconText>
		);
		const iconElement = container.querySelector('.blue-orange-icon-text-icon') as HTMLElement;
		expect(iconElement.style.color).toBe('green');
	});

	it('colours the whole line', () => {
		const {container} = render(<IconText icon="ri-error-warning-line" color="red">Down</IconText>);
		const line = container.querySelector('.blue-orange-icon-text') as HTMLElement;
		expect(line.style.color).toBe('red');
	});

	it('takes the size it is given', () => {
		const {container} = render(
			<IconText icon="ri-server-line" size={IconTextSize.SMALL}>agent-demo-10</IconText>
		);
		expect(container.querySelector('.blue-orange-icon-text-sm')).not.toBeNull();
	});

	it('sets no size of its own when it inherits one', () => {
		const {container} = render(
			<IconText icon="ri-server-line" size={IconTextSize.INHERIT}>agent-demo-10</IconText>
		);
		const line = container.querySelector('.blue-orange-icon-text')!;
		expect(line.className).not.toContain('blue-orange-icon-text-sm');
		expect(line.className).not.toContain('blue-orange-icon-text-md');
		expect(line.className).not.toContain('blue-orange-icon-text-lg');
	});

	it('takes the gap it is given', () => {
		const {container} = render(<IconText icon="ri-server-line" gap={12}>agent-demo-10</IconText>);
		const line = container.querySelector('.blue-orange-icon-text') as HTMLElement;
		expect(line.style.gap).toBe('12px');
	});

	it('truncates the text when asked to', () => {
		const {container} = render(
			<IconText icon="ri-server-line" truncate={true}>agent-demo-10</IconText>
		);
		expect(container.querySelector('.blue-orange-icon-text-truncated')).not.toBeNull();
	});

	it('sets the title so truncated text can still be read', () => {
		const {container} = render(
			<IconText icon="ri-server-line" truncate={true} title="agent-demo-10">agent-demo-10</IconText>
		);
		expect(container.querySelector('.blue-orange-icon-text')!.getAttribute('title')).toBe('agent-demo-10');
	});

	it('is not a button until it is given something to do', () => {
		const {container} = render(<IconText icon="ri-server-line">agent-demo-10</IconText>);
		const line = container.querySelector('.blue-orange-icon-text')!;
		expect(line.getAttribute('role')).toBeNull();
		expect(line.getAttribute('tabindex')).toBeNull();
	});

	it('becomes a button once it is given an onClick', () => {
		const {container} = render(
			<IconText icon="ri-server-line" onClick={() => {}}>agent-demo-10</IconText>
		);
		const line = container.querySelector('.blue-orange-icon-text')!;
		expect(line.getAttribute('role')).toBe('button');
		expect(line.getAttribute('tabindex')).toBe('0');
	});

	it('reports a click', () => {
		const onClick = vi.fn();
		render(<IconText icon="ri-server-line" onClick={onClick}>agent-demo-10</IconText>);
		fireEvent.click(screen.getByText('agent-demo-10'));
		expect(onClick).toHaveBeenCalled();
	});

	it('answers the keyboard like a button', () => {
		const onClick = vi.fn();
		const {container} = render(
			<IconText icon="ri-server-line" onClick={onClick}>agent-demo-10</IconText>
		);
		const line = container.querySelector('.blue-orange-icon-text')!;
		fireEvent.keyDown(line, {key: 'Enter'});
		fireEvent.keyDown(line, {key: ' '});
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it('ignores keys that are not enter or space', () => {
		const onClick = vi.fn();
		const {container} = render(
			<IconText icon="ri-server-line" onClick={onClick}>agent-demo-10</IconText>
		);
		fireEvent.keyDown(container.querySelector('.blue-orange-icon-text')!, {key: 'a'});
		expect(onClick).not.toHaveBeenCalled();
	});

	it('takes an inline style of its own', () => {
		const {container} = render(
			<IconText icon="ri-server-line" style={{marginTop: "8px"}}>agent-demo-10</IconText>
		);
		const line = container.querySelector('.blue-orange-icon-text') as HTMLElement;
		expect(line.style.marginTop).toBe('8px');
	});
});
