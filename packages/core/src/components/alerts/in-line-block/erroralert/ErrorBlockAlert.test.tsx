import React from 'react';
import {render, screen} from '@testing-library/react';
import {ErrorBlockAlert} from './ErrorBlockAlert';

describe('ErrorBlockAlert', () => {

    it('renders without crashing', () => {
        render(<ErrorBlockAlert title="Error"/>);
        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders with the error class name appended', () => {
        const {container} = render(<ErrorBlockAlert title="Error"/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-default-alert');
        expect(root.className).toContain('blue-orange-error-alert');
    });

    it('uses the ri-alert-fill icon', () => {
        const {container} = render(<ErrorBlockAlert title="Error"/>);
        const iconEl = container.querySelector('.blue-orange-default-alert-icon i');
        expect(iconEl!.className).toBe('ri-alert-fill');
    });

    it('renders the title', () => {
        render(<ErrorBlockAlert title="Something went wrong"/>);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(<ErrorBlockAlert title="Error" description="Please try again"/>);
        expect(screen.getByText('Please try again')).toBeInTheDocument();
    });

    it('does not render the description element when not provided', () => {
        const {container} = render(<ErrorBlockAlert title="Error"/>);
        expect(container.querySelector('.blue-orange-default-alert-main-body-description')).toBeNull();
    });

    it('renders the action when provided', () => {
        const {container} = render(<ErrorBlockAlert title="Error" action={<button>Retry</button>}/>);
        expect(screen.getByText('Retry')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-default-alert-action')).toBeInTheDocument();
    });

    it('supports a description-only alert (no title)', () => {
        const {container} = render(<ErrorBlockAlert description="Something failed"/>);
        expect(screen.getByText('Something failed')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-default-alert-main-body-title')).toBeNull();
        const body = container.querySelector('.blue-orange-default-alert-main-body');
        expect(body!.classList.contains('blue-orange-default-alert-main-body-description-only')).toBe(true);
    });
});
