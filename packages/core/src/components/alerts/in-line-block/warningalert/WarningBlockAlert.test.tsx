import React from 'react';
import {render, screen} from '@testing-library/react';
import {WarningBlockAlert} from './WarningBlockAlert';

describe('WarningBlockAlert', () => {

    it('renders without crashing', () => {
        render(<WarningBlockAlert title="Warning"/>);
        expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('renders with the warning class name appended', () => {
        const {container} = render(<WarningBlockAlert title="Warning"/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-default-alert');
        expect(root.className).toContain('blue-orange-warning-alert');
    });

    it('uses the ri-alarm-warning-fill icon', () => {
        const {container} = render(<WarningBlockAlert title="Warning"/>);
        const iconEl = container.querySelector('.blue-orange-default-alert-icon i');
        expect(iconEl!.className).toBe('ri-alarm-warning-fill');
    });

    it('renders the title', () => {
        render(<WarningBlockAlert title="Be careful"/>);
        expect(screen.getByText('Be careful')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(<WarningBlockAlert title="Warning" description="Proceed with caution"/>);
        expect(screen.getByText('Proceed with caution')).toBeInTheDocument();
    });

    it('does not render the description element when not provided', () => {
        const {container} = render(<WarningBlockAlert title="Warning"/>);
        expect(container.querySelector('.blue-orange-default-alert-main-body-description')).toBeNull();
    });

    it('renders the action when provided', () => {
        const {container} = render(<WarningBlockAlert title="Warning" action={<button>Save</button>}/>);
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-default-alert-action')).toBeInTheDocument();
    });
});
