import { fireEvent, render, screen } from '@testing-library/react';
import { ResponsivePreview } from './ResponsivePreview';

describe('ResponsivePreview', () => {
    test('renders the device presets and starts in responsive mode', () => {
        render(
            <ResponsivePreview>
                <div>content</div>
            </ResponsivePreview>
        );

        expect(screen.getByRole('button', { name: /Tablet/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Desktop/ })).toBeInTheDocument();
        // The "Responsive" preset is selected by default.
        expect(screen.getByRole('button', { name: /Responsive/ })).toHaveAttribute(
            'aria-pressed',
            'true'
        );
    });

    test('selecting a preset updates the dimension readout', () => {
        render(
            <ResponsivePreview>
                <div>content</div>
            </ResponsivePreview>
        );

        fireEvent.click(screen.getByRole('button', { name: /Tablet/ }));

        const readout = screen.getByText(/768/);
        expect(readout).toHaveTextContent('768');
        expect(readout).toHaveTextContent('1024');
    });

    test('rotate swaps width and height', () => {
        render(
            <ResponsivePreview>
                <div>content</div>
            </ResponsivePreview>
        );

        fireEvent.click(screen.getByRole('button', { name: /Tablet/ }));
        fireEvent.click(screen.getByRole('button', { name: /Rotate/ }));

        const readout = screen.getByText(/1024/);
        expect(readout).toHaveTextContent('1024');
        expect(readout).toHaveTextContent('768');
    });

    test('rotate is disabled while responsive', () => {
        render(
            <ResponsivePreview>
                <div>content</div>
            </ResponsivePreview>
        );

        expect(screen.getByRole('button', { name: /Rotate/ })).toBeDisabled();
    });
});
