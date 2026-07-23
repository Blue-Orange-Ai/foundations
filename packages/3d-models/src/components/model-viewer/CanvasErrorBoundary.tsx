import React from 'react';

interface Props {
	fallback?: React.ReactNode;
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
}

/**
 * Wraps the WebGL canvas so a renderer failure (context loss, unsupported GPU)
 * degrades to a fallback message instead of taking down the whole page.
 *
 * Error boundaries must be class components — this is the one deliberate
 * exception to the FC-only convention in this package.
 */
export class CanvasErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="foundations-3d-canvas-error">
						<i className="ri-error-warning-line" />
						<span>3D view unavailable on this device.</span>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
