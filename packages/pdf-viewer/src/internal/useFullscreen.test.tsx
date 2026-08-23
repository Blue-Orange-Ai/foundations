import React, { useRef } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { usePdfFullscreen } from './useFullscreen';

/** jsdom implements neither the Fullscreen API nor its state, so stub both. */
const installFullscreenApi = () => {
	const requestFullscreen = vi.fn(function (this: Element) {
		Object.defineProperty(document, 'fullscreenElement', {
			value: this,
			configurable: true,
		});
		document.dispatchEvent(new Event('fullscreenchange'));
		return Promise.resolve();
	});
	const exitFullscreen = vi.fn(() => {
		Object.defineProperty(document, 'fullscreenElement', {
			value: null,
			configurable: true,
		});
		document.dispatchEvent(new Event('fullscreenchange'));
		return Promise.resolve();
	});

	Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true });
	Object.defineProperty(document, 'exitFullscreen', {
		value: exitFullscreen,
		configurable: true,
	});
	Object.defineProperty(Element.prototype, 'requestFullscreen', {
		value: requestFullscreen,
		configurable: true,
	});

	return { requestFullscreen, exitFullscreen };
};

const Harness: React.FC = () => {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const fullscreen = usePdfFullscreen(rootRef);
	return (
		<div ref={rootRef} data-testid="root">
			<span data-testid="state">{String(fullscreen.isFullscreen)}</span>
			<button onClick={() => fullscreen.toggle()}>toggle</button>
		</div>
	);
};

describe('usePdfFullscreen', () => {
	let api: ReturnType<typeof installFullscreenApi>;

	beforeEach(() => {
		api = installFullscreenApi();
	});

	afterEach(() => {
		Object.defineProperty(document, 'fullscreenElement', {
			value: null,
			configurable: true,
		});
	});

	it('requests fullscreen on the root element and tracks the state', () => {
		render(<Harness />);

		expect(screen.getByTestId('state')).toHaveTextContent('false');

		fireEvent.click(screen.getByText('toggle'));

		expect(api.requestFullscreen).toHaveBeenCalledTimes(1);
		expect(api.requestFullscreen.mock.instances[0]).toBe(screen.getByTestId('root'));
		expect(screen.getByTestId('state')).toHaveTextContent('true');
	});

	it('exits fullscreen on a second toggle', () => {
		render(<Harness />);

		fireEvent.click(screen.getByText('toggle'));
		fireEvent.click(screen.getByText('toggle'));

		expect(api.exitFullscreen).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('state')).toHaveTextContent('false');
	});

	it('follows a fullscreen exit that the browser initiates (Esc)', () => {
		render(<Harness />);

		fireEvent.click(screen.getByText('toggle'));
		expect(screen.getByTestId('state')).toHaveTextContent('true');

		act(() => {
			Object.defineProperty(document, 'fullscreenElement', {
				value: null,
				configurable: true,
			});
			document.dispatchEvent(new Event('fullscreenchange'));
		});

		expect(screen.getByTestId('state')).toHaveTextContent('false');
	});
});
