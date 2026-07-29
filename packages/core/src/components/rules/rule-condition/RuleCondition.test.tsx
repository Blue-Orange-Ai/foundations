import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {RuleCondition} from './RuleCondition';
import {ICondition, IConditionType, ILogicalOperand, IOperand, IRuleSchemaProperty} from '../rule-editor/RuleEditor';

const SCHEMA: Array<IRuleSchemaProperty> = [
	{key: 'name', value: 'String'} as IRuleSchemaProperty,
	{key: 'age', value: 'Number'} as IRuleSchemaProperty,
	{key: 'createdAt', value: 'Date'} as IRuleSchemaProperty,
	{key: 'active', value: 'Boolean'} as IRuleSchemaProperty,
];

const condition = (overrides: Partial<ICondition> = {}): ICondition => {
	return {
		cast: '',
		comparison: 'acme',
		conditionType: IConditionType.LEAF,
		groupConditions: [],
		ignoreCase: true,
		negation: false,
		logic: ILogicalOperand.AND,
		operand: IOperand.EQUALS,
		sub: undefined,
		variable: 'name',
		...overrides
	} as ICondition;
}

describe('RuleCondition', () => {

	it('lays the condition out as a filter row', () => {
		const {container} = render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		expect(container.querySelector('.blue-orange-filter-row')).toBeInTheDocument();
	});

	it('keeps the sentence reading "Value of ..."', () => {
		render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		expect(screen.getByText('Value of')).toBeInTheDocument();
	});

	it('shows the field, the operator and the value as separate segments', () => {
		const {container} = render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		const segments = Array.from(container.querySelectorAll('.blue-orange-filter-row-segment'));
		// value of | field | operator | value | match case
		expect(segments.length).toBe(5);
	});

	it('names the selected field without the index prefix it used to carry', () => {
		const {container} = render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		const field = container.querySelector('.blue-orange-rule-condition-variable-selection .blue-orange-dropdown-selection')!;
		expect(field.textContent).toBe('name');
	});

	it('shows the icon of the selected field once, from the dropdown itself', () => {
		const {container} = render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		const field = container.querySelector('.blue-orange-rule-condition-variable-selection')!;
		expect(field.querySelectorAll('.ri-paragraph').length).toBe(1);
	});

	it('shows the icon of a boolean field once too', () => {
		const {container} = render(
			<RuleCondition condition={condition({variable: 'active'})} schema={SCHEMA}></RuleCondition>
		);
		const field = container.querySelector('.blue-orange-rule-condition-variable-selection')!;
		expect(field.querySelectorAll('.ri-toggle-line').length).toBe(1);
	});

	it('offers the match case toggle on a string field', () => {
		render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		expect(screen.getByText('Match case')).toBeInTheDocument();
	});

	it('leaves the match case toggle off a number field', () => {
		render(<RuleCondition condition={condition({variable: 'age'})} schema={SCHEMA}></RuleCondition>);
		expect(screen.queryByText('Match case')).toBeNull();
	});

	it('leaves the match case toggle off a regular expression', () => {
		render(
			<RuleCondition condition={condition({operand: IOperand.REGEX})} schema={SCHEMA}></RuleCondition>
		);
		expect(screen.queryByText('Match case')).toBeNull();
	});

	it('asks for no value on a boolean field', () => {
		const {container} = render(
			<RuleCondition condition={condition({variable: 'active'})} schema={SCHEMA}></RuleCondition>
		);
		expect(container.querySelector('.blue-orange-rule-condition-user-input')).toBeNull();
	});

	it('still asks for a value on a string field', () => {
		const {container} = render(<RuleCondition condition={condition()} schema={SCHEMA}></RuleCondition>);
		expect(container.querySelector('.blue-orange-rule-condition-user-input input')).toBeInTheDocument();
	});

	it('reports the value as it is typed', () => {
		const onChange = vi.fn();
		const {container} = render(
			<RuleCondition condition={condition()} schema={SCHEMA} onChange={onChange}></RuleCondition>
		);
		const input = container.querySelector('.blue-orange-rule-condition-user-input input') as HTMLInputElement;
		fireEvent.change(input, {target: {value: 'globex'}});
		expect(onChange).toHaveBeenCalled();
		expect(onChange.mock.calls[onChange.mock.calls.length - 1][0].comparison).toBe('globex');
	});

	it('removes the condition from the action at the end of the row', () => {
		const onDelete = vi.fn();
		render(<RuleCondition condition={condition()} schema={SCHEMA} onDelete={onDelete}></RuleCondition>);
		fireEvent.click(screen.getByLabelText('Delete'));
		expect(onDelete).toHaveBeenCalled();
	});
});
