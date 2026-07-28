import { render } from '@testing-library/react';
import { IframeCanvas } from './IframeCanvas';

describe('IframeCanvas', () => {
    test('renders an iframe', () => {
        const { container } = render(
            <IframeCanvas width={375} height={667}>
                <div>hello</div>
            </IframeCanvas>
        );
        const iframe = container.querySelector('iframe');
        expect(iframe).not.toBeNull();
    });

    test('applies logical dimensions to the frame in fixed mode', () => {
        const { container } = render(
            <IframeCanvas width={375} height={667} zoom={1}>
                <div>hello</div>
            </IframeCanvas>
        );
        const iframe = container.querySelector('iframe') as HTMLIFrameElement;
        expect(iframe.style.width).toBe('375px');
        expect(iframe.style.height).toBe('667px');
    });

    test('fills the pane in responsive mode', () => {
        const { container } = render(
            <IframeCanvas width={null} height={null}>
                <div>hello</div>
            </IframeCanvas>
        );
        const iframe = container.querySelector('iframe') as HTMLIFrameElement;
        expect(iframe.style.width).toBe('100%');
        expect(iframe.style.height).toBe('100%');
    });
});
