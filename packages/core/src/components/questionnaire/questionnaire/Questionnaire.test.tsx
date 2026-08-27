import React, {useState} from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {Questionnaire} from './Questionnaire';
import {QuestionnaireItem} from '../questionnaire-item/QuestionnaireItem';
import {QuestionnaireAnswers, QuestionnaireProgress, QuestionnaireShortcut} from './QuestionnaireTypes';

const ROLES = [
	{uuid: "engineer", label: "Engineer", hint: "You ship the thing."},
	{uuid: "designer", label: "Designer"},
	{uuid: "other", label: "Other", disabled: true}
];

const renderQuestionnaire = (props: any = {}) => {
	return render(
		<Questionnaire {...props}>
			<QuestionnaireItem uuid="role" prompt="What do you do?" description="So we know what to show you." choices={ROLES}></QuestionnaireItem>
			<QuestionnaireItem uuid="tools" prompt="Which tools do you use?" multiple={true} choices={[
				{uuid: "cli", label: "CLI"},
				{uuid: "ide", label: "IDE"}
			]}></QuestionnaireItem>
			<QuestionnaireItem uuid="notes" prompt="Anything else?" optional={true} freeform={true}></QuestionnaireItem>
		</Questionnaire>
	);
}

const choiceOf = (label: string) => {
	return screen.getByText(label).closest('button')!;
}

describe('Questionnaire', () => {

	it('asks the first question first', () => {
		renderQuestionnaire();
		expect(screen.getByText('What do you do?')).not.toBeNull();
		expect(screen.queryByText('Which tools do you use?')).toBeNull();
	});

	it('shows the description and the hints of the question', () => {
		renderQuestionnaire();
		expect(screen.getByText('So we know what to show you.')).not.toBeNull();
		expect(screen.getByText('You ship the thing.')).not.toBeNull();
	});

	it('counts the question being asked', () => {
		renderQuestionnaire();
		expect(screen.getByText('Question 1 of 3')).not.toBeNull();
	});

	it('leaves the count out when it is turned off', () => {
		renderQuestionnaire({progress: QuestionnaireProgress.NONE});
		expect(screen.queryByText('Question 1 of 3')).toBeNull();
	});

	it('renders one radio per choice', () => {
		renderQuestionnaire();
		expect(screen.getAllByRole('radio').length).toBe(3);
	});

	it('marks the choice that was picked', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		expect(choiceOf('Engineer').getAttribute('aria-checked')).toBe('true');
	});

	it('reports the answer that was given', () => {
		const onAnswerChange = vi.fn();
		renderQuestionnaire({onAnswerChange});
		fireEvent.click(choiceOf('Designer'));
		expect(onAnswerChange).toHaveBeenCalledWith(
			'role',
			{choices: ['designer'], text: '', skipped: false},
			{role: {choices: ['designer'], text: '', skipped: false}}
		);
	});

	it('moves the answer of a single choice question rather than adding to it', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(choiceOf('Designer'));
		expect(choiceOf('Engineer').getAttribute('aria-checked')).toBe('false');
		expect(choiceOf('Designer').getAttribute('aria-checked')).toBe('true');
	});

	it('never picks a disabled choice', () => {
		const onAnswerChange = vi.fn();
		renderQuestionnaire({onAnswerChange});
		fireEvent.click(choiceOf('Other'));
		expect(onAnswerChange).not.toHaveBeenCalled();
	});

	it('holds the flow on a question that has not been answered', () => {
		renderQuestionnaire();
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Pick an answer to continue.')).not.toBeNull();
		expect(screen.getByText('What do you do?')).not.toBeNull();
	});

	it('shows the message the question supplies instead of the default one', () => {
		render(
			<Questionnaire>
				<QuestionnaireItem uuid="role" prompt="What do you do?" requiredMessage="We need this one." choices={ROLES}></QuestionnaireItem>
			</Questionnaire>
		);
		fireEvent.click(screen.getByText('Submit'));
		expect(screen.getByText('We need this one.')).not.toBeNull();
	});

	it('holds the flow on a validate callback that returns a message', () => {
		render(
			<Questionnaire>
				<QuestionnaireItem
					uuid="role"
					prompt="What do you do?"
					choices={ROLES}
					validate={answer => answer.choices.includes('designer') ? 'Not that one.' : undefined}
				></QuestionnaireItem>
			</Questionnaire>
		);
		fireEvent.click(choiceOf('Designer'));
		fireEvent.click(screen.getByText('Submit'));
		expect(screen.getByText('Not that one.')).not.toBeNull();
	});

	it('moves on once the question is answered', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Which tools do you use?')).not.toBeNull();
		expect(screen.getByText('Question 2 of 3')).not.toBeNull();
	});

	it('clears the message once the question is answered', () => {
		renderQuestionnaire();
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(choiceOf('Engineer'));
		expect(screen.queryByText('Pick an answer to continue.')).toBeNull();
	});

	it('reports the question it moved to', () => {
		const onItemChange = vi.fn();
		renderQuestionnaire({onItemChange});
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		expect(onItemChange).toHaveBeenCalledWith('tools', 1);
	});

	it('goes back to the answer already given', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Back'));
		expect(choiceOf('Engineer').getAttribute('aria-checked')).toBe('true');
	});

	it('offers no way back from the first question', () => {
		renderQuestionnaire();
		expect(screen.queryByText('Back')).toBeNull();
	});

	it('offers no way back at all when going back is turned off', () => {
		renderQuestionnaire({allowBack: false});
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.queryByText('Back')).toBeNull();
	});

	it('moves on by itself once a single choice question is answered', () => {
		vi.useFakeTimers();
		try {
			renderQuestionnaire({autoAdvance: true, autoAdvanceDelay: 100});
			fireEvent.click(choiceOf('Engineer'));
			expect(screen.getByText('What do you do?')).not.toBeNull();
			act(() => {vi.advanceTimersByTime(100)});
			expect(screen.getByText('Which tools do you use?')).not.toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});

	it('never moves on by itself from a question that takes more than one answer', () => {
		vi.useFakeTimers();
		try {
			renderQuestionnaire({autoAdvance: true, autoAdvanceDelay: 100});
			fireEvent.click(choiceOf('Engineer'));
			act(() => {vi.advanceTimersByTime(100)});
			fireEvent.click(choiceOf('CLI'));
			act(() => {vi.advanceTimersByTime(500)});
			expect(screen.getByText('Which tools do you use?')).not.toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});

	it('takes focus to each question as it is reached', () => {
		const {container} = renderQuestionnaire();
		const panel = container.querySelector('.blue-orange-questionnaire')!;
		expect(document.activeElement).not.toBe(panel);
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		expect(document.activeElement).toBe(panel);
	});

	it('picks a choice with its key without a click first', () => {
		const {container} = renderQuestionnaire();
		const panel = container.querySelector('.blue-orange-questionnaire')!;
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.keyDown(panel, {key: 'a'});
		expect(choiceOf('CLI').getAttribute('aria-checked')).toBe('true');
	});

	it('renders checkboxes when more than one answer is allowed', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getAllByRole('checkbox').length).toBe(2);
	});

	it('keeps every answer picked on a multiple choice question', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(choiceOf('CLI'));
		fireEvent.click(choiceOf('IDE'));
		expect(choiceOf('CLI').getAttribute('aria-checked')).toBe('true');
		expect(choiceOf('IDE').getAttribute('aria-checked')).toBe('true');
	});

	it('takes an answer back off a multiple choice question on a second click', () => {
		renderQuestionnaire();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(choiceOf('CLI'));
		fireEvent.click(choiceOf('CLI'));
		expect(choiceOf('CLI').getAttribute('aria-checked')).toBe('false');
	});

	it('offers a skip only on the questions that allow it', () => {
		renderQuestionnaire();
		expect(screen.queryByText('Skip')).toBeNull();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(choiceOf('CLI'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Skip')).not.toBeNull();
	});

	it('marks a skipped question as skipped rather than answered', () => {
		const onSubmit = vi.fn();
		renderQuestionnaire({onSubmit});
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(choiceOf('CLI'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Skip'));
		expect(onSubmit).toHaveBeenCalledWith({
			role: {choices: ['engineer'], text: '', skipped: false},
			tools: {choices: ['cli'], text: '', skipped: false},
			notes: {choices: [], text: '', skipped: true}
		});
	});

	it('submits every answer from the last question', () => {
		const onSubmit = vi.fn();
		renderQuestionnaire({onSubmit});
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(choiceOf('CLI'));
		fireEvent.click(screen.getByText('Next'));
		fireEvent.click(screen.getByText('Submit'));
		expect(onSubmit).toHaveBeenCalledWith({
			role: {choices: ['engineer'], text: '', skipped: false},
			tools: {choices: ['cli'], text: '', skipped: false}
		});
	});

	it('writes a freeform answer into the answer of the question', () => {
		const onSubmit = vi.fn();
		render(
			<Questionnaire onSubmit={onSubmit}>
				<QuestionnaireItem uuid="notes" prompt="Anything else?" freeform={true}></QuestionnaireItem>
			</Questionnaire>
		);
		fireEvent.change(screen.getByRole('textbox'), {target: {value: 'The search is slow.'}});
		fireEvent.click(screen.getByText('Submit'));
		expect(onSubmit).toHaveBeenCalledWith({
			notes: {choices: ['__questionnaire_freeform__'], text: 'The search is slow.', skipped: false}
		});
	});

	it('opens the field only once the freeform row is picked', () => {
		render(
			<Questionnaire>
				<QuestionnaireItem uuid="role" prompt="What do you do?" freeform={true} choices={ROLES}></QuestionnaireItem>
			</Questionnaire>
		);
		expect(screen.queryByRole('textbox')).toBeNull();
		fireEvent.click(choiceOf('Something else'));
		expect(screen.getByRole('textbox')).not.toBeNull();
	});

	it('counts an empty freeform row as no answer at all', () => {
		render(
			<Questionnaire>
				<QuestionnaireItem uuid="role" prompt="What do you do?" freeform={true} choices={ROLES}></QuestionnaireItem>
			</Questionnaire>
		);
		fireEvent.click(choiceOf('Something else'));
		fireEvent.click(screen.getByText('Submit'));
		expect(screen.getByText('Pick an answer to continue.')).not.toBeNull();
	});

	it('picks a choice with the letter beside it', () => {
		const {container} = renderQuestionnaire();
		fireEvent.keyDown(container.querySelector('.blue-orange-questionnaire')!, {key: 'b'});
		expect(choiceOf('Designer').getAttribute('aria-checked')).toBe('true');
	});

	it('picks a choice with the number beside it', () => {
		const {container} = renderQuestionnaire({shortcut: QuestionnaireShortcut.NUMBER});
		fireEvent.keyDown(container.querySelector('.blue-orange-questionnaire')!, {key: '2'});
		expect(choiceOf('Designer').getAttribute('aria-checked')).toBe('true');
	});

	it('offers no key when the shortcuts are turned off', () => {
		const {container} = renderQuestionnaire({shortcut: QuestionnaireShortcut.NONE});
		expect(container.querySelector('.blue-orange-kbd')).toBeNull();
		fireEvent.keyDown(container.querySelector('.blue-orange-questionnaire')!, {key: 'b'});
		expect(choiceOf('Designer').getAttribute('aria-checked')).toBe('false');
	});

	it('leaves the letters to the field while a freeform answer is being written', () => {
		render(
			<Questionnaire>
				<QuestionnaireItem uuid="role" prompt="What do you do?" freeform={true} choices={ROLES}></QuestionnaireItem>
			</Questionnaire>
		);
		fireEvent.click(choiceOf('Something else'));
		fireEvent.keyDown(screen.getByRole('textbox'), {key: 'b'});
		expect(choiceOf('Designer').getAttribute('aria-checked')).toBe('false');
	});

	it('never picks a disabled choice with its key', () => {
		const {container} = renderQuestionnaire();
		fireEvent.keyDown(container.querySelector('.blue-orange-questionnaire')!, {key: 'c'});
		expect(choiceOf('Other').getAttribute('aria-checked')).toBe('false');
	});

	it('skips over a question that is turned off', () => {
		render(
			<Questionnaire>
				<QuestionnaireItem uuid="role" prompt="What do you do?" choices={ROLES}></QuestionnaireItem>
				<QuestionnaireItem uuid="team" prompt="How big is your team?" enabled={false} choices={ROLES}></QuestionnaireItem>
				<QuestionnaireItem uuid="notes" prompt="Anything else?" optional={true}></QuestionnaireItem>
			</Questionnaire>
		);
		expect(screen.getByText('Question 1 of 2')).not.toBeNull();
		fireEvent.click(choiceOf('Engineer'));
		fireEvent.click(screen.getByText('Next'));
		expect(screen.getByText('Anything else?')).not.toBeNull();
	});

	it('follows the answers it is given from the outside', () => {
		render(
			<Questionnaire answers={{role: {choices: ['designer'], text: '', skipped: false}}}>
				<QuestionnaireItem uuid="role" prompt="What do you do?" choices={ROLES}></QuestionnaireItem>
			</Questionnaire>
		);
		expect(choiceOf('Designer').getAttribute('aria-checked')).toBe('true');
	});

	it('follows the active question when it changes', () => {
		const Controlled: React.FC = () => {
			const [active, setActive] = useState('role');
			return (
				<>
					<button onClick={() => setActive('notes')}>Go</button>
					<Questionnaire activeItem={active}>
						<QuestionnaireItem uuid="role" prompt="What do you do?" choices={ROLES}></QuestionnaireItem>
						<QuestionnaireItem uuid="notes" prompt="Anything else?" optional={true}></QuestionnaireItem>
					</Questionnaire>
				</>
			)
		};
		render(<Controlled/>);
		expect(screen.getByText('What do you do?')).not.toBeNull();
		fireEvent.click(screen.getByText('Go'));
		expect(screen.getByText('Anything else?')).not.toBeNull();
	});

	it('holds the answers on behalf of a caller that keeps them', () => {
		const Held: React.FC = () => {
			const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
			return (
				<Questionnaire answers={answers} onAnswerChange={(uuid, answer, all) => setAnswers(all)}>
					<QuestionnaireItem uuid="role" prompt="What do you do?" choices={ROLES}></QuestionnaireItem>
				</Questionnaire>
			)
		};
		render(<Held/>);
		fireEvent.click(choiceOf('Engineer'));
		expect(choiceOf('Engineer').getAttribute('aria-checked')).toBe('true');
	});

	it('renders the footer it is given instead of its own', () => {
		renderQuestionnaire({footer: <button>Done</button>});
		expect(screen.getByText('Done')).not.toBeNull();
		expect(screen.queryByText('Next')).toBeNull();
	});

	it('shows a cancel button only when there is somewhere to cancel to', () => {
		const onCancel = vi.fn();
		renderQuestionnaire({onCancel});
		fireEvent.click(screen.getByText('Cancel'));
		expect(onCancel).toHaveBeenCalled();
	});

	it('renders nothing when every question is turned off', () => {
		const {container} = render(
			<Questionnaire>
				<QuestionnaireItem uuid="role" prompt="What do you do?" enabled={false}></QuestionnaireItem>
			</Questionnaire>
		);
		expect(container.querySelector('.blue-orange-questionnaire')).toBeNull();
	});
});
