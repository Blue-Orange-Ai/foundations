import React from 'react';
import {render, screen} from '@testing-library/react';
import {DefaultBlockAlert} from './DefaultBlockAlert';

describe('DefaultBlockAlert', () => {

    // ── Rendering ──────────────────────────────────────────────

    it('renders without crashing', () => {
        render(<DefaultBlockAlert title="Test Alert"/>);
        expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });

    it('renders with the root class name', () => {
        const {container} = render(<DefaultBlockAlert title="Alert"/>);
        expect(container.querySelector('.blue-orange-default-alert')).toBeInTheDocument();
    });

    // ── title prop ─────────────────────────────────────────────

    it('renders the title text', () => {
        render(<DefaultBlockAlert title="Important Notice"/>);
        expect(screen.getByText('Important Notice')).toBeInTheDocument();
    });

    it('renders the title inside the correct class', () => {
        const {container} = render(<DefaultBlockAlert title="My Title"/>);
        const titleEl = container.querySelector('.blue-orange-default-alert-main-body-title');
        expect(titleEl).toBeInTheDocument();
        expect(titleEl!.textContent).toBe('My Title');
    });

    // ── description prop ───────────────────────────────────────

    it('renders the description when provided', () => {
        render(<DefaultBlockAlert title="Title" description="Some description"/>);
        expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('renders the description inside the correct class', () => {
        const {container} = render(<DefaultBlockAlert title="Title" description="Desc"/>);
        const descEl = container.querySelector('.blue-orange-default-alert-main-body-description');
        expect(descEl).toBeInTheDocument();
        expect(descEl!.textContent).toBe('Desc');
    });

    it('does not render the description element when description is undefined', () => {
        const {container} = render(<DefaultBlockAlert title="Title"/>);
        const descEl = container.querySelector('.blue-orange-default-alert-main-body-description');
        expect(descEl).toBeNull();
    });

    it('renders the description when it is an empty string', () => {
        const {container} = render(<DefaultBlockAlert title="Title" description=""/>);
        // empty string is not undefined, so the element should still not render
        // Actually: description !== undefined is true for "", so it will render
        const descEl = container.querySelector('.blue-orange-default-alert-main-body-description');
        expect(descEl).toBeInTheDocument();
        expect(descEl!.textContent).toBe('');
    });

    // ── icon prop ──────────────────────────────────────────────

    it('renders the default icon (ri-lightbulb-fill) when no icon is provided', () => {
        const {container} = render(<DefaultBlockAlert title="Title"/>);
        const iconEl = container.querySelector('.blue-orange-default-alert-icon i');
        expect(iconEl).toBeInTheDocument();
        expect(iconEl!.className).toBe('ri-lightbulb-fill');
    });

    it('renders a custom icon when provided', () => {
        const {container} = render(<DefaultBlockAlert title="Title" icon="ri-alert-fill"/>);
        const iconEl = container.querySelector('.blue-orange-default-alert-icon i');
        expect(iconEl).toBeInTheDocument();
        expect(iconEl!.className).toBe('ri-alert-fill');
    });

    it('renders the icon inside the correct container class', () => {
        const {container} = render(<DefaultBlockAlert title="Title"/>);
        const iconContainer = container.querySelector('.blue-orange-default-alert-icon');
        expect(iconContainer).toBeInTheDocument();
        expect(iconContainer!.querySelector('i')).toBeInTheDocument();
    });

    // ── className prop ─────────────────────────────────────────

    it('uses only the default class when className is undefined', () => {
        const {container} = render(<DefaultBlockAlert title="Title"/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toBe('blue-orange-default-alert');
    });

    it('appends the custom className to the default class', () => {
        const {container} = render(<DefaultBlockAlert title="Title" className="blue-orange-error-alert"/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toBe('blue-orange-default-alert blue-orange-error-alert');
    });

    // ── DOM structure ──────────────────────────────────────────

    it('has icon section before main body section', () => {
        const {container} = render(<DefaultBlockAlert title="Title" description="Desc"/>);
        const root = container.querySelector('.blue-orange-default-alert')!;
        const children = root.children;
        expect(children[0].classList.contains('blue-orange-default-alert-icon')).toBe(true);
        expect(children[1].classList.contains('blue-orange-default-alert-main-body')).toBe(true);
    });

    it('renders main body with title and description in correct order', () => {
        const {container} = render(<DefaultBlockAlert title="Title" description="Desc"/>);
        const mainBody = container.querySelector('.blue-orange-default-alert-main-body')!;
        const children = mainBody.children;
        expect(children[0].classList.contains('blue-orange-default-alert-main-body-title')).toBe(true);
        expect(children[1].classList.contains('blue-orange-default-alert-main-body-description')).toBe(true);
    });

    // ── action prop (shared with the Toaster layout) ───────────

    it('renders the action when provided', () => {
        render(<DefaultBlockAlert title="Title" action={<button>Undo</button>}/>);
        expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('renders the action inside the correct container', () => {
        const {container} = render(<DefaultBlockAlert title="Title" action={<button>Undo</button>}/>);
        const actionContainer = container.querySelector('.blue-orange-default-alert-action');
        expect(actionContainer).toBeInTheDocument();
        expect(actionContainer!.querySelector('button')).toBeInTheDocument();
    });

    it('does not render the action container when action is not provided', () => {
        const {container} = render(<DefaultBlockAlert title="Title"/>);
        expect(container.querySelector('.blue-orange-default-alert-action')).toBeNull();
    });

    it('renders the action after the main body', () => {
        const {container} = render(<DefaultBlockAlert title="Title" description="Desc" action={<button>Go</button>}/>);
        const root = container.querySelector('.blue-orange-default-alert')!;
        const children = root.children;
        expect(children[0].classList.contains('blue-orange-default-alert-icon')).toBe(true);
        expect(children[1].classList.contains('blue-orange-default-alert-main-body')).toBe(true);
        expect(children[2].classList.contains('blue-orange-default-alert-action')).toBe(true);
    });

    // ── title prop is optional ─────────────────────────────────

    it('does not render the title element when title is undefined', () => {
        const {container} = render(<DefaultBlockAlert description="Only a description"/>);
        expect(container.querySelector('.blue-orange-default-alert-main-body-title')).toBeNull();
    });

    it('still renders the icon and body when title is undefined', () => {
        const {container} = render(<DefaultBlockAlert description="Only a description"/>);
        expect(container.querySelector('.blue-orange-default-alert-icon i')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-default-alert-main-body')).toBeInTheDocument();
    });

    // ── description-only option ────────────────────────────────

    it('applies the description-only modifier when there is a description but no title', () => {
        const {container} = render(<DefaultBlockAlert description="Only a description"/>);
        const body = container.querySelector('.blue-orange-default-alert-main-body');
        expect(body).toBeInTheDocument();
        expect(body!.classList.contains('blue-orange-default-alert-main-body-description-only')).toBe(true);
    });

    it('renders the description text in description-only mode', () => {
        render(<DefaultBlockAlert description="Just this line"/>);
        expect(screen.getByText('Just this line')).toBeInTheDocument();
    });

    it('does not apply the description-only modifier when a title is present', () => {
        const {container} = render(<DefaultBlockAlert title="Title" description="Desc"/>);
        const body = container.querySelector('.blue-orange-default-alert-main-body');
        expect(body!.classList.contains('blue-orange-default-alert-main-body-description-only')).toBe(false);
    });

    it('does not apply the description-only modifier when only a title is present', () => {
        const {container} = render(<DefaultBlockAlert title="Title"/>);
        const body = container.querySelector('.blue-orange-default-alert-main-body');
        expect(body!.classList.contains('blue-orange-default-alert-main-body-description-only')).toBe(false);
    });
});
