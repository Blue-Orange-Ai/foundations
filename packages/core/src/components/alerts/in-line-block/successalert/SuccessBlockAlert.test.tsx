import React from 'react';
import {render, screen} from '@testing-library/react';
import {SuccessBlockAlert} from './SuccessBlockAlert';

describe('SuccessBlockAlert', () => {

    it('renders without crashing', () => {
        render(<SuccessBlockAlert title="Success"/>);
        expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('renders with the success class name appended', () => {
        const {container} = render(<SuccessBlockAlert title="Success"/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-default-alert');
        expect(root.className).toContain('blue-orange-success-alert');
    });

    it('uses the ri-checkbox-circle-fill icon', () => {
        const {container} = render(<SuccessBlockAlert title="Success"/>);
        const iconEl = container.querySelector('.blue-orange-default-alert-icon i');
        expect(iconEl!.className).toBe('ri-checkbox-circle-fill');
    });

    it('renders the title', () => {
        render(<SuccessBlockAlert title="Operation complete"/>);
        expect(screen.getByText('Operation complete')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(<SuccessBlockAlert title="Success" description="All good"/>);
        expect(screen.getByText('All good')).toBeInTheDocument();
    });

    it('does not render the description element when not provided', () => {
        const {container} = render(<SuccessBlockAlert title="Success"/>);
        expect(container.querySelector('.blue-orange-default-alert-main-body-description')).toBeNull();
    });

    it('renders the action when provided', () => {
        const {container} = render(<SuccessBlockAlert title="Success" action={<button>Undo</button>}/>);
        expect(screen.getByText('Undo')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-default-alert-action')).toBeInTheDocument();
    });
});
