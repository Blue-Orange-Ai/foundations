import React, {act} from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {PhraseInput} from './PhraseInput';
import {FormGroup} from '../form-group/FormGroup';

const field = (container: HTMLElement) => {
	return container.querySelector('input') as HTMLInputElement;
}

const preview = (container: HTMLElement) => {
	return container.querySelector('.blue-orange-phrase-input-preview-remaining');
}

/** Types into the field and lets the validation behind it settle. */
const type = async (container: HTMLElement, value: string) => {
	fireEvent.change(field(container), {target: {value: value}});
	await act(async () => {});
}

describe('PhraseInput', () => {

	it('previews the whole phrase while the field is empty', async () => {
		const {container} = render(<PhraseInput phrase="DELETE"></PhraseInput>);
		expect(preview(container)?.textContent).toBe('DELETE');
	});

	it('eats the preview away as the phrase is typed', async () => {
		const {container} = render(<PhraseInput phrase="DELETE"></PhraseInput>);
		await type(container, 'DEL');
		expect(preview(container)?.textContent).toBe('ETE');
	});

	it('drops the preview when a wrong character lands', async () => {
		const {container} = render(<PhraseInput phrase="DELETE"></PhraseInput>);
		await type(container, 'DEX');
		expect(preview(container)).toBeNull();
	});

	it('brings the preview back when the wrong character is taken out', async () => {
		const {container} = render(<PhraseInput phrase="DELETE"></PhraseInput>);
		await type(container, 'DEX');
		await type(container, 'DE');
		expect(preview(container)?.textContent).toBe('LETE');
	});

	it('reports every change', async () => {
		const onChange = vi.fn();
		const {container} = render(<PhraseInput phrase="DELETE" onChange={onChange}></PhraseInput>);
		await type(container, 'D');
		expect(onChange).toHaveBeenCalledWith('D');
	});

	it('reports the wrong character once, as it lands', async () => {
		const onInvalid = vi.fn();
		const {container} = render(<PhraseInput phrase="DELETE" onInvalid={onInvalid}></PhraseInput>);
		await type(container, 'DEX');
		await type(container, 'DEXX');
		expect(onInvalid).toHaveBeenCalledTimes(1);
		expect(onInvalid).toHaveBeenCalledWith('DEX');
	});

	it('reports the phrase being matched and then broken', async () => {
		const onMatchChange = vi.fn();
		const {container} = render(<PhraseInput phrase="DELETE" onMatchChange={onMatchChange}></PhraseInput>);
		await type(container, 'DELETE');
		expect(onMatchChange).toHaveBeenLastCalledWith(true);
		await type(container, 'DELET');
		expect(onMatchChange).toHaveBeenLastCalledWith(false);
	});

	it('shows the mismatch message as soon as the phrase is broken', async () => {
		const {container} = render(<PhraseInput phrase="DELETE" mismatchMessage="Not the phrase."></PhraseInput>);
		await type(container, 'DEX');
		expect(await screen.findByText('Not the phrase.')).toBeTruthy();
		expect(field(container).className).toContain('blue-orange-input-invalid');
	});

	it('leaves an unfinished phrase alone until the field is left', async () => {
		const {container} = render(<PhraseInput phrase="DELETE" incompleteMessage="Finish it."></PhraseInput>);
		await type(container, 'DEL');
		await waitFor(() => expect(screen.queryByText('Finish it.')).toBeNull());
		fireEvent.blur(field(container));
		expect(await screen.findByText('Finish it.')).toBeTruthy();
	});

	it('accepts the phrase in any case when told to ignore it', async () => {
		const {container} = render(<PhraseInput phrase="DELETE" ignoreCase={true}></PhraseInput>);
		await type(container, 'del');
		expect(preview(container)?.textContent).toBe('ETE');
	});

	it('holds the phrase to its case by default', async () => {
		const {container} = render(<PhraseInput phrase="DELETE"></PhraseInput>);
		await type(container, 'del');
		expect(preview(container)).toBeNull();
	});

	it('takes the value it is handed', async () => {
		const {container} = render(<PhraseInput phrase="DELETE" value="DELE"></PhraseInput>);
		expect(field(container).value).toBe('DELE');
		expect(preview(container)?.textContent).toBe('TE');
	});

	it('fails the form group while the phrase is not typed out', async () => {
		const onSubmit = vi.fn();
		const {container} = render(
			<FormGroup onSubmit={onSubmit}>
				<PhraseInput phrase="DELETE" name="confirm" label="Confirm"></PhraseInput>
			</FormGroup>
		);
		await type(container, 'DEL');
		fireEvent.blur(field(container));
		expect(await screen.findByText('Type "DELETE" in full to continue.')).toBeTruthy();
	});
});
