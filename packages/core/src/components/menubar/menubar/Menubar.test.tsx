import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Menubar} from './Menubar';
import {MenubarMenu} from '../menubar-menu/MenubarMenu';
import {IContextMenuItem, IContextMenuType} from '../../contextmenu/contextmenu/ContextMenu';

const FILE_ITEMS: Array<IContextMenuItem> = [
	{label: 'New tab', type: IContextMenuType.CONTENT},
	{label: '', type: IContextMenuType.SEPARATOR},
	{
		label: 'Share',
		type: IContextMenuType.GROUP,
		children: [{label: 'Copy link', type: IContextMenuType.CONTENT}]
	}
];

const EDIT_ITEMS: Array<IContextMenuItem> = [
	{label: 'Undo', type: IContextMenuType.CONTENT}
];

const renderMenubar = (onClick: (item: IContextMenuItem, menuLabel: string) => void = () => {}) => {
	return render(
		<Menubar onClick={onClick}>
			<MenubarMenu label="File" items={FILE_ITEMS}></MenubarMenu>
			<MenubarMenu label="Edit" items={EDIT_ITEMS}></MenubarMenu>
			<MenubarMenu label="Locked" items={EDIT_ITEMS} disabled={true}></MenubarMenu>
		</Menubar>
	);
}

describe('Menubar', () => {

	it('renders a trigger per menu', () => {
		renderMenubar();
		expect(screen.getByText('File')).toBeInTheDocument();
		expect(screen.getByText('Edit')).toBeInTheDocument();
	});

	it('keeps every menu closed until one is clicked', () => {
		renderMenubar();
		expect(screen.queryByText('New tab')).toBeNull();
	});

	it('opens a menu on click', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		expect(screen.getByText('New tab')).toBeInTheDocument();
	});

	it('closes the menu when its trigger is clicked again', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		fireEvent.click(screen.getByText('File'));
		expect(screen.queryByText('New tab')).toBeNull();
	});

	it('swaps menus when the pointer moves across the open bar', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		fireEvent.mouseEnter(screen.getByText('Edit').closest('[role="menuitem"]')!);
		expect(screen.getByText('Undo')).toBeInTheDocument();
		expect(screen.queryByText('New tab')).toBeNull();
	});

	it('leaves the menus closed when the pointer crosses a closed bar', () => {
		renderMenubar();
		fireEvent.mouseEnter(screen.getByText('Edit').closest('[role="menuitem"]')!);
		expect(screen.queryByText('Undo')).toBeNull();
	});

	it('never opens a disabled menu', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('Locked'));
		expect(screen.queryByText('Undo')).toBeNull();
	});

	it('opens a submenu when a group is hovered', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		fireEvent.mouseEnter(screen.getByText('Share').closest('.blue-orange-context-menu-group')!);
		expect(screen.getByText('Copy link')).toBeInTheDocument();
	});

	it('reports the row that was clicked with the menu it came from', () => {
		const onClick = vi.fn();
		renderMenubar(onClick);
		fireEvent.click(screen.getByText('File'));
		fireEvent.click(screen.getByText('New tab'));
		expect(onClick).toHaveBeenCalledWith(expect.objectContaining({label: 'New tab'}), 'File');
	});

	it('closes once a row has been clicked', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		fireEvent.click(screen.getByText('New tab'));
		expect(screen.queryByText('New tab')).toBeNull();
	});

	it('prefers the handler on the menu itself', () => {
		const menuClick = vi.fn();
		render(
			<Menubar>
				<MenubarMenu label="File" items={FILE_ITEMS} onClick={menuClick}></MenubarMenu>
			</Menubar>
		);
		fireEvent.click(screen.getByText('File'));
		fireEvent.click(screen.getByText('New tab'));
		expect(menuClick).toHaveBeenCalledWith(expect.objectContaining({label: 'New tab'}));
	});

	it('closes when the page is clicked away from the bar', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		fireEvent.mouseDown(document.body);
		expect(screen.queryByText('New tab')).toBeNull();
	});

	it('closes on escape', () => {
		renderMenubar();
		fireEvent.click(screen.getByText('File'));
		fireEvent.keyDown(document, {key: 'Escape'});
		expect(screen.queryByText('New tab')).toBeNull();
	});

	it('opens the menu underneath the focused trigger with the down arrow', () => {
		renderMenubar();
		fireEvent.keyDown(screen.getByText('Edit').closest('[role="menuitem"]')!, {key: 'ArrowDown'});
		expect(screen.getByText('Undo')).toBeInTheDocument();
	});
});
