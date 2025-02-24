import { describe, it, expect } from 'vitest';

import { number, object } from '../..';
import { type SchemaError } from '../../types/types';

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
	
		const validate = (value: any) => (schema.validate(value) as SchemaError[]).length === 0;
		
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

		expect((namedWhenSchema.validate({
			productId: 1,
			// @ts-expect-error // To force validation
			productTypeId: undefined
		}) as SchemaError[]).length === 0)
		.toBeTruthy();

		expect((namedWhenSchema.validate({
			productId: 1,
			productTypeId: 1
		}) as SchemaError[]).length === 0)
		.toBeTruthy();

		expect((namedWhenSchema.validate({
			productId: 10,
			// @ts-expect-error // To force validation
			productTypeId: undefined
		}) as SchemaError[]).length === 0)
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

		const validate = async (value: any) => (await schema.validate(value)).length === 0;
	
		await expect(validate(-9)).resolves.toBeTruthy();

		await expect(validate(null)).resolves.toBeFalsy();

		await expect(validate(11)).resolves.toBeTruthy();
		await expect(validate(undefined)).resolves.toBeFalsy();
	});

	it('mandatoryRules', () => {
		const schema = number()
		.compile();
	
		// @ts-expect-error // To check private values
		expect(schema.def.isNullable)
		.toBeFalsy();
		// @ts-expect-error // To check private values
		expect(schema.def.isOnlyOnTouch)
		.toBeFalsy();
		// @ts-expect-error // To check private values
		expect(schema.def.isOptional)
		.toBeFalsy();
		// @ts-expect-error // To check private values
		expect(schema.def.isRequired)
		.toBeFalsy();

		const newSchema = schema.nullable();
		// @ts-expect-error // To check private values
		expect(newSchema.def.isNullable)
		.toBeTruthy();

		const newSchema1 = schema.onlyOnTouch();
		// @ts-expect-error // To check private values
		expect(newSchema1.def.isOnlyOnTouch)
		.toBeTruthy();

		const newSchema2 = schema.optional();
		// @ts-expect-error // To check private values
		expect(newSchema2.def.isOptional)
		.toBeTruthy();

		const newSchema3 = schema.required();
		// @ts-expect-error // To check private values
		expect(newSchema3.def.isRequired)
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

		expect((schema.validate(0) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate(1) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate(2) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate(11) as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should individual validation only on touch', () => {
		const schema = number()
		.min(1)
		.onlyOnTouch((schema) => schema.max(10))
		.compile();

		expect((schema.validate(0) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate(1) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(11) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(11, ['']) as SchemaError[]).length === 0)
		.toBeFalsy();
	});
});
