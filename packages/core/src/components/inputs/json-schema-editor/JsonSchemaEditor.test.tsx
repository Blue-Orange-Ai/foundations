import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {JsonSchemaEditor} from './JsonSchemaEditor';
import {JsonSchemaField, JsonSchemaFieldType} from './JsonSchemaTypes';
import {fromJsonSchema, toJsonSchema} from './JsonSchemaConversion';
import {inferJsonSchemaFields} from './JsonSchemaInference';
import {ButtonSize} from '../../buttons/button/Button';

const FIELDS: JsonSchemaField[] = [
	{key: 'name', type: JsonSchemaFieldType.STRING, array: false},
	{key: 'tags', type: JsonSchemaFieldType.STRING, array: true},
	{
		key: 'address', type: JsonSchemaFieldType.OBJECT, array: false, fields: [
			{key: 'postcode', type: JsonSchemaFieldType.STRING, array: false}
		]
	}
];

describe('JsonSchemaEditor', () => {

	it('lays every field out as a filter row', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		// three top level fields plus the one member of the struct
		expect(container.querySelectorAll('.blue-orange-json-schema-field-row').length).toBe(4);
	});

	it('names the type of a field in its dropdown', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		const type = container.querySelector('.blue-orange-json-schema-field-type .blue-orange-dropdown-selection')!;
		expect(type.textContent).toBe('String');
	});

	it('flags an array field', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		const checkboxes = container.querySelectorAll('.blue-orange-json-schema-field-array input');
		expect((checkboxes[0] as HTMLInputElement).checked).toBe(false);
		expect((checkboxes[1] as HTMLInputElement).checked).toBe(true);
	});

	it('indents the members of a struct underneath it', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		const children = container.querySelectorAll('.blue-orange-json-schema-field-children');
		expect(children.length).toBe(1);
		expect(children[0].querySelectorAll('.blue-orange-json-schema-field-row').length).toBe(1);
	});

	it('collapses a struct when its expander is clicked', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		const expander = container.querySelectorAll('.blue-orange-json-schema-field-toggle')[2];
		fireEvent.click(expander);
		expect(container.querySelectorAll('.blue-orange-json-schema-field-children').length).toBe(0);
	});

	it('marks a leaf with the icon of its type', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		const leaves = container.querySelectorAll('.blue-orange-json-schema-field-leaf-icon');
		// name, tags and the struct's postcode — the struct itself gets an expander
		expect(leaves.length).toBe(3);
		expect(leaves[0].classList.contains('ri-paragraph')).toBe(true);
	});

	it('lets the type be searched for', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		fireEvent.click(container.querySelector('.blue-orange-json-schema-field-type .blue-orange-dropdown')!);
		expect(document.querySelector('.blue-orange-dropdown-window-filter-cont')).toBeInTheDocument();
	});

	it('appends an empty field', () => {
		const onChange = vi.fn();
		render(<JsonSchemaEditor value={FIELDS} onChange={onChange}></JsonSchemaEditor>);
		// the struct has one of its own, so the last is the root's
		const add = screen.getAllByText('Add field');
		fireEvent.click(add[add.length - 1]);
		expect(onChange).toHaveBeenCalled();
		const emitted = onChange.mock.calls[onChange.mock.calls.length - 1][0] as JsonSchemaField[];
		expect(emitted.length).toBe(4);
		expect(emitted[3]).toEqual(expect.objectContaining({key: '', type: JsonSchemaFieldType.STRING, array: false}));
	});

	it('renames a field as it is typed', () => {
		const onChange = vi.fn();
		const {container} = render(<JsonSchemaEditor value={FIELDS} onChange={onChange}></JsonSchemaEditor>);
		const input = container.querySelectorAll('.blue-orange-json-schema-field-key input')[0];
		fireEvent.change(input, {target: {value: 'title'}});
		const emitted = onChange.mock.calls[onChange.mock.calls.length - 1][0] as JsonSchemaField[];
		expect(emitted[0].key).toBe('title');
	});

	it('marks a field that shares its name with a sibling', () => {
		const duplicated: JsonSchemaField[] = [
			{key: 'name', type: JsonSchemaFieldType.STRING, array: false},
			{key: 'name', type: JsonSchemaFieldType.STRING, array: false}
		];
		const {container} = render(<JsonSchemaEditor value={duplicated}></JsonSchemaEditor>);
		expect(container.querySelectorAll('.blue-orange-input-invalid').length).toBe(2);
	});

	it('leaves unnamed fields unmarked', () => {
		const {container} = render(<JsonSchemaEditor value={[
			{key: '', type: JsonSchemaFieldType.STRING, array: false},
			{key: '', type: JsonSchemaFieldType.STRING, array: false}
		]}></JsonSchemaEditor>);
		expect(container.querySelectorAll('.blue-orange-input-invalid').length).toBe(0);
	});

	it('turns a field into a struct when Struct is picked', () => {
		const onChange = vi.fn();
		const {container} = render(<JsonSchemaEditor
			value={[{key: 'name', type: JsonSchemaFieldType.STRING, array: false}]}
			onChange={onChange}></JsonSchemaEditor>);
		fireEvent.click(container.querySelector('.blue-orange-json-schema-field-type .blue-orange-dropdown')!);
		fireEvent.click(screen.getByText('Struct'));
		const emitted = onChange.mock.calls[onChange.mock.calls.length - 1][0] as JsonSchemaField[];
		expect(emitted[0].type).toBe(JsonSchemaFieldType.OBJECT);
		// a struct opens with a member ready to fill in
		expect(emitted[0].fields?.length).toBe(1);
	});

	it('adds fields with a small core button by default', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS}></JsonSchemaEditor>);
		const buttons = container.querySelectorAll('.foundations-default-btn');
		// one at the root and one inside the struct
		expect(buttons.length).toBe(2);
		buttons.forEach(button => expect(button.classList.contains('foundations-btn-sm')).toBe(true));
	});

	it('takes the size of those buttons from the caller', () => {
		const {container} = render(<JsonSchemaEditor value={FIELDS} buttonSize={ButtonSize.LARGE}></JsonSchemaEditor>);
		expect(container.querySelectorAll('.foundations-btn-lg').length).toBe(2);
		expect(container.querySelectorAll('.foundations-btn-sm').length).toBe(0);
	});

	it('offers no infer link unless it is asked for', () => {
		render(<JsonSchemaEditor label="Schema" value={FIELDS}></JsonSchemaEditor>);
		expect(screen.queryByText('Infer from JSON')).not.toBeInTheDocument();
	});

	it('reads a pasted example into the schema', () => {
		const onChange = vi.fn();
		render(<JsonSchemaEditor label="Schema" value={FIELDS} allowJsonImport={true} onChange={onChange}></JsonSchemaEditor>);
		fireEvent.click(screen.getByText('Infer from JSON'));
		fireEvent.change(document.querySelector('.blue-orange-default-text-area')!, {
			target: {value: '{"title": "Acme", "count": 3, "when": "2024-01-02T03:04:05Z"}'}
		});
		fireEvent.click(screen.getByText('Infer schema'));
		const emitted = onChange.mock.calls[onChange.mock.calls.length - 1][0] as JsonSchemaField[];
		expect(emitted.map(field => field.key)).toEqual(['title', 'count', 'when']);
		expect(emitted.map(field => field.type)).toEqual([
			JsonSchemaFieldType.STRING, JsonSchemaFieldType.INTEGER, JsonSchemaFieldType.DATE_TIME]);
	});

	it('keeps the window open and says so when the example is not valid json', () => {
		const onChange = vi.fn();
		render(<JsonSchemaEditor label="Schema" value={FIELDS} allowJsonImport={true} onChange={onChange}></JsonSchemaEditor>);
		fireEvent.click(screen.getByText('Infer from JSON'));
		fireEvent.change(document.querySelector('.blue-orange-default-text-area')!, {target: {value: '{oops'}});
		fireEvent.click(screen.getByText('Infer schema'));
		expect(document.querySelector('.blue-orange-json-schema-import-error')).toBeInTheDocument();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('turns down an example that describes no fields', () => {
		render(<JsonSchemaEditor label="Schema" value={FIELDS} allowJsonImport={true}></JsonSchemaEditor>);
		fireEvent.click(screen.getByText('Infer from JSON'));
		fireEvent.change(document.querySelector('.blue-orange-default-text-area')!, {target: {value: '"just a string"'}});
		fireEvent.click(screen.getByText('Infer schema'));
		expect(document.querySelector('.blue-orange-json-schema-import-error')).toBeInTheDocument();
	});

	it('stops offering a struct once the depth limit is reached', () => {
		const onChange = vi.fn();
		const {container} = render(<JsonSchemaEditor
			value={[{key: 'name', type: JsonSchemaFieldType.STRING, array: false}]}
			maxDepth={1}
			onChange={onChange}></JsonSchemaEditor>);
		fireEvent.click(container.querySelector('.blue-orange-json-schema-field-type .blue-orange-dropdown')!);
		fireEvent.click(screen.getByText('Struct'));
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('json schema conversion', () => {

	it('writes java types out with their json schema format', () => {
		const schema = toJsonSchema([
			{key: 'name', type: JsonSchemaFieldType.STRING, array: false},
			{key: 'count', type: JsonSchemaFieldType.INTEGER, array: false},
			{key: 'total', type: JsonSchemaFieldType.DOUBLE, array: false},
			{key: 'id', type: JsonSchemaFieldType.UUID, array: false}
		]);
		expect(schema.properties.name).toEqual({type: 'string'});
		expect(schema.properties.count).toEqual({type: 'integer', format: 'int32'});
		expect(schema.properties.total).toEqual({type: 'number', format: 'double'});
		expect(schema.properties.id).toEqual({type: 'string', format: 'uuid'});
	});

	it('wraps an array field in its items', () => {
		const schema = toJsonSchema([{key: 'tags', type: JsonSchemaFieldType.STRING, array: true}]);
		expect(schema.properties.tags).toEqual({type: 'array', items: {type: 'string'}});
	});

	it('nests a struct and a struct array', () => {
		const schema = toJsonSchema([
			{
				key: 'orders', type: JsonSchemaFieldType.OBJECT, array: true, fields: [
					{key: 'reference', type: JsonSchemaFieldType.STRING, array: false}
				]
			}
		]);
		expect(schema.properties.orders).toEqual({
			type: 'array',
			items: {type: 'object', properties: {reference: {type: 'string'}}}
		});
	});

	it('skips a field that has not been named yet', () => {
		const schema = toJsonSchema([{key: '  ', type: JsonSchemaFieldType.STRING, array: false}]);
		expect(schema.properties).toEqual({});
	});

	it('reads a document back into the same fields', () => {
		const fields: JsonSchemaField[] = [
			{key: 'name', type: JsonSchemaFieldType.STRING, array: false},
			{key: 'tags', type: JsonSchemaFieldType.STRING, array: true},
			{
				key: 'orders', type: JsonSchemaFieldType.OBJECT, array: true, fields: [
					{key: 'placed', type: JsonSchemaFieldType.DATE_TIME, array: false}
				]
			}
		];
		expect(fromJsonSchema(toJsonSchema(fields))).toEqual(fields);
	});

	it('reads an unformatted number as a double and an unknown type as a string', () => {
		const fields = fromJsonSchema({
			type: 'object',
			properties: {total: {type: 'number'}, blob: {type: 'wat'}}
		});
		expect(fields[0].type).toBe(JsonSchemaFieldType.DOUBLE);
		expect(fields[1].type).toBe(JsonSchemaFieldType.STRING);
	});
});

describe('json schema inference', () => {

	it('reads java types out of the values', () => {
		const fields = inferJsonSchemaFields({
			name: 'Acme',
			id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
			count: 7,
			population: 5000000000,
			total: 12.5,
			active: true,
			born: '2024-01-02',
			seen: '2024-01-02T03:04:05Z'
		})!;
		expect(fields.map(field => field.type)).toEqual([
			JsonSchemaFieldType.STRING,
			JsonSchemaFieldType.UUID,
			JsonSchemaFieldType.INTEGER,
			JsonSchemaFieldType.LONG,
			JsonSchemaFieldType.DOUBLE,
			JsonSchemaFieldType.BOOLEAN,
			JsonSchemaFieldType.DATE,
			JsonSchemaFieldType.DATE_TIME
		]);
	});

	it('flags a list and reads its member type', () => {
		const fields = inferJsonSchemaFields({tags: ['a', 'b']})!;
		expect(fields[0]).toEqual({key: 'tags', type: JsonSchemaFieldType.STRING, array: true});
	});

	it('reads a nested object and a list of objects as structs', () => {
		const fields = inferJsonSchemaFields({
			address: {postcode: 'SW1'},
			orders: [{reference: 'A-1', total: 4.5}]
		})!;
		expect(fields[0]).toEqual({
			key: 'address', type: JsonSchemaFieldType.OBJECT, array: false,
			fields: [{key: 'postcode', type: JsonSchemaFieldType.STRING, array: false}]
		});
		expect(fields[1].type).toBe(JsonSchemaFieldType.OBJECT);
		expect(fields[1].array).toBe(true);
		expect(fields[1].fields?.map(field => field.key)).toEqual(['reference', 'total']);
	});

	it('reads every member of a list, not just the first', () => {
		const fields = inferJsonSchemaFields([
			{reference: 'A-1'},
			{reference: 'A-2', shipped: '2024-01-02'}
		])!;
		expect(fields.map(field => field.key)).toEqual(['reference', 'shipped']);
		expect(fields[1].type).toBe(JsonSchemaFieldType.DATE);
	});

	it('skips a null to find the type a list really holds', () => {
		const fields = inferJsonSchemaFields({scores: [null, 4.5]})!;
		expect(fields[0].type).toBe(JsonSchemaFieldType.DOUBLE);
		expect(fields[0].array).toBe(true);
	});

	it('falls back to a string when a value says nothing', () => {
		const fields = inferJsonSchemaFields({unknown: null, nothing: []})!;
		expect(fields[0].type).toBe(JsonSchemaFieldType.STRING);
		expect(fields[1]).toEqual({key: 'nothing', type: JsonSchemaFieldType.STRING, array: true});
	});

	it('describes no fields for a bare value', () => {
		expect(inferJsonSchemaFields('acme')).toBeUndefined();
		expect(inferJsonSchemaFields(12)).toBeUndefined();
		expect(inferJsonSchemaFields([])).toBeUndefined();
	});
});
