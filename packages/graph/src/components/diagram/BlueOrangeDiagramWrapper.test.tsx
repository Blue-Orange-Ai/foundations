import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

// Hoisted so the mock factory (which vitest lifts above the imports) can use it.
const { constructorCalls } = vi.hoisted(() => ({ constructorCalls: [] as Array<Array<any>> }));

vi.mock('@blue-orange-ai/primitives-graph', () => {
	class BlueOrangeDiagram {
		constructor(...args: Array<any>) {
			constructorCalls.push(args);
		}
		getShape(id: string) {
			return { id: id, type: 'rectangle' };
		}
	}
	return { BlueOrangeDiagram: BlueOrangeDiagram };
});

import { BlueOrangeDiagramWrapper } from './BlueOrangeDiagramWrapper';

describe('BlueOrangeDiagramWrapper', () => {

	test('creates the diagram with the supplied shapes, connections and options', () => {
		constructorCalls.length = 0;
		const shapes = [{ id: 'a', type: 'rectangle' }];
		const connections = [{ sourceId: 'a', targetId: 'b' }];
		render(<BlueOrangeDiagramWrapper shapes={shapes} connections={connections}
										 options={{ diagram: { showPalette: false } }} />);
		expect(constructorCalls.length).toBe(1);
		const [element, createdShapes, createdConnections, options] = constructorCalls[0];
		expect(element).toBeInstanceOf(HTMLElement);
		expect(createdShapes).toBe(shapes);
		expect(createdConnections).toBe(connections);
		expect(options.diagram.showPalette).toBe(false);
	});

	test('hands the created instance back through the instance callback', () => {
		constructorCalls.length = 0;
		let created: any = null;
		render(<BlueOrangeDiagramWrapper instance={(diagram) => { created = diagram; }} />);
		expect(created).not.toBeNull();
	});

	test('maps diagram events onto the matching props', () => {
		constructorCalls.length = 0;
		const shapeCreated = vi.fn();
		const shapeTextChanged = vi.fn();
		const shapeClicked = vi.fn();
		const { container } = render(<BlueOrangeDiagramWrapper shapeCreated={shapeCreated}
															   shapeTextChanged={shapeTextChanged}
															   shapeClicked={shapeClicked} />);
		const element = container.querySelector('.blue-orange-diagram-parent') as HTMLElement;

		element.dispatchEvent(new CustomEvent('blue-orange-diagram-shape-created', {
			detail: { shape: { id: 'a' } }
		}));
		expect(shapeCreated).toHaveBeenCalledWith({ id: 'a' });

		element.dispatchEvent(new CustomEvent('blue-orange-diagram-shape-text-changed', {
			detail: { id: 'a', text: 'Hello' }
		}));
		expect(shapeTextChanged).toHaveBeenCalledWith('a', 'Hello');

		const node = { id: 'a' };
		const clickEvent = { type: 'click' };
		element.dispatchEvent(new CustomEvent('blue-orange-graph-node-clicked', {
			detail: { node: node, clickEvent: clickEvent }
		}));
		expect(shapeClicked).toHaveBeenCalledWith({ id: 'a', type: 'rectangle' }, node, clickEvent);
	});

	test('routes the image tool through the imageRequested prop', () => {
		constructorCalls.length = 0;
		const imageRequested = vi.fn().mockReturnValue({ src: 'image.png' });
		render(<BlueOrangeDiagramWrapper imageRequested={imageRequested} />);
		const options = constructorCalls[0][3];
		const context = { x: 0, y: 0, kind: 'image' };
		expect(options.diagram.callbacks.image(context)).toEqual({ src: 'image.png' });
		expect(imageRequested).toHaveBeenCalledWith(context);
	});
});
