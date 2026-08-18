import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {RuleGroup} from './RuleGroup';
import {ICondition, IConditionType, ILogicalOperand, IOperand, IRuleSchemaProperty} from '../rule-editor/RuleEditor';
import {ButtonSize} from '../../buttons/button/Button';

const SCHEMA: Array<IRuleSchemaProperty> = [
	{key: 'name', value: 'String'} as IRuleSchemaProperty,
	{key: 'age', value: 'Number'} as IRuleSchemaProperty,
];

const leaf = (overrides: Partial<ICondition> = {}): ICondition => {
	return {
		cast: '',
		comparison: '',
		conditionType: IConditionType.LEAF,
		groupConditions: [],
		ignoreCase: false,
		negation: false,
		logic: ILogicalOperand.AND,
		operand: IOperand.EQUALS,
		sub: undefined,
		variable: 'name',
		...overrides
	} as ICondition;
}

const group = (conditions: Array<ICondition>): ICondition => {
	return leaf({conditionType: IConditionType.GROUP, groupConditions: conditions});
}

describe('RuleGroup', () => {

	it('puts the match on one line rather than in a menu', () => {
		const {container} = render(
			<RuleGroup conditions={[]} logic={ILogicalOperand.AND} schema={SCHEMA} onChange={vi.fn()}></RuleGroup>
		);
		expect(container.querySelector('.blue-orange-rule-group-logic')).toBeInTheDocument();
		expect(container.querySelector('.blue-orange-rule-group-logic .blue-orange-dropdown')).toBeNull();
	});

	it('reads as a sentence with both answers on show', () => {
		render(<RuleGroup conditions={[]} logic={ILogicalOperand.AND} schema={SCHEMA} onChange={vi.fn()}></RuleGroup>);
		expect(screen.getByText('Match')).toBeInTheDocument();
		expect(screen.getByText('All')).toBeInTheDocument();
		expect(screen.getByText('Any')).toBeInTheDocument();
		expect(screen.getByText('of the following')).toBeInTheDocument();
	});

	it('marks the answer in force', () => {
		const {container} = render(
			<RuleGroup conditions={[]} logic={ILogicalOperand.OR} schema={SCHEMA} onChange={vi.fn()}></RuleGroup>
		);
		const selected = container.querySelectorAll('.blue-orange-rule-group-logic-option-selected');
		expect(selected.length).toBe(1);
		expect(selected[0].textContent).toBe('Any');
	});

	it('switches the match in a single click', () => {
		const onChange = vi.fn();
		render(<RuleGroup conditions={[]} logic={ILogicalOperand.AND} schema={SCHEMA} onChange={onChange}></RuleGroup>);
		fireEvent.click(screen.getByText('Any'));
		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].logic).toBe(ILogicalOperand.OR);
	});

	it('names the operator between two conditions and not before the first', () => {
		const {container} = render(
			<RuleGroup conditions={[leaf(), leaf(), leaf()]} logic={ILogicalOperand.AND} schema={SCHEMA}
					   onChange={vi.fn()}></RuleGroup>
		);
		const operands = container.querySelectorAll('.blue-orange-rule-condition-operand');
		expect(operands.length).toBe(2);
		expect(operands[0].textContent).toBe('and');
	});

	it('names the operator of an any group as or', () => {
		const {container} = render(
			<RuleGroup conditions={[leaf(), leaf()]} logic={ILogicalOperand.OR} schema={SCHEMA}
					   onChange={vi.fn()}></RuleGroup>
		);
		expect(container.querySelector('.blue-orange-rule-condition-operand')!.textContent).toBe('or');
	});

	it('steps the conditions in from the line stating how they are matched', () => {
		const {container} = render(
			<RuleGroup conditions={[leaf()]} logic={ILogicalOperand.AND} schema={SCHEMA} onChange={vi.fn()}></RuleGroup>
		);
		const conditions = container.querySelector('.blue-orange-rule-group-conditions')!;
		expect(conditions.querySelectorAll('.blue-orange-rule-condition-item').length).toBe(1);
	});

	it('indents a nested group under the one holding it', () => {
		const {container} = render(
			<RuleGroup conditions={[group([leaf()])]} logic={ILogicalOperand.AND} schema={SCHEMA}
					   onChange={vi.fn()}></RuleGroup>
		);
		const nested = container.querySelectorAll('.blue-orange-rule-group-conditions');
		expect(nested.length).toBe(2);
	});

	it('adds a condition and a group from small buttons', () => {
		const {container} = render(
			<RuleGroup conditions={[]} logic={ILogicalOperand.AND} schema={SCHEMA} onChange={vi.fn()}></RuleGroup>
		);
		const buttons = container.querySelectorAll('.blue-orange-rule-group-add-btns .foundations-default-btn');
		expect(buttons.length).toBe(2);
		buttons.forEach(button => expect(button.classList.contains('foundations-btn-sm')).toBe(true));
	});

	it('takes the size of those buttons from the caller', () => {
		const {container} = render(
			<RuleGroup conditions={[]} logic={ILogicalOperand.AND} schema={SCHEMA} buttonSize={ButtonSize.LARGE}
					   onChange={vi.fn()}></RuleGroup>
		);
		expect(container.querySelectorAll('.blue-orange-rule-group-add-btns .foundations-btn-lg').length).toBe(2);
	});

	it('appends a condition to the group', () => {
		const onChange = vi.fn();
		render(<RuleGroup conditions={[]} logic={ILogicalOperand.AND} schema={SCHEMA} onChange={onChange}></RuleGroup>);
		fireEvent.click(screen.getByText('Add condition'));
		expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].groupConditions.length).toBe(1);
	});

	it('removes a nested group from the action on its own line', () => {
		const onDelete = vi.fn();
		render(
			<RuleGroup condition={group([])} schema={SCHEMA} onChange={vi.fn()} onDelete={onDelete}></RuleGroup>
		);
		fireEvent.click(screen.getByLabelText('Delete'));
		expect(onDelete).toHaveBeenCalled();
	});

	it('leaves the top level group with nothing to delete', () => {
		render(
			<RuleGroup conditions={[]} deletable={false} logic={ILogicalOperand.AND} schema={SCHEMA}
					   onChange={vi.fn()}></RuleGroup>
		);
		expect(screen.queryByLabelText('Delete')).toBeNull();
	});
});
