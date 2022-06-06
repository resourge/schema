import { number } from 'src/lib/schemas'

describe('Schema', () => {
	it('when', () => {
		const schema = number()
		.optional()
		.when({
			is: (value) => value < 10 || value === null,
			then: (schema) => schema.negative().required()
		})
		.compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(-9)).toBeTruthy()
		expect(validate(null)).toBeFalsy()

		expect(validate(11)).toBeTruthy()
		expect(validate(undefined)).toBeTruthy()
	})

	it('async', async () => {
		const schema = number()
		.asyncTest({
			test: () => Promise.resolve(true),
			message: 'Async message',
			name: 'Async test2'
		})
		.asyncTest({
			test: () => Promise.resolve(true),
			message: 'Async message'
		})
		.compile();

		const validate = async (value: any) => await schema.isValid(value);
	
		await expect(validate(-9)).resolves.toBeTruthy()

		await expect(validate(null)).resolves.toBeFalsy()

		await expect(validate(11)).resolves.toBeTruthy()
		await expect(validate(undefined)).resolves.toBeFalsy()
	})

	it('mandatoryRules', () => {
		const schema = number()
		.compile();
	
		expect(schema.isNullable).toBeFalsy()
		expect(schema.isOnlyOnTouch).toBeFalsy()
		expect(schema.isOptional).toBeFalsy()
		expect(schema.isRequired).toBeFalsy()

		schema.nullable();
		expect(schema.isNullable).toBeTruthy()

		schema.onlyOnTouch();
		expect(schema.isOnlyOnTouch).toBeTruthy()

		schema.optional();
		expect(schema.isOptional).toBeTruthy();

		schema.required();
		expect(schema.isRequired).toBeTruthy();

		schema.test({
			test: () => true,
			message: 'Custom Text Message'
		})
		.test(() => [{
			path: '',
			error: 'Custom Text Message'
		}])
		.asyncTest({
			test: () => Promise.resolve(true),
			message: 'Async message'
		})
		.asyncTest(() => Promise.resolve([{
			path: '',
			error: 'Custom Text Message'
		}]))
		.compile();
	})

	it('should individual validation only on touch', () => {
		const schema = number().min(1)
		.onlyOnTouch((schema) => schema.max(10))
		.compile();

		expect(schema.isValid(0)).toBeFalsy()
		expect(schema.isValid(1)).toBeTruthy()
		expect(schema.isValid(11)).toBeTruthy()
		expect(schema.isValid(11, [''])).toBeFalsy()
	})

	it('should individual validation only on touch', () => {
		const a = number().min(1);

		const schema = a
		.compile();

		const schema2 = a.max(9)
		.compile();

		expect(schema.isValid(0)).toBeFalsy()
		expect(schema.isValid(10)).toBeTruthy()
		expect(schema2.isValid(0)).toBeFalsy()
		expect(schema2.isValid(5)).toBeTruthy()
		expect(schema2.isValid(10)).toBeFalsy()
	})
})
