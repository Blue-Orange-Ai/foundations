import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

// Hoisted so the mock factory (which vitest lifts above the imports) can use them.
const { constructorCalls, themeCalls } = vi.hoisted(() => ({
	constructorCalls: [] as Array<Array<any>>,
	themeCalls: [] as Array<string>
}));

vi.mock('@blue-orange-ai/primitives-graph', () => {
	class BlueOrangeERDiagram {
		theme = 'light';
		constructor(...args: Array<any>) {
			constructorCalls.push(args);
		}
		static parseSql(sql: string) {
			return {
				entities: [{ id: 'parsed', name: sql.trim() }],
				relationships: [{ sourceTable: 'parsed', targetTable: 'parsed' }]
			};
		}
		getEntity(id: string) {
			return { id: id, name: id };
		}
		setTheme(theme: string) {
			this.theme = theme;
			themeCalls.push(theme);
			return this;
		}
	}
	return { BlueOrangeERDiagram: BlueOrangeERDiagram };
});

import { BlueOrangeERDiagramWrapper } from './BlueOrangeERDiagramWrapper';

describe('BlueOrangeERDiagramWrapper', () => {

	test('creates the diagram with the supplied entities, relationships and theme', () => {
		constructorCalls.length = 0;
		const entities = [{ id: 'customers', name: 'customers' }];
		render(<BlueOrangeERDiagramWrapper entities={entities} theme="dark" />);
		expect(constructorCalls.length).toBe(1);
		const [element, createdEntities, createdRelationships, options] = constructorCalls[0];
		expect(element).toBeInstanceOf(HTMLElement);
		expect(createdEntities).toBe(entities);
		expect(createdRelationships).toEqual([]);
		expect(options.er.theme).toBe('dark');
	});

	test('merges entities parsed from sql ahead of the supplied ones', () => {
		constructorCalls.length = 0;
		render(<BlueOrangeERDiagramWrapper sql="CREATE TABLE customers (id int PRIMARY KEY);"
										   entities={[{ id: 'extra' }]} />);
		const [, createdEntities, createdRelationships] = constructorCalls[0];
		expect(createdEntities.map((entity: any) => entity.id)).toEqual(['parsed', 'extra']);
		expect(createdRelationships.length).toBe(1);
	});

	test('maps er events onto the matching props', () => {
		constructorCalls.length = 0;
		const entityCreated = vi.fn();
		const columnClicked = vi.fn();
		const entityClicked = vi.fn();
		const { container } = render(<BlueOrangeERDiagramWrapper entityCreated={entityCreated}
																 columnClicked={columnClicked}
																 entityClicked={entityClicked} />);
		const element = container.querySelector('.blue-orange-er-diagram-parent') as HTMLElement;

		element.dispatchEvent(new CustomEvent('blue-orange-er-entity-created', {
			detail: { entity: { id: 'customers' } }
		}));
		expect(entityCreated).toHaveBeenCalledWith({ id: 'customers' });

		const columnDetail = { entityId: 'customers', column: { name: 'id' } };
		element.dispatchEvent(new CustomEvent('blue-orange-er-column-clicked', { detail: columnDetail }));
		expect(columnClicked).toHaveBeenCalledWith(columnDetail);

		const node = { id: 'customers' };
		const clickEvent = { type: 'click' };
		element.dispatchEvent(new CustomEvent('blue-orange-graph-node-clicked', {
			detail: { node: node, clickEvent: clickEvent }
		}));
		expect(entityClicked).toHaveBeenCalledWith({ id: 'customers', name: 'customers' }, node, clickEvent);
	});

	test('switches the theme when the theme prop changes', () => {
		constructorCalls.length = 0;
		themeCalls.length = 0;
		const { rerender } = render(<BlueOrangeERDiagramWrapper theme="light" />);
		expect(themeCalls).toEqual([]);
		rerender(<BlueOrangeERDiagramWrapper theme="dark" />);
		expect(themeCalls).toEqual(['dark']);
	});
});
