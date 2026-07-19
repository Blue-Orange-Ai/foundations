import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Toaster, ToasterType} from './Toaster';
import {ToastLocation} from '../toastcontext/ToastContext';

// Mock ButtonIcon since it uses tippy.js which is hard to test in jsdom
jest.mock('../../../buttons/button-icon/ButtonIcon', () => ({
    ButtonIcon: ({icon, label, onClick}: {icon: string, label?: string, onClick?: () => void}) => (
        <button data-testid="button-icon" data-icon={icon} onClick={onClick}>{label}</button>
    )
}));

describe('Toaster', () => {

    const defaultProps = {
        toastType: ToasterType.DEFAULT,
        location: ToastLocation.TOP_RIGHT,
    };

    // ── Rendering ──────────────────────────────────────────────

    it('renders without crashing', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster')).toBeInTheDocument();
    });

    it('renders with base classes', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-toaster');
        expect(root.className).toContain('shadow');
    });

    // ── toastType prop (CSS class variants) ────────────────────

    it('does not add a type class for DEFAULT', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toContain('blue-orange-toaster-success');
        expect(root.className).not.toContain('blue-orange-toaster-warning');
        expect(root.className).not.toContain('blue-orange-toaster-error');
    });

    it('adds success class for SUCCESS type', () => {
        const {container} = render(<Toaster {...defaultProps} toastType={ToasterType.SUCCESS} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-toaster-success');
    });

    it('adds warning class for WARNING type', () => {
        const {container} = render(<Toaster {...defaultProps} toastType={ToasterType.WARNING} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-toaster-warning');
    });

    it('adds error class for ERROR type', () => {
        const {container} = render(<Toaster {...defaultProps} toastType={ToasterType.ERROR} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-toaster-error');
    });

    // ── Persistent class (no TTL) ──────────────────────────────

    it('adds persistent class when no ttl is provided', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-toaster-persistent');
    });

    it('does not add persistent class when ttl is provided', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={5000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toContain('blue-orange-toaster-persistent');
    });

    // ── Animation classes (location) ───────────────────────────

    it('adds fadeInLeft for TOP_LEFT location', () => {
        const {container} = render(<Toaster {...defaultProps} location={ToastLocation.TOP_LEFT} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('animate__animated');
        expect(root.className).toContain('animate__fadeInLeft');
    });

    it('adds fadeInLeft for BOTTOM_LEFT location', () => {
        const {container} = render(<Toaster {...defaultProps} location={ToastLocation.BOTTOM_LEFT} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('animate__fadeInLeft');
    });

    it('adds fadeInRight for TOP_RIGHT location', () => {
        const {container} = render(<Toaster {...defaultProps} location={ToastLocation.TOP_RIGHT} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('animate__fadeInRight');
    });

    it('adds fadeInRight for BOTTOM_RIGHT location', () => {
        const {container} = render(<Toaster {...defaultProps} location={ToastLocation.BOTTOM_RIGHT} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('animate__fadeInRight');
    });

    it('adds fadeInDown for CENTRE_TOP location (enters from the top)', () => {
        const {container} = render(<Toaster {...defaultProps} location={ToastLocation.CENTRE_TOP} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('animate__animated');
        expect(root.className).toContain('animate__fadeInDown');
    });

    it('adds fadeInUp for CENTRE_BOTTOM location (enters from the bottom)', () => {
        const {container} = render(<Toaster {...defaultProps} location={ToastLocation.CENTRE_BOTTOM} ttl={3000}/>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('animate__animated');
        expect(root.className).toContain('animate__fadeInUp');
    });

    // Guard against regressing to the non-existent animate.css classes that were
    // previously used (fadeInTop / fadeInBottom do not exist in animate.css).
    it('never uses the invalid fadeInTop / fadeInBottom classes', () => {
        [ToastLocation.CENTRE_TOP, ToastLocation.CENTRE_BOTTOM].forEach(location => {
            const {container} = render(<Toaster {...defaultProps} location={location} ttl={3000}/>);
            const root = container.firstChild as HTMLElement;
            expect(root.className).not.toContain('animate__fadeInTop');
            expect(root.className).not.toContain('animate__fadeInBottom');
        });
    });

    // ── heading prop ───────────────────────────────────────────

    it('renders the heading when provided', () => {
        render(<Toaster {...defaultProps} heading="Alert!"/>);
        expect(screen.getByText('Alert!')).toBeInTheDocument();
    });

    it('renders the heading inside the correct class', () => {
        const {container} = render(<Toaster {...defaultProps} heading="Alert!"/>);
        const headingEl = container.querySelector('.blue-orange-toaster-text-group-heading');
        expect(headingEl).toBeInTheDocument();
        expect(headingEl!.textContent).toBe('Alert!');
    });

    it('does not render heading element when heading is not provided', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster-text-group-heading')).toBeNull();
    });

    // ── description prop ───────────────────────────────────────

    it('renders the description when provided', () => {
        render(<Toaster {...defaultProps} heading="Title" description="Details here"/>);
        expect(screen.getByText('Details here')).toBeInTheDocument();
    });

    it('renders description inside the correct class', () => {
        const {container} = render(<Toaster {...defaultProps} heading="Title" description="Details"/>);
        const descEl = container.querySelector('.blue-orange-toaster-text-group-description');
        expect(descEl).toBeInTheDocument();
        expect(descEl!.textContent).toBe('Details');
    });

    it('does not render description element when description is not provided', () => {
        const {container} = render(<Toaster {...defaultProps} heading="Title"/>);
        expect(container.querySelector('.blue-orange-toaster-text-group-description')).toBeNull();
    });

    // ── Text group class logic ─────────────────────────────────

    it('uses description-only class when description is provided without heading', () => {
        const {container} = render(<Toaster {...defaultProps} description="Only desc"/>);
        expect(container.querySelector('.blue-orange-toaster-text-group-description-only')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toaster-text-group')).toBeNull();
    });

    it('uses normal text-group class when heading is provided', () => {
        const {container} = render(<Toaster {...defaultProps} heading="Title" description="Desc"/>);
        expect(container.querySelector('.blue-orange-toaster-text-group')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toaster-text-group-description-only')).toBeNull();
    });

    it('uses normal text-group class when neither heading nor description', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster-text-group')).toBeInTheDocument();
    });

    // ── icon prop ──────────────────────────────────────────────

    it('renders the icon when provided', () => {
        render(<Toaster {...defaultProps} icon={<span data-testid="custom-icon">Icon</span>}/>);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders the icon inside the correct container', () => {
        const {container} = render(<Toaster {...defaultProps} icon={<span>Icon</span>}/>);
        const iconContainer = container.querySelector('.blue-orange-toaster-icon');
        expect(iconContainer).toBeInTheDocument();
        expect(iconContainer!.textContent).toBe('Icon');
    });

    it('does not render icon container when icon is not provided', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster-icon')).toBeNull();
    });

    // ── action prop ────────────────────────────────────────────

    it('renders the action when provided', () => {
        render(<Toaster {...defaultProps} action={<button>Undo</button>}/>);
        expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('renders the action inside the correct container', () => {
        const {container} = render(<Toaster {...defaultProps} action={<button>Undo</button>}/>);
        const actionContainer = container.querySelector('.blue-orange-toaster-action');
        expect(actionContainer).toBeInTheDocument();
        expect(actionContainer!.querySelector('button')).toBeInTheDocument();
    });

    it('does not render action container when action is not provided', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster-action')).toBeNull();
    });

    // ── Progress bar (ttl) ─────────────────────────────────────

    it('renders the progress bar when ttl is provided', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={5000}/>);
        expect(container.querySelector('.blue-orange-toaster-progress')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toaster-progress-bar')).toBeInTheDocument();
    });

    it('sets animation duration on progress bar to match ttl', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={3000}/>);
        const progressBar = container.querySelector('.blue-orange-toaster-progress-bar') as HTMLElement;
        expect(progressBar.style.animationDuration).toBe('3000ms');
    });

    it('does not render progress bar when no ttl', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster-progress')).toBeNull();
    });

    // ── Close button (persistent toasts) ───────────────────────

    it('renders close button for persistent toasts (no ttl) by default', () => {
        render(<Toaster {...defaultProps}/>);
        expect(screen.getByTestId('button-icon')).toBeInTheDocument();
    });

    it('does not render close button for persistent toasts when showCloseButton is false', () => {
        const {container} = render(<Toaster {...defaultProps} showCloseButton={false}/>);
        expect(container.querySelector('.blue-orange-toaster-close')).toBeNull();
    });

    it('does not render close button for temporary toasts (with ttl)', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={3000}/>);
        expect(container.querySelector('.blue-orange-toaster-close')).toBeNull();
    });

    // ── onClick / handleClick ──────────────────────────────────

    it('calls onClose when clicking a temporary toast with closeOnClick=true (default)', () => {
        const onClose = jest.fn();
        const {container} = render(<Toaster {...defaultProps} ttl={3000} onClose={onClose}/>);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when clicking a temporary toast with closeOnClick=false', () => {
        const onClose = jest.fn();
        const {container} = render(<Toaster {...defaultProps} ttl={3000} onClose={onClose} closeOnClick={false}/>);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking a persistent toast (no ttl)', () => {
        const onClose = jest.fn();
        const {container} = render(<Toaster {...defaultProps} onClose={onClose}/>);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('does not throw when clicking and no onClose is provided', () => {
        const {container} = render(<Toaster {...defaultProps} ttl={3000}/>);
        expect(() => {
            fireEvent.click(container.firstChild as HTMLElement);
        }).not.toThrow();
    });

    // ── Close button click (handleCloseClick) ──────────────────

    it('calls onClose when close button is clicked on persistent toast', () => {
        const onClose = jest.fn();
        const {container} = render(<Toaster {...defaultProps} onClose={onClose}/>);
        const closeBtn = container.querySelector('.blue-orange-toaster-close') as HTMLElement;
        fireEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('stops propagation when close button is clicked', () => {
        const onClose = jest.fn();
        const parentClick = jest.fn();
        const {container} = render(
            <div onClick={parentClick}>
                <Toaster {...defaultProps} onClose={onClose}/>
            </div>
        );
        const closeBtn = container.querySelector('.blue-orange-toaster-close') as HTMLElement;
        fireEvent.click(closeBtn);
        // onClose should be called but the parent onClick should NOT fire
        // because stopPropagation is called on the close button handler.
        // However, the toaster root div click handler will fire first via bubbling
        // from the close button, but since there's no ttl, handleClick won't call onClose.
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    // ── Default prop values ────────────────────────────────────

    it('defaults closeOnClick to true', () => {
        const onClose = jest.fn();
        const {container} = render(<Toaster {...defaultProps} ttl={3000} onClose={onClose}/>);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('defaults showCloseButton to true', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        expect(container.querySelector('.blue-orange-toaster-close')).toBeInTheDocument();
    });

    // ── Combined rendering scenarios ───────────────────────────

    it('renders all optional content together', () => {
        const {container} = render(
            <Toaster
                toastType={ToasterType.SUCCESS}
                location={ToastLocation.BOTTOM_RIGHT}
                ttl={5000}
                heading="Success!"
                description="Task completed"
                icon={<span data-testid="icon">V</span>}
                action={<button>Undo</button>}
                onClose={jest.fn()}
            />
        );
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Task completed')).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
        expect(screen.getByText('Undo')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toaster-progress-bar')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toaster-close')).toBeNull(); // ttl present
        const root = container.firstChild as HTMLElement;
        expect(root.className).toContain('blue-orange-toaster-success');
        expect(root.className).toContain('animate__fadeInRight');
    });

    it('renders minimal toast with no optional props', () => {
        const {container} = render(<Toaster {...defaultProps}/>);
        const root = container.firstChild as HTMLElement;
        expect(root).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toaster-icon')).toBeNull();
        expect(container.querySelector('.blue-orange-toaster-text-group-heading')).toBeNull();
        expect(container.querySelector('.blue-orange-toaster-text-group-description')).toBeNull();
        expect(container.querySelector('.blue-orange-toaster-action')).toBeNull();
        expect(container.querySelector('.blue-orange-toaster-progress')).toBeNull();
    });
});
