import React from 'react';
import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// ---------------------------------------------------------------------------
// The wrapper instantiates the real primitives BlueOrangeMap, which needs
// Leaflet and a laid-out DOM. We stand in for it with a recording double so the
// tests exercise the wrapper's own logic — constructor wiring, the imperative
// handle and event plumbing — in isolation.
// ---------------------------------------------------------------------------

// Hoisted so the mock factory (which vitest lifts above the imports) can use it.
const { constructorCalls, instances } = vi.hoisted(() => ({
	constructorCalls: [] as Array<Array<any>>,
	instances: [] as Array<any>
}));

vi.mock('@blue-orange-ai/primitives-map', () => {
	class BlueOrangeMap {
		constructor(...args: Array<any>) {
			constructorCalls.push(args);
			instances.push(this);
		}
		getVisibleMapCoordinates = vi.fn(() => ({north: 1, south: 0, east: 1, west: 0}));
		getMapState = vi.fn(() => ({zoom: 14}));
		changeBaseLayer = vi.fn();
		updateOverlayLayer = vi.fn();
		addLayer = vi.fn();
		removeLayer = vi.fn();
		addMarker = vi.fn();
		getMarker = vi.fn((id: string) => ({id: id}));
		updateMarker = vi.fn();
		removeMarker = vi.fn();
		addShape = vi.fn();
		getShape = vi.fn((id: string) => ({id: id}));
		updateShape = vi.fn();
		removeShape = vi.fn();
		addTrack = vi.fn();
		getTrack = vi.fn((id: string) => ({id: id}));
		updateTrack = vi.fn();
		removeTrack = vi.fn();
		createArc = vi.fn(() => ({id: 'arc-1'}));
		updateArc = vi.fn(() => ({id: 'arc-1'}));
		createArrow = vi.fn(() => ({id: 'arrow-1'}));
		updateArrow = vi.fn(() => ({id: 'arrow-1'}));
		createGroup = vi.fn(() => 'group-1');
		getGroup = vi.fn((id: string) => ({id: id, name: id, markers: [], shapes: [], tracks: []}));
		getAllGroups = vi.fn(() => ({'group-1': {id: 'group-1', name: 'G', markers: [], shapes: [], tracks: []}}));
		getGroupObjects = vi.fn(() => ({markers: [], shapes: [], tracks: []}));
		addMarkerToGroup = vi.fn(() => true);
		addShapeToGroup = vi.fn(() => true);
		addTrackToGroup = vi.fn(() => true);
		removeMarkerFromGroup = vi.fn(() => true);
		removeShapeFromGroup = vi.fn(() => true);
		removeTrackFromGroup = vi.fn(() => true);
		selectGroup = vi.fn();
		unselectGroup = vi.fn();
		deleteGroup = vi.fn();
		selectShape = vi.fn();
		unselectShape = vi.fn();
		selectMarker = vi.fn();
		unselectMarker = vi.fn();
		selectTrack = vi.fn();
		unselectTrack = vi.fn();
		clearAllSelectedObjects = vi.fn();
		removeSelectedObjects = vi.fn();
		getSelectedObjects = vi.fn(() => ({markers: [], shapes: [], tracks: []}));
	}
	return { BlueOrangeMap: BlueOrangeMap };
});

import { BlueOrangeMapHandle, BlueOrangeMapWrapper } from './BlueOrangeMapWrapper';

const EMPTY_SELECTION = {markers: [], shapes: [], tracks: []};

const latest = () => instances[instances.length - 1];

const getMapEl = (container: HTMLElement): HTMLElement =>
	container.querySelector('.blue-orange-map-parent') as HTMLElement;

const fire = (el: HTMLElement, type: string, detail?: any) =>
	act(() => {
		el.dispatchEvent(new CustomEvent(type, {detail}));
	});

const renderWithRef = (props: any = {}) => {
	const ref = React.createRef<BlueOrangeMapHandle>();
	const utils = render(<BlueOrangeMapWrapper ref={ref} {...props}/>);
	return {ref, ...utils};
};

beforeEach(() => {
	constructorCalls.length = 0;
	instances.length = 0;
});

describe('BlueOrangeMapWrapper — construction', () => {

	test('renders the map parent element', () => {
		const {container} = render(<BlueOrangeMapWrapper/>);
		expect(getMapEl(container)).toBeInTheDocument();
	});

	test('constructs the map once with the parent element and empty collections', () => {
		const {container} = render(<BlueOrangeMapWrapper/>);
		expect(constructorCalls).toHaveLength(1);
		const [element, markers, shapes, tracks] = constructorCalls[0];
		expect(element).toBe(getMapEl(container));
		expect(markers).toEqual([]);
		expect(shapes).toEqual([]);
		expect(tracks).toEqual([]);
	});

	test('passes markers, shapes, tracks, colors, defaultMarker and options through in order', () => {
		const markers = [{id: 'm1'}] as any;
		const shapes = [{id: 's1'}] as any;
		const tracks = [{id: 't1'}] as any;
		const colors = {polygon: {active: '#000'}} as any;
		const defaultMarker = {html: '<i></i>'} as any;
		const options = {center: [1, 2], zoom: 10} as any;

		render(
			<BlueOrangeMapWrapper
				markers={markers}
				shapes={shapes}
				tracks={tracks}
				colors={colors}
				defaultMarker={defaultMarker}
				options={options}
			/>
		);

		expect(constructorCalls[0].slice(1)).toEqual([markers, shapes, tracks, colors, defaultMarker, options]);
	});

	test('hands the instance back through the instance callback', () => {
		const instance = vi.fn();
		render(<BlueOrangeMapWrapper instance={instance}/>);
		expect(instance).toHaveBeenCalledWith(latest());
	});

	test('does not reconstruct the map on re-render', () => {
		const {rerender} = render(<BlueOrangeMapWrapper/>);
		rerender(<BlueOrangeMapWrapper options={{zoom: 9} as any}/>);
		expect(constructorCalls).toHaveLength(1);
	});
});

describe('BlueOrangeMapWrapper — imperative handle', () => {

	test('getMap returns the underlying instance', () => {
		const {ref} = renderWithRef();
		expect(ref.current!.getMap()).toBe(latest());
	});

	test('delegates viewport and state reads', () => {
		const {ref} = renderWithRef();
		expect(ref.current!.getMapState()).toEqual({zoom: 14});
		expect(ref.current!.getVisibleMapCoordinates()).toEqual({north: 1, south: 0, east: 1, west: 0});
	});

	test('delegates marker, shape and track operations', () => {
		const {ref} = renderWithRef();
		const map = latest();
		const marker = {id: 'm1'} as any;
		const shape = {id: 's1'} as any;
		const track = {id: 't1'} as any;

		ref.current!.addMarker(marker, true);
		ref.current!.updateMarker(marker);
		ref.current!.removeMarker('m1');
		expect(map.addMarker).toHaveBeenCalledWith(marker, true);
		expect(map.updateMarker).toHaveBeenCalledWith(marker);
		expect(map.removeMarker).toHaveBeenCalledWith('m1');
		expect(ref.current!.getMarker('m1')).toEqual({id: 'm1'});

		ref.current!.addShape(shape);
		ref.current!.removeShape('s1');
		expect(map.addShape).toHaveBeenCalledWith(shape, undefined);
		expect(map.removeShape).toHaveBeenCalledWith('s1');

		ref.current!.addTrack(track);
		ref.current!.removeTrack('t1');
		expect(map.addTrack).toHaveBeenCalledWith(track, undefined);
		expect(map.removeTrack).toHaveBeenCalledWith('t1');
	});

	test('delegates arcs and arrows', () => {
		const {ref} = renderWithRef();
		const map = latest();
		const arc = {center: {lat: 0, lng: 0}, radius: 10, startAngle: 0, endAngle: 90} as any;
		const arrow = {base: {lat: 0, lng: 0}, angle: 0, length: 10} as any;

		expect(ref.current!.createArc(arc)).toEqual({id: 'arc-1'});
		expect(ref.current!.updateArc('arc-1', arc)).toEqual({id: 'arc-1'});
		expect(ref.current!.createArrow(arrow)).toEqual({id: 'arrow-1'});
		expect(ref.current!.updateArrow('arrow-1', arrow)).toEqual({id: 'arrow-1'});
		expect(map.createArc).toHaveBeenCalledWith(arc);
		expect(map.updateArrow).toHaveBeenCalledWith('arrow-1', arrow);
	});

	test('delegates group operations', () => {
		const {ref} = renderWithRef();
		const map = latest();

		expect(ref.current!.createGroup('g', 'Group')).toBe('group-1');
		expect(map.createGroup).toHaveBeenCalledWith('g', 'Group');
		expect(ref.current!.addShapeToGroup('s1', 'group-1')).toBe(true);
		expect(ref.current!.addMarkerToGroup('m1', 'group-1')).toBe(true);
		expect(ref.current!.addTrackToGroup('t1', 'group-1')).toBe(true);
		expect(ref.current!.removeShapeFromGroup('s1')).toBe(true);
		expect(Object.keys(ref.current!.getAllGroups())).toEqual(['group-1']);
		expect(ref.current!.getGroupObjects('group-1')).toEqual(EMPTY_SELECTION);

		ref.current!.selectGroup('group-1');
		ref.current!.unselectGroup('group-1');
		ref.current!.deleteGroup('group-1', false);
		expect(map.selectGroup).toHaveBeenCalledWith('group-1');
		expect(map.unselectGroup).toHaveBeenCalledWith('group-1');
		expect(map.deleteGroup).toHaveBeenCalledWith('group-1', false);
	});

	test('delegates selection operations', () => {
		const {ref} = renderWithRef();
		const map = latest();
		const marker = {id: 'm1'} as any;

		ref.current!.selectMarker(marker);
		ref.current!.unselectMarker(marker);
		ref.current!.clearAllSelectedObjects(['m1']);
		ref.current!.removeSelectedObjects();
		expect(map.selectMarker).toHaveBeenCalledWith(marker);
		expect(map.unselectMarker).toHaveBeenCalledWith(marker);
		expect(map.clearAllSelectedObjects).toHaveBeenCalledWith(['m1']);
		expect(map.removeSelectedObjects).toHaveBeenCalled();
		expect(ref.current!.getSelectedObjects()).toEqual(EMPTY_SELECTION);
	});

	test('delegates layer operations', () => {
		const {ref} = renderWithRef();
		const map = latest();
		const layer = {name: 'Base', url: 'http://tiles.test/{z}/{x}/{y}.png'} as any;

		ref.current!.changeBaseLayer(layer);
		ref.current!.updateOverlayLayer(layer);
		ref.current!.addLayer('extra', true);
		ref.current!.removeLayer('extra');
		expect(map.changeBaseLayer).toHaveBeenCalledWith(layer);
		expect(map.updateOverlayLayer).toHaveBeenCalledWith(layer);
		expect(map.addLayer).toHaveBeenCalledWith('extra', true);
		expect(map.removeLayer).toHaveBeenCalledWith('extra');
	});
});

describe('BlueOrangeMapWrapper — events', () => {

	test('reports selection changes', () => {
		const onSelectionChange = vi.fn();
		const {container} = render(<BlueOrangeMapWrapper onSelectionChange={onSelectionChange}/>);
		fire(getMapEl(container), 'blueorangemapselectionchange', {selection: EMPTY_SELECTION});
		expect(onSelectionChange).toHaveBeenCalledWith(EMPTY_SELECTION);
	});

	test('reports objects the user draws, with the map state', () => {
		const onObjectsCreated = vi.fn();
		const {container} = render(<BlueOrangeMapWrapper onObjectsCreated={onObjectsCreated}/>);
		fire(getMapEl(container), 'blueorangemapobjectscreatedbyuser', {
			selection: EMPTY_SELECTION,
			mapState: {zoom: 14}
		});
		expect(onObjectsCreated).toHaveBeenCalledWith(EMPTY_SELECTION, {zoom: 14});
	});

	test('reports deletions', () => {
		const onObjectsDeleted = vi.fn();
		const {container} = render(<BlueOrangeMapWrapper onObjectsDeleted={onObjectsDeleted}/>);
		fire(getMapEl(container), 'blueorangemapobjectsdeleted', {selection: EMPTY_SELECTION});
		expect(onObjectsDeleted).toHaveBeenCalledWith(EMPTY_SELECTION);
	});

	test('reports groups created and removed from the toolbar', () => {
		const onGroupCreated = vi.fn();
		const onGroupRemoved = vi.fn();
		const {container} = render(
			<BlueOrangeMapWrapper onGroupCreated={onGroupCreated} onGroupRemoved={onGroupRemoved}/>
		);
		const group = {id: 'group-1', name: 'G', markers: [], shapes: [], tracks: []};
		fire(getMapEl(container), 'blueorangemapgroupcreated', {groupId: 'group-1', group: group});
		fire(getMapEl(container), 'blueorangemapgroupremoved', {groupIds: ['group-1']});
		expect(onGroupCreated).toHaveBeenCalledWith('group-1', group);
		expect(onGroupRemoved).toHaveBeenCalledWith(['group-1']);
	});

	test('calls the latest callback after a re-render', () => {
		const first = vi.fn();
		const second = vi.fn();
		const {container, rerender} = render(<BlueOrangeMapWrapper onSelectionChange={first}/>);
		rerender(<BlueOrangeMapWrapper onSelectionChange={second}/>);
		fire(getMapEl(container), 'blueorangemapselectionchange', {selection: EMPTY_SELECTION});
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledWith(EMPTY_SELECTION);
	});
});
