/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { number, object } from 'src/lib/schemas';

describe('Schema', () => {
	it('when', () => {
		const schema = number()
		.optional()
		.when({
			is: (value) => value < 10 || value === null,
			then: (schema) => schema.negative()
			.required()
		})
		.compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(-9))
		.toBeTruthy();
		expect(validate(null))
		.toBeFalsy();

		expect(validate(11))
		.toBeTruthy();
		expect(validate(undefined))
		.toBeTruthy();

		const namedWhenSchema = object({
			productId: number(),
			productTypeId: number()
			.optional()
			.when('productId', {
				is: (value) => value === 10,
				then: (schema) => schema.required()
			})
		})
		.compile();

		expect(namedWhenSchema.isValid({
			productId: 1,
			// @ts-expect-error // To force validation
			productTypeId: undefined
		}))
		.toBeTruthy();

		expect(namedWhenSchema.isValid({
			productId: 1,
			productTypeId: 1
		}))
		.toBeTruthy();

		expect(namedWhenSchema.isValid({
			productId: 10,
			// @ts-expect-error // To force validation
			productTypeId: undefined
		}))
		.toBeFalsy();
	});

	it('async', async () => {
		const schema = number()
		.asyncTest({
			is: () => Promise.resolve(false),
			message: 'Async message',
			name: 'Async test2'
		})
		.asyncTest({
			is: () => Promise.resolve(false),
			message: 'Async message'
		})
		.compile();

		const validate = async (value: any) => await schema.isValid(value);
	
		await expect(validate(-9)).resolves.toBeTruthy();

		await expect(validate(null)).resolves.toBeFalsy();

		await expect(validate(11)).resolves.toBeTruthy();
		await expect(validate(undefined)).resolves.toBeFalsy();
	});

	it('mandatoryRules', () => {
		const schema = number()
		.compile();
	
		// @ts-expect-error // To check private values
		expect(schema.isNullable)
		.toBeFalsy();
		// @ts-expect-error // To check private values
		expect(schema.isOnlyOnTouch)
		.toBeFalsy();
		// @ts-expect-error // To check private values
		expect(schema.isOptional)
		.toBeFalsy();
		// @ts-expect-error // To check private values
		expect(schema.isRequired)
		.toBeFalsy();

		const newSchema = schema.nullable();
		// @ts-expect-error // To check private values
		expect(newSchema.isNullable)
		.toBeTruthy();

		const newSchema1 = schema.onlyOnTouch();
		// @ts-expect-error // To check private values
		expect(newSchema1.isOnlyOnTouch)
		.toBeTruthy();

		const newSchema2 = schema.optional();
		// @ts-expect-error // To check private values
		expect(newSchema2.isOptional)
		.toBeTruthy();

		const newSchema3 = schema.required();
		// @ts-expect-error // To check private values
		expect(newSchema3.isRequired)
		.toBeTruthy();

		schema.test({
			is: () => true,
			message: 'Custom Text Message'
		})
		.test(() => [{
			path: '',
			error: 'Custom Text Message'
		}])
		.asyncTest({
			is: () => Promise.resolve(true),
			message: 'Async message'
		})
		.asyncTest(() => Promise.resolve([{
			path: '',
			error: 'Custom Text Message'
		}]))
		.compile();
	});

	it('multiple test\'s', () => {
		const schema = number()
		.test((value) => {
			if ( value > 2 ) {
				return [
					{
						path: '',
						error: 'Value is not bigger than 2'
					}
				];
			}
			return [];
		})
		.test((value) => {
			if ( value < 10 ) {
				return [
					{
						path: '',
						error: 'Value is not smaller than 10'
					}
				];
			}
			return [];
		})
		.compile();

		expect(schema.isValid(0))
		.toBeFalsy();
		expect(schema.isValid(1))
		.toBeFalsy();
		expect(schema.isValid(2))
		.toBeFalsy();
		expect(schema.isValid(11))
		.toBeFalsy();
	});

	it('should individual validation only on touch', () => {
		const schema = number()
		.min(1)
		.onlyOnTouch((schema) => schema.max(10))
		.compile();

		expect(schema.isValid(0))
		.toBeFalsy();
		expect(schema.isValid(1))
		.toBeTruthy();
		expect(schema.isValid(11))
		.toBeTruthy();
		expect(schema.isValid(11, ['']))
		.toBeFalsy();
	});
});
