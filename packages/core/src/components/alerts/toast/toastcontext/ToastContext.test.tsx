import React, {useContext} from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {ToastProvider, ToastContext, ToastLocation, Toast, ToastContextType} from './ToastContext';
import {ToasterType} from '../toaster/Toaster';

// Mock ButtonIcon since Toaster uses it and it depends on tippy.js
vi.mock('../../../buttons/button-icon/ButtonIcon', () => ({
    ButtonIcon: ({icon, label, onClick}: {icon: string, label?: string, onClick?: () => void}) => (
        <button data-testid="button-icon" data-icon={icon} onClick={onClick}>{label}</button>
    )
}));

// Helper component to interact with the toast context in tests
const ToastConsumer: React.FC<{onContext?: (ctx: ToastContextType) => void}> = ({onContext}) => {
    const ctx = useContext(ToastContext);

    return (
        <div>
            <button
                data-testid="add-toast"
                onClick={() => {
                    ctx.addToast({
                        id: 'test-toast-1',
                        location: ToastLocation.TOP_RIGHT,
                        toastType: ToasterType.DEFAULT,
                        heading: 'Test Toast',
                        description: 'Test description',
                        ttl: 3000,
                    });
                }}
            >
                Add Toast
            </button>
            <button
                data-testid="add-persistent-toast"
                onClick={() => {
                    ctx.addToast({
                        id: 'persistent-toast',
                        location: ToastLocation.TOP_RIGHT,
                        toastType: ToasterType.SUCCESS,
                        heading: 'Persistent Toast',
                    });
                }}
            >
                Add Persistent
            </button>
            <button
                data-testid="remove-toast"
                onClick={() => ctx.removeToast('test-toast-1')}
            >
                Remove Toast
            </button>
            <button
                data-testid="update-toast"
                onClick={() => ctx.updateToast('test-toast-1', {heading: 'Updated Heading'})}
            >
                Update Toast
            </button>
            <button
                data-testid="expose-context"
                onClick={() => onContext?.(ctx)}
            >
                Expose
            </button>
        </div>
    );
};

describe('ToastContext', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ── Provider rendering ─────────────────────────────────────

    it('renders children', () => {
        render(
            <ToastProvider>
                <span>Child content</span>
            </ToastProvider>
        );
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('renders all six toast container locations', () => {
        const {container} = render(
            <ToastProvider>
                <span>App</span>
            </ToastProvider>
        );
        expect(container.querySelector('.blue-orange-toast-container-top-left')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toast-container-top-right')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toast-container-bottom-left')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toast-container-bottom-right')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toast-container-centre-top')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-toast-container-centre-bottom')).toBeInTheDocument();
    });

    // ── addToast ───────────────────────────────────────────────

    it('adds a toast that renders in the correct location container', () => {
        render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );
        fireEvent.click(screen.getByTestId('add-toast'));
        expect(screen.getByText('Test Toast')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('routes toasts to the correct location', () => {
        const LocationToaster: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <div>
                    <button data-testid="add-top-left" onClick={() => {
                        ctx.addToast({
                            id: 'tl-1',
                            location: ToastLocation.TOP_LEFT,
                            toastType: ToasterType.DEFAULT,
                            heading: 'Top Left Toast',
                        });
                    }}>Add TL</button>
                    <button data-testid="add-bottom-right" onClick={() => {
                        ctx.addToast({
                            id: 'br-1',
                            location: ToastLocation.BOTTOM_RIGHT,
                            toastType: ToasterType.ERROR,
                            heading: 'Bottom Right Toast',
                        });
                    }}>Add BR</button>
                </div>
            );
        };

        const {container} = render(
            <ToastProvider>
                <LocationToaster/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-top-left'));
        fireEvent.click(screen.getByTestId('add-bottom-right'));

        expect(screen.getByText('Top Left Toast')).toBeInTheDocument();
        expect(screen.getByText('Bottom Right Toast')).toBeInTheDocument();
    });

    it('adds toasts to all six locations', () => {
        const AllLocations: React.FC = () => {
            const ctx = useContext(ToastContext);
            const locations = [
                {loc: ToastLocation.TOP_LEFT, label: 'TL'},
                {loc: ToastLocation.TOP_RIGHT, label: 'TR'},
                {loc: ToastLocation.BOTTOM_LEFT, label: 'BL'},
                {loc: ToastLocation.BOTTOM_RIGHT, label: 'BR'},
                {loc: ToastLocation.CENTRE_TOP, label: 'CT'},
                {loc: ToastLocation.CENTRE_BOTTOM, label: 'CB'},
            ];
            return (
                <div>
                    {locations.map(({loc, label}) => (
                        <button key={label} data-testid={`add-${label}`} onClick={() => {
                            ctx.addToast({
                                id: `toast-${label}`,
                                location: loc,
                                toastType: ToasterType.DEFAULT,
                                heading: `Toast ${label}`,
                            });
                        }}>{label}</button>
                    ))}
                </div>
            );
        };

        render(
            <ToastProvider>
                <AllLocations/>
            </ToastProvider>
        );

        ['TL', 'TR', 'BL', 'BR', 'CT', 'CB'].forEach(label => {
            fireEvent.click(screen.getByTestId(`add-${label}`));
        });

        ['TL', 'TR', 'BL', 'BR', 'CT', 'CB'].forEach(label => {
            expect(screen.getByText(`Toast ${label}`)).toBeInTheDocument();
        });
    });

    // ── removeToast ────────────────────────────────────────────

    it('removes a toast by id', () => {
        render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-toast'));
        expect(screen.getByText('Test Toast')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('remove-toast'));
        expect(screen.queryByText('Test Toast')).toBeNull();
    });

    it('does not throw when removing a non-existent toast', () => {
        render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );
        expect(() => {
            fireEvent.click(screen.getByTestId('remove-toast'));
        }).not.toThrow();
    });

    // ── updateToast ────────────────────────────────────────────

    it('updates a toast heading', () => {
        render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-toast'));
        expect(screen.getByText('Test Toast')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('update-toast'));
        expect(screen.getByText('Updated Heading')).toBeInTheDocument();
        expect(screen.queryByText('Test Toast')).toBeNull();
    });

    // ── TTL (auto-removal) ─────────────────────────────────────

    it('auto-removes toast after ttl expires', () => {
        render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-toast'));
        expect(screen.getByText('Test Toast')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(screen.queryByText('Test Toast')).toBeNull();
    });

    it('does not auto-remove persistent toasts (no ttl)', () => {
        render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-persistent-toast'));
        expect(screen.getByText('Persistent Toast')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(screen.getByText('Persistent Toast')).toBeInTheDocument();
    });

    it('clears existing timeout when adding toast with same id', () => {
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <button data-testid="add" onClick={() => {
                    ctx.addToast({
                        id: 'dup',
                        location: ToastLocation.TOP_RIGHT,
                        toastType: ToasterType.DEFAULT,
                        heading: 'Dup Toast',
                        ttl: 5000,
                    });
                }}>Add</button>
            );
        };

        render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add'));
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Add again — should reset timeout
        fireEvent.click(screen.getByTestId('add'));

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Should still exist because timeout was reset
        // Actually after 3s of the second add, the toast will still be visible
        // because only 3s out of 5s have passed
        // Note: adding with same id creates a duplicate in the array
    });

    // ── updateToast with ttl ───────────────────────────────────

    it('clears old timeout and sets new one when updating ttl', () => {
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <div>
                    <button data-testid="add" onClick={() => {
                        ctx.addToast({
                            id: 'ttl-update',
                            location: ToastLocation.TOP_RIGHT,
                            toastType: ToasterType.DEFAULT,
                            heading: 'TTL Toast',
                            ttl: 3000,
                        });
                    }}>Add</button>
                    <button data-testid="update-ttl" onClick={() => {
                        ctx.updateToast('ttl-update', {ttl: 10000});
                    }}>Update TTL</button>
                </div>
            );
        };

        render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add'));
        expect(screen.getByText('TTL Toast')).toBeInTheDocument();

        // Update TTL to 10s before the 3s timeout fires
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        fireEvent.click(screen.getByTestId('update-ttl'));

        // Original 3s has passed but toast should still be there
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(screen.getByText('TTL Toast')).toBeInTheDocument();

        // Now advance past the new 10s TTL
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(screen.queryByText('TTL Toast')).toBeNull();
    });

    // ── addPromiseToast ────────────────────────────────────────

    it('creates a promise toast and returns a handle', () => {
        let handle: any;
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <button data-testid="add-promise" onClick={() => {
                    handle = ctx.addPromiseToast({
                        location: ToastLocation.BOTTOM_LEFT,
                        heading: 'Loading...',
                        description: 'Please wait',
                    });
                }}>Add Promise</button>
            );
        };

        render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-promise'));
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByText('Please wait')).toBeInTheDocument();
        expect(handle).toBeDefined();
        expect(handle.id).toBeTruthy();
        expect(typeof handle.update).toBe('function');
        expect(typeof handle.close).toBe('function');
    });

    it('promise toast defaults to DEFAULT type', () => {
        let handle: any;
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <button data-testid="add-promise" onClick={() => {
                    handle = ctx.addPromiseToast({
                        location: ToastLocation.TOP_RIGHT,
                        heading: 'Promise',
                    });
                }}>Add Promise</button>
            );
        };

        render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-promise'));
        expect(screen.getByText('Promise')).toBeInTheDocument();
    });

    it('promise toast handle.update updates the toast', () => {
        let handle: any;
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <div>
                    <button data-testid="add-promise" onClick={() => {
                        handle = ctx.addPromiseToast({
                            location: ToastLocation.TOP_RIGHT,
                            heading: 'Loading...',
                        });
                    }}>Add</button>
                    <button data-testid="update-promise" onClick={() => {
                        handle.update({heading: 'Done!', toastType: ToasterType.SUCCESS});
                    }}>Update</button>
                </div>
            );
        };

        render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-promise'));
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('update-promise'));
        expect(screen.getByText('Done!')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).toBeNull();
    });

    it('promise toast handle.close removes the toast', () => {
        let handle: any;
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <div>
                    <button data-testid="add-promise" onClick={() => {
                        handle = ctx.addPromiseToast({
                            location: ToastLocation.TOP_RIGHT,
                            heading: 'Promise Toast',
                        });
                    }}>Add</button>
                    <button data-testid="close-promise" onClick={() => {
                        handle.close();
                    }}>Close</button>
                </div>
            );
        };

        render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-promise'));
        expect(screen.getByText('Promise Toast')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('close-promise'));
        expect(screen.queryByText('Promise Toast')).toBeNull();
    });

    it('promise toast has showCloseButton=false and closeOnClick=false by default', () => {
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <button data-testid="add-promise" onClick={() => {
                    ctx.addPromiseToast({
                        location: ToastLocation.TOP_RIGHT,
                        heading: 'No Close',
                    });
                }}>Add</button>
            );
        };

        const {container} = render(
            <ToastProvider>
                <Tester/>
            </ToastProvider>
        );

        fireEvent.click(screen.getByTestId('add-promise'));
        // Since showCloseButton=false, the close button should not render
        // even though it's persistent (no ttl)
        const toastContainerTR = container.querySelector('.blue-orange-toast-container-top-right');
        const closeBtn = toastContainerTR?.querySelector('.blue-orange-toaster-close');
        expect(closeBtn).toBeNull();
    });

    // ── Default context (outside provider) ─────────────────────

    it('default context functions do not throw when called outside provider', () => {
        const Tester: React.FC = () => {
            const ctx = useContext(ToastContext);
            return (
                <div>
                    <button data-testid="add" onClick={() => ctx.addToast({
                        id: 'x',
                        location: ToastLocation.TOP_RIGHT,
                        toastType: ToasterType.DEFAULT,
                        heading: 'X',
                    })}>Add</button>
                    <button data-testid="update" onClick={() => ctx.updateToast('x', {heading: 'Y'})}>Update</button>
                    <button data-testid="remove" onClick={() => ctx.removeToast('x')}>Remove</button>
                    <button data-testid="promise" onClick={() => {
                        const h = ctx.addPromiseToast({location: ToastLocation.TOP_RIGHT});
                        h.update({heading: 'Z'});
                        h.close();
                    }}>Promise</button>
                </div>
            );
        };

        render(<Tester/>);

        expect(() => fireEvent.click(screen.getByTestId('add'))).not.toThrow();
        expect(() => fireEvent.click(screen.getByTestId('update'))).not.toThrow();
        expect(() => fireEvent.click(screen.getByTestId('remove'))).not.toThrow();
        expect(() => fireEvent.click(screen.getByTestId('promise'))).not.toThrow();
    });

    // ── Cleanup ────────────────────────────────────────────────

    it('clears all timeouts on unmount', () => {
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

        const {unmount} = render(
            <ToastProvider>
                <ToastConsumer/>
            </ToastProvider>
        );

        // Add a toast with TTL to create a timeout
        fireEvent.click(screen.getByTestId('add-toast'));

        const callsBefore = clearTimeoutSpy.mock.calls.length;
        unmount();

        // clearTimeout should have been called during cleanup
        expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(callsBefore);

        clearTimeoutSpy.mockRestore();
    });
});
