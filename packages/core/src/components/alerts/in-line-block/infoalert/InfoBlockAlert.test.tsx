import React from 'react';
import {render, screen} from '@testing-library/react';
import {InfoBlockAlert} from './InfoBlockAlert';

describe('InfoBlockAlert', () => {

    it('renders without crashing', () => {
        render(<InfoBlockAlert title="Info"/>);
        expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('renders with only the default class name (no additional variant class)', () => {
        const {container} = render(<InfoBlockAlert title="Info"/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toBe('blue-orange-default-alert');
    });

    it('uses the default ri-lightbulb-fill icon', () => {
        const {container} = render(<InfoBlockAlert title="Info"/>);
        const iconEl = container.querySelector('.blue-orange-default-alert-icon i');
        expect(iconEl!.className).toBe('ri-lightbulb-fill');
    });

    it('renders the title', () => {
        render(<InfoBlockAlert title="Did you know?"/>);
        expect(screen.getByText('Did you know?')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(<InfoBlockAlert title="Info" description="Here is some info"/>);
        expect(screen.getByText('Here is some info')).toBeInTheDocument();
    });

    it('does not render the description element when not provided', () => {
        const {container} = render(<InfoBlockAlert title="Info"/>);
        expect(container.querySelector('.blue-orange-default-alert-main-body-description')).toBeNull();
    });

    it('renders the action when provided', () => {
        const {container} = render(<InfoBlockAlert title="Info" action={<button>Reload</button>}/>);
        expect(screen.getByText('Reload')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-default-alert-action')).toBeInTheDocument();
    });
});
