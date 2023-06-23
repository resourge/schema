import { SchemaError } from 'src/lib/types/types';

import { date, DateSchema } from '../DateSchema'

describe('date', () => {
	it('should be today', () => {
		const schema = date()
		.today()
		.compile();

		expect(schema.isValid(new Date('2001-01-01')))
		.toBeFalsy()
		expect(schema.isValid(new Date()))
		.toBeTruthy()
		expect(schema.isValid(new Date('test')))
		.toBeFalsy()

		const _date = new Date();

		_date.setHours(10);

		expect(schema.isValid(_date))
		.toBeTruthy()

		const newMessage = 'New Message'
		const schemaMessage = new DateSchema()
		.today(newMessage);

		const errors: SchemaError[] = [{
			path: '',
			error: newMessage
		}]

		expect(
			schemaMessage.validate(new Date('2001-01-01'))
		)
		.toEqual(errors)
	})

	it('should each schema be separated from previous', () => {
		const schema = date()
		.nullable()
		const schema1 = schema.optional()
		.today();
	
		// @ts-expect-error // To check protected values
		expect(schema.isNullable)
		.toBe(true)
		// @ts-expect-error // To check protected values
		expect(schema.isOptional)
		.toBe(false)
		// @ts-expect-error // To check protected values
		expect(schema1.isNullable)
		.toBe(true)
		// @ts-expect-error // To check protected values
		expect(schema1.isOptional)
		.toBe(true)

		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size)
		.toBe(0)
		// @ts-expect-error // To check protected values
		expect(schema1.def.normalRules.size)
		.toBe(1)
		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size).not.toBe(schema1.def.normalRules.size)
	})

	it('should be optional even if is not date type', () => {
		const schema = date()
		.notRequired()

		// @ts-expect-error To test if is valid
		expect(schema.isValid(undefined))
		.toBe(true)
		// @ts-expect-error To test if is valid
		expect(schema.isValid(null))
		.toBe(true)
	})
})
