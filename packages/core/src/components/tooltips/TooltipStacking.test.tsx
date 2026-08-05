import React from 'react';
import {render} from '@testing-library/react';

// Tippy is mocked so the tests can read back the options each component constructs it with —
// the z-index is the whole point here and jsdom does not resolve stacking for us.
const tippyMock = vi.fn(() => ({destroy: vi.fn(), setProps: vi.fn(), hide: vi.fn()}));
vi.mock('tippy.js', () => ({
    default: (...args: any[]) => (tippyMock as any)(...args),
}));

import {TOOLTIP_Z_INDEX} from '../utils/ZIndex';
import {HelpIcon} from '../inputs/help/HelpIcon';
import {Button, ButtonType} from '../buttons/button/Button';
import {Avatar} from '../avatar/avatar/Avatar';

/** Modal.css / Drawer.css put the portalled overlay window here. */
const OVERLAY_Z_INDEX = 99999999;

const optionsOfLastTippyCall = () => tippyMock.mock.calls.at(-1)?.[1] as Record<string, any>;

describe('tooltip stacking against an open modal', () => {

    beforeEach(() => {
        tippyMock.mockClear();
    });

    it('exposes a tooltip layer above the modal and drawer overlays', () => {
        // Tippy's own default is 9999, which paints behind the overlay.
        expect(TOOLTIP_Z_INDEX).toBeGreaterThan(OVERLAY_Z_INDEX);
    });

    it('gives the help icon tooltip a z-index above the overlay', () => {
        render(<HelpIcon label="Explains the field"/>);

        expect(tippyMock).toHaveBeenCalled();
        expect(optionsOfLastTippyCall().zIndex).toBe(TOOLTIP_Z_INDEX);
    });

    it('gives the button tooltip a z-index above the overlay', () => {
        render(<Button text="Save" buttonType={ButtonType.PRIMARY} tooltip="Saves the form"/>);

        expect(tippyMock).toHaveBeenCalled();
        expect(optionsOfLastTippyCall().zIndex).toBe(TOOLTIP_Z_INDEX);
    });

    it('gives the avatar tooltip a z-index above the overlay', () => {
        render(<Avatar tooltip={true}/>);

        expect(tippyMock).toHaveBeenCalled();
        expect(optionsOfLastTippyCall().zIndex).toBe(TOOLTIP_Z_INDEX);
    });
});
