import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {NavigationMenu} from './NavigationMenu';
import {NavigationMenuItem} from '../navigation-menu-item/NavigationMenuItem';
import {NavigationMenuLink} from '../navigation-menu-link/NavigationMenuLink';

const renderMenu = (onPricing: () => void = () => {}) => {
	return render(
		<NavigationMenu openDelay={0} closeDelay={0}>
			<NavigationMenuItem label="Products">
				<NavigationMenuLink label="Search"></NavigationMenuLink>
				<NavigationMenuLink label="Pipelines"></NavigationMenuLink>
			</NavigationMenuItem>
			<NavigationMenuItem label="Resources">
				<NavigationMenuLink label="Docs"></NavigationMenuLink>
			</NavigationMenuItem>
			<NavigationMenuItem label="Pricing" onClick={onPricing}></NavigationMenuItem>
			<NavigationMenuItem label="Status" disabled={true}></NavigationMenuItem>
		</NavigationMenu>
	);
}

const trigger = (label: string) => screen.getByText(label).closest('[role="menuitem"]')!;

describe('NavigationMenu', () => {

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

	it('renders a trigger per entry', () => {
		renderMenu();
		expect(screen.getByText('Products')).toBeInTheDocument();
		expect(screen.getByText('Pricing')).toBeInTheDocument();
	});

	it('keeps the panels closed to begin with', () => {
		renderMenu();
		expect(screen.queryByText('Search')).toBeNull();
	});

	it('opens a panel when its trigger is hovered', () => {
		renderMenu();
		fireEvent.mouseEnter(trigger('Products'));
		settleTimers();
		expect(screen.getByText('Search')).toBeInTheDocument();
	});

	it('opens a panel when its trigger is clicked', () => {
		renderMenu();
		fireEvent.click(trigger('Resources'));
		expect(screen.getByText('Docs')).toBeInTheDocument();
	});

	it('closes the panel when its trigger is clicked again', () => {
		renderMenu();
		fireEvent.click(trigger('Resources'));
		fireEvent.click(trigger('Resources'));
		expect(screen.queryByText('Docs')).toBeNull();
	});

	it('swaps panels when another trigger is hovered', () => {
		renderMenu();
		fireEvent.mouseEnter(trigger('Products'));
		settleTimers();
		fireEvent.mouseEnter(trigger('Resources'));
		settleTimers();
		expect(screen.getByText('Docs')).toBeInTheDocument();
		expect(screen.queryByText('Search')).toBeNull();
	});

	it('opens nothing for an entry without a panel', () => {
		renderMenu();
		fireEvent.mouseEnter(trigger('Pricing'));
		settleTimers();
		expect(screen.queryByText('Search')).toBeNull();
	});

	it('runs the handler of an entry without a panel', () => {
		const onPricing = vi.fn();
		renderMenu(onPricing);
		fireEvent.click(trigger('Pricing'));
		expect(onPricing).toHaveBeenCalled();
	});

	it('ignores a disabled entry', () => {
		renderMenu();
		fireEvent.click(trigger('Status'));
		expect(trigger('Status').getAttribute('aria-disabled')).toBe('true');
	});

	it('closes when the pointer leaves the bar', () => {
		const {container} = renderMenu();
		fireEvent.click(trigger('Products'));
		fireEvent.mouseLeave(container.querySelector('.blue-orange-navigation-menu')!);
		settleTimers();
		expect(screen.queryByText('Search')).toBeNull();
	});

	it('closes when the page is clicked away from the bar', () => {
		renderMenu();
		fireEvent.click(trigger('Products'));
		fireEvent.mouseDown(document.body);
		expect(screen.queryByText('Search')).toBeNull();
	});

	it('closes on escape', () => {
		renderMenu();
		fireEvent.click(trigger('Products'));
		fireEvent.keyDown(document, {key: 'Escape'});
		expect(screen.queryByText('Search')).toBeNull();
	});

	it('only opens on a click when hovering is turned off', () => {
		render(
			<NavigationMenu openOnHover={false} openDelay={0} closeDelay={0}>
				<NavigationMenuItem label="Products">
					<NavigationMenuLink label="Search"></NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenu>
		);
		fireEvent.mouseEnter(trigger('Products'));
		settleTimers();
		expect(screen.queryByText('Search')).toBeNull();
		fireEvent.click(trigger('Products'));
		expect(screen.getByText('Search')).toBeInTheDocument();
	});

	it('runs the handler on a link inside a panel', () => {
		const onClick = vi.fn();
		render(
			<NavigationMenu openDelay={0} closeDelay={0}>
				<NavigationMenuItem label="Products">
					<NavigationMenuLink label="Search" onClick={onClick}></NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenu>
		);
		fireEvent.click(trigger('Products'));
		fireEvent.click(screen.getByText('Search'));
		expect(onClick).toHaveBeenCalled();
	});
});
