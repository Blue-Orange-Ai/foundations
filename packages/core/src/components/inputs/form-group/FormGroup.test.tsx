import React, {useState} from 'react';
import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import {FormGroup} from './FormGroup';
import {FormSection} from './FormSection';
import {FormRow} from './FormRow';
import {FormField} from './FormField';
import {FormActions} from './FormActions';
import {FormSubmitButton} from './FormSubmitButton';
import {InputValidationResult} from '../validation/InputValidation';
import {Input} from '../input/Input';
import {Checkbox} from '../checkbox/Checkbox';
import {Button, ButtonType} from '../../buttons/button/Button';

// ── Test harness ──────────────────────────────────────────────────────────

interface HarnessProps {
    onSubmit?: (values: Record<string, any>) => void | Promise<void>;
    validate?: (value: string) => Promise<InputValidationResult>;
    required?: boolean;
    error?: InputValidationResult | null;
    initialEmail?: string;
}

// Inputs take part in the form on their own — the only extra prop is `name`.
const Harness: React.FC<HarnessProps> = ({onSubmit, validate, required = true, error, initialEmail = ''}) => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState(initialEmail);
    return (
        <FormGroup onSubmit={onSubmit} error={error}>
            <FormSection label="Contact" description="How we reach you">
                <FormRow columns={[1, '160px']}>
                    <Input name="firstName" label="First name" value={firstName} onChange={setFirstName}/>
                    <Input name="email" label="Email" value={email} onChange={setEmail}
                           required={required} validate={validate}/>
                </FormRow>
            </FormSection>
            <FormActions>
                <Button text="Cancel" buttonType={ButtonType.SECONDARY}/>
                <FormSubmitButton text="Save"/>
            </FormActions>
        </FormGroup>
    );
};

describe('FormGroup', () => {

    // ── Rendering ─────────────────────────────────────────────────────────

    it('renders body children inside the form body', () => {
        const {container} = render(<Harness/>);
        const body = container.querySelector('.blue-orange-form-group-body');
        expect(body).toBeInTheDocument();
        expect(body!.querySelector('.blue-orange-form-section')).toBeInTheDocument();
    });

    it('routes FormActions children into the action bar and leaves them out of the body', () => {
        const {container} = render(<Harness/>);
        const actions = container.querySelector('.blue-orange-form-group-actions');
        expect(actions).toBeInTheDocument();
        expect(actions!.querySelectorAll('.blue-orange-form-group-action')).toHaveLength(2);
        expect(container.querySelector('.blue-orange-form-group-body')!.textContent).not.toContain('Cancel');
    });

    it('renders the section label and description', () => {
        render(<Harness/>);
        expect(screen.getByText('Contact')).toBeInTheDocument();
        expect(screen.getByText('How we reach you')).toBeInTheDocument();
    });

    it('sizes row items from the columns prop', () => {
        const {container} = render(<Harness/>);
        const items = container.querySelectorAll('.blue-orange-form-row-item');
        expect(items).toHaveLength(2);
        expect((items[0] as HTMLElement).style.flex).toBe('1 1 180px');
        expect((items[1] as HTMLElement).style.flex).toBe('0 0 160px');
    });

    // ── Requirement checks ────────────────────────────────────────────────

    it('blocks submission and shows a required message when a required input is empty', async () => {
        const onSubmit = vi.fn();
        render(<Harness onSubmit={onSubmit}/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        expect(await screen.findByText('Email is required.')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits the values of every registered input once the requirements pass', async () => {
        const onSubmit = vi.fn();
        render(<Harness onSubmit={onSubmit} initialEmail="tom@blueorange.ai"/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit).toHaveBeenCalledWith({firstName: '', email: 'tom@blueorange.ai'});
    });

    it('submits the value the user typed, not the value the input started with', async () => {
        const onSubmit = vi.fn();
        render(<Harness onSubmit={onSubmit} initialEmail="tom@blueorange.ai"/>);

        const inputs = screen.getAllByRole('textbox');
        fireEvent.change(inputs[0], {target: {value: 'Tom'}});

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit).toHaveBeenCalledWith({firstName: 'Tom', email: 'tom@blueorange.ai'});
    });

    it('leaves the requirement unenforced for an input used outside a form', async () => {
        const {container} = render(<Input label="Email" value="" required={true}/>);

        await act(async () => {
            fireEvent.blur(container.querySelector('input')!);
        });

        expect(screen.queryByText('Email is required.')).not.toBeInTheDocument();
    });

    // ── Validation ────────────────────────────────────────────────────────

    it('runs the input validate callback on submit and blocks when it errors', async () => {
        const onSubmit = vi.fn();
        const validate = vi.fn().mockResolvedValue({state: 'error', message: 'Not a valid email'});
        render(<Harness onSubmit={onSubmit} validate={validate} initialEmail="nope"/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        expect(await screen.findByText('Not a valid email')).toBeInTheDocument();
        expect(validate).toHaveBeenCalledWith('nope');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('runs the required check before the validate callback', async () => {
        const validate = vi.fn().mockResolvedValue({state: 'success'});
        render(<Harness validate={validate}/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        expect(await screen.findByText('Email is required.')).toBeInTheDocument();
        expect(validate).not.toHaveBeenCalled();
    });

    it('runs the input validate callback on blur', async () => {
        const validate = vi.fn().mockResolvedValue({state: 'error', message: 'Not a valid email'});
        render(<Harness validate={validate} initialEmail="nope"/>);

        await act(async () => {
            fireEvent.blur(screen.getAllByRole('textbox')[1]);
        });

        expect(await screen.findByText('Not a valid email')).toBeInTheDocument();
    });

    // ── Form level message ────────────────────────────────────────────────

    it('renders a summary message at the bottom when validation fails', async () => {
        render(<Harness/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        expect(await screen.findByText('1 field needs your attention before this form can be submitted.')).toBeInTheDocument();
    });

    it('renders the error prop as plain text and lets it take precedence over the summary', async () => {
        const {container} = render(<Harness error={{state: 'error', message: 'Server rejected the request'}}/>);

        const message = container.querySelector('.blue-orange-form-group-message');
        expect(message).toBeInTheDocument();
        expect(message!.textContent).toBe('Server rejected the request');

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });
        await screen.findByText('Email is required.');
        expect(container.querySelector('.blue-orange-form-group-message')!.textContent).toBe('Server rejected the request');
    });

    it('renders the error prop as html', () => {
        const {container} = render(
            <Harness error={{state: 'error', messageHtml: '<b>Failed:</b> try again'}}/>
        );
        const message = container.querySelector('.blue-orange-form-group-message');
        expect(message!.querySelector('b')).toBeInTheDocument();
        expect(message!.textContent).toContain('Failed:');
    });

    it('clears the summary once the form submits successfully', async () => {
        const onSubmit = vi.fn();
        render(<Harness onSubmit={onSubmit} initialEmail="tom@blueorange.ai"/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        await waitFor(() => expect(onSubmit).toHaveBeenCalled());
        expect(screen.queryByText('1 field needs your attention before this form can be submitted.')).not.toBeInTheDocument();
    });

    // ── Unmounted inputs ──────────────────────────────────────────────────

    it('stops validating inputs that have been removed from the form', async () => {
        const onSubmit = vi.fn();
        const Conditional: React.FC = () => {
            const [show, setShow] = useState(true);
            return (
                <>
                    <button onClick={() => setShow(false)}>hide</button>
                    <FormGroup onSubmit={onSubmit}>
                        {show
                            ? <Input name="optional" label="Optional" value="" required={true}/>
                            : <Input name="kept" value="ok"/>
                        }
                        <FormActions>
                            <FormSubmitButton text="Save"/>
                        </FormActions>
                    </FormGroup>
                </>
            );
        };
        render(<Conditional/>);

        fireEvent.click(screen.getByText('hide'));
        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit).toHaveBeenCalledWith({kept: 'ok'});
    });
});

// ── FormField — the escape hatch for anything that is not an input ─────────

describe('FormField', () => {

    const CheckboxHarness: React.FC<{onSubmit: (values: Record<string, any>) => void}> = ({onSubmit}) => {
        const [terms, setTerms] = useState(false);
        return (
            <FormGroup onSubmit={onSubmit}>
                <FormField name="terms" label="The terms" value={terms} required={true}
                           requiredMessage="You must accept the terms.">
                    <div>
                        <Checkbox checked={terms} onCheckboxChange={setTerms}/>
                        <span>I accept</span>
                    </div>
                </FormField>
                <FormActions>
                    <FormSubmitButton text="Save"/>
                </FormActions>
            </FormGroup>
        );
    };

    it('registers a composition of components and blocks submission while it is empty', async () => {
        const onSubmit = vi.fn();
        render(<CheckboxHarness onSubmit={onSubmit}/>);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        expect(await screen.findByText('You must accept the terms.')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits once the wrapped value is filled in', async () => {
        const onSubmit = vi.fn();
        const {container} = render(<CheckboxHarness onSubmit={onSubmit}/>);

        fireEvent.click(container.querySelector('.blue-orange-checkbox input')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({terms: true}));
    });
});
