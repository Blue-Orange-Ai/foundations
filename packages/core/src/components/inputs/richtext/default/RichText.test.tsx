import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {RichText} from './RichText';
import {FormGroup} from '../../form-group/FormGroup';
import {FormActions} from '../../form-group/FormActions';
import {FormSubmitButton} from '../../form-group/FormSubmitButton';

const wrapper = (): HTMLElement => document.querySelector('.blue-orange-rich-text-editor') as HTMLElement;

const editable = (): HTMLElement => document.querySelector('.tiptap') as HTMLElement;

describe('RichText', () => {

	it('drives the minimum height from the prop', () => {
		const {rerender} = render(<RichText minEditorHeight={40}></RichText>);
		expect(wrapper().style.getPropertyValue('--blue-orange-rich-text-editor-min-height')).toBe('40px');

		rerender(<RichText minEditorHeight={120}></RichText>);
		expect(wrapper().style.getPropertyValue('--blue-orange-rich-text-editor-min-height')).toBe('120px');
	});

	it('pins the height only while editorHeight is given', () => {
		const {rerender} = render(<RichText></RichText>);
		expect(wrapper().className).not.toContain('blue-orange-rich-text-editor-fixed-height');

		rerender(<RichText editorHeight={90}></RichText>);
		expect(wrapper().className).toContain('blue-orange-rich-text-editor-fixed-height');
		expect(wrapper().style.getPropertyValue('--blue-orange-rich-text-editor-height')).toBe('90px');

		rerender(<RichText></RichText>);
		expect(wrapper().className).not.toContain('blue-orange-rich-text-editor-fixed-height');
	});

	it('follows singleLine after the first render', () => {
		const {rerender} = render(<RichText></RichText>);
		expect(wrapper().className).not.toContain('blue-orange-rich-text-editor-single-line');

		rerender(<RichText singleLine={true}></RichText>);
		expect(wrapper().className).toContain('blue-orange-rich-text-editor-single-line');
	});

	it('stops taking input when it is disabled', () => {
		const {rerender} = render(<RichText></RichText>);
		expect(editable().getAttribute('contenteditable')).toBe('true');

		rerender(<RichText disabled={true}></RichText>);
		expect(editable().getAttribute('contenteditable')).toBe('false');
		expect(wrapper().className).toContain('blue-orange-rich-text-editor-disabled');

		rerender(<RichText disabled={false}></RichText>);
		expect(editable().getAttribute('contenteditable')).toBe('true');
	});

	it('shows a new placeholder without rebuilding the editor', () => {
		const {rerender} = render(<RichText placeholder="Write a note"></RichText>);
		const before = editable();
		expect(before.querySelector('[data-placeholder]')?.getAttribute('data-placeholder')).toBe('Write a note');

		rerender(<RichText placeholder="Say something else"></RichText>);
		expect(editable()).toBe(before);
		expect(editable().querySelector('[data-placeholder]')?.getAttribute('data-placeholder')).toBe('Say something else');
	});

	it('takes new content from the prop', () => {
		const {rerender} = render(<RichText content="<p>First</p>"></RichText>);
		expect(editable().textContent).toContain('First');

		rerender(<RichText content="<p>Second</p>"></RichText>);
		expect(editable().textContent).toContain('Second');
		expect(editable().textContent).not.toContain('First');
	});

	it('shows and hides the formatting toolbar with the prop', () => {
		const {rerender} = render(<RichText></RichText>);
		expect(document.querySelector('.blue-orange-rich-text-editor-heading')).not.toBeNull();

		rerender(<RichText displayFormatting={false}></RichText>);
		expect(document.querySelector('.blue-orange-rich-text-editor-heading')).toBeNull();

		rerender(<RichText displayFormatting={true}></RichText>);
		expect(document.querySelector('.blue-orange-rich-text-editor-heading')).not.toBeNull();
	});

	it('does not grow a second line when it is kept to one', () => {
		const {rerender} = render(<RichText content="<p>One line</p>"></RichText>);
		fireEvent.keyDown(editable(), {key: 'Enter'});
		expect(editable().querySelectorAll('p').length).toBe(2);

		rerender(<RichText content="<p>One line</p>" singleLine={true}></RichText>);
		const lines = editable().querySelectorAll('p').length;
		fireEvent.keyDown(editable(), {key: 'Enter'});
		expect(editable().querySelectorAll('p').length).toBe(lines);
	});

	it('sends on enter rather than adding a line when onEnter is given', () => {
		const onEnter = vi.fn();
		render(<RichText content="<p>One line</p>" onEnter={onEnter}></RichText>);
		fireEvent.keyDown(editable(), {key: 'Enter'});
		expect(onEnter).toHaveBeenCalled();
		expect(editable().querySelectorAll('p').length).toBe(1);
	});

	it('only shows the footer tools that are turned on', () => {
		const {rerender} = render(<RichText></RichText>);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-add-line').length).toBe(1);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-font-size').length).toBe(1);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-emotion-happy-line').length).toBe(1);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-at-line').length).toBe(1);

		rerender(<RichText allowFileUpload={false} allowFormattingToggle={false} allowEmojis={false}></RichText>);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-add-line').length).toBe(0);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-font-size').length).toBe(0);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-emotion-happy-line').length).toBe(0);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .ri-at-line').length).toBe(1);
		expect(document.querySelectorAll('.blue-orange-rich-text-editor-heading-footer .blue-orange-rich-text-editor-vertical-line-sep').length).toBe(0);
	});

	it('drops the footer once every tool is off and nothing is passed in', () => {
		const off = {
			allowFileUpload: false,
			allowFormattingToggle: false,
			allowEmojis: false,
			allowMentions: false
		};
		const {rerender} = render(<RichText {...off}></RichText>);
		expect(document.querySelector('.blue-orange-rich-text-editor-heading-footer')).toBeNull();

		rerender(<RichText {...off}><button>Send</button></RichText>);
		expect(document.querySelector('.blue-orange-rich-text-editor-heading-footer')).not.toBeNull();
	});

	it('keeps the content it holds when the extensions change', () => {
		const onChange = vi.fn();
		const {rerender} = render(<RichText content="<p>Kept</p>" onChange={onChange}></RichText>);

		rerender(<RichText content="<p>Kept</p>" allowMentions={false} onChange={onChange}></RichText>);
		expect(editable().textContent).toContain('Kept');
	});

	it('fails a required field a form is submitted with nothing in it', async () => {
		const onSubmit = vi.fn();
		render(
			<FormGroup onSubmit={onSubmit}>
				<RichText name="note" required={true}></RichText>
				<FormActions>
					<FormSubmitButton text="Save"></FormSubmitButton>
				</FormActions>
			</FormGroup>
		);

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => expect(screen.getByText('This field is required.')).toBeInTheDocument());
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('reports what it holds to the form under its name', async () => {
		const onSubmit = vi.fn();
		render(
			<FormGroup onSubmit={onSubmit}>
				<RichText name="note" required={true} content="<p>Filled in</p>"></RichText>
				<FormActions>
					<FormSubmitButton text="Save"></FormSubmitButton>
				</FormActions>
			</FormGroup>
		);

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({note: '<p>Filled in</p>'}));
	});

	it('puts a label, a help tooltip and the required marker above the editor', () => {
		const {rerender} = render(<RichText></RichText>);
		expect(document.querySelector('.blue-orange-default-input-label-cont')).toBeNull();

		rerender(<RichText label="Release note" help="What changed" required={true}></RichText>);
		const labelRow = document.querySelector('.blue-orange-default-input-label-cont') as HTMLElement;
		expect(labelRow.textContent).toContain('Release note');
		expect(labelRow.querySelector('.blue-orange-default-help-icon')).not.toBeNull();
		expect(labelRow.querySelector('.blue-orange-default-required-icon')).not.toBeNull();
	});

	it('names the field in the message a failed requirement produces', async () => {
		render(
			<FormGroup onSubmit={() => {}}>
				<RichText name="note" label="Release note" required={true}></RichText>
				<FormActions>
					<FormSubmitButton text="Save"></FormSubmitButton>
				</FormActions>
			</FormGroup>
		);

		fireEvent.click(screen.getByText('Save'));

		await waitFor(() => expect(screen.getByText('Release note is required.')).toBeInTheDocument());
		expect(document.querySelector('.blue-orange-default-input-label-cont-error')).not.toBeNull();
	});
});