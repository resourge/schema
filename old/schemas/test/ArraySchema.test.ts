import { describe, expect, it } from 'vitest';

import { type SchemaError } from '../../types/types';
import { array, ArraySchema } from '../ArraySchema';
import { number } from '../NumberSchema';
import { object } from '../ObjectSchema';
import { string } from '../StringSchema'; 

describe('array', () => {
	it('should be empty', () => {
		const schema = array(number())
		.empty()
		.compile();

		expect((schema.validate([]) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate([1]) as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be length', () => {
		const schema = array(number())
		.length(2)
		.compile();

		expect((schema.validate([]) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate([1]) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate([1, 2]) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate([1, 2, 3]) as SchemaError[]).length === 0)
		.toBeFalsy();

		expect((array(number())
		.length(1)
		.validate([1, 2, 3]) as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be max', () => {
		const schema = new ArraySchema(number())
		.max(2)
		.compile();

		expect((schema.validate([]) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate([1]) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate([1, 2]) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate([1, 2, 3]) as SchemaError[]).length === 0)
		.toBeFalsy();

		expect((array(number())
		.max(1)
		.validate([1, 2, 3]) as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be min', () => {
		const schema = array(number())
		.min(2)
		.compile();

		expect((schema.validate([]) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate([1]) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate([1, 2]) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate([1, 2, 3]) as SchemaError[]).length === 0)
		.toBeTruthy();

		expect((array(number())
		.min(1)
		.validate([1, 2, 3]) as SchemaError[]).length === 0)
		.toBeTruthy();
	});
	
	describe('unique', () => {
		it('should be unique number', () => {
			const schemaNumber = array(number())
			.unique()
			.compile();
	
			expect((schemaNumber.validate([]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaNumber.validate([1, 2]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaNumber.validate([2, 2]) as SchemaError[]).length === 0)
			.toBeFalsy();
	
			const schemaObject = array(
				object({
					product: number(),
					productName: string()
				})
			)
			.unique()
			.compile();
	
			expect((schemaObject.validate([]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaObject.validate([
				{
					product: 1,
					productName: 'Name'
				}
			]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaObject.validate([
				{
					product: 1,
					productName: 'Name'
				},
				{
					product: 2,
					productName: 'Name'
				}
			]) as SchemaError[]).length === 0)
			.toBeTruthy();
	
			expect(
				(schemaObject.validate([
					{
						product: 1,
						productName: 'Name'
					},
					{
						product: 1,
						productName: 'Name'
					}
				]) as SchemaError[]).length === 0)
			.toBeTruthy();
		});

		it('should be unique 2 types', () => {
			const schemaNumber = array<Array<1 | 2>>(
				number()
				.equals([1, 2])
			)
			.compile();
	
			expect((schemaNumber.validate([]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaNumber.validate([1]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaNumber.validate([2, 4]) as SchemaError[]).length === 0)
			.toBeFalsy();
		});
	});

	describe('should be uniqueby', () => {
		it('key', () => {
			const schemaObject = array(
				object({
					product: number(),
					productName: string()
				})
			)
			.uniqueBy('product')
			.compile();
	
			expect((schemaObject.validate([]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaObject.validate([
				{
					product: 1,
					productName: 'Name'
				}
			]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaObject.validate([
				{
					product: 1,
					productName: 'Name'
				},
				{
					product: 2,
					productName: 'Name'
				}
			]) as SchemaError[]).length === 0)
			.toBeTruthy();
	
			expect(
				(schemaObject.validate([
					{
						product: 1,
						productName: 'Name'
					},
					{
						product: 1,
						productName: 'Name'
					}
				]) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('value', () => {
			const schemaObject = array(
				object({
					product: number(),
					productName: string()
				})
			)
			.uniqueBy((value) => value.productName)
			.compile();
	
			expect((schemaObject.validate([]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaObject.validate([
				{
					product: 1,
					productName: 'Name'
				}
			]) as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schemaObject.validate([
				{
					product: 1,
					productName: 'Name'
				},
				{
					product: 2,
					productName: 'Name'
				}
			]) as SchemaError[]).length === 0)
			.toBeFalsy();
	
			expect(
				(schemaObject.validate([
					{
						product: 1,
						productName: 'Name'
					},
					{
						product: 1,
						productName: 'Name'
					}
				]) as SchemaError[]).length === 0)
			.toBeFalsy();
		});
	});

	it('should each schema be separated from previous', () => {
		const schema = array(number())
		.nullable()
		.min(1);
		const schema1 = schema.optional()
		.max(10);
	
		// @ts-expect-error // To check protected values
		expect(schema.def.isNullable)
		.toBe(true);
		// @ts-expect-error // To check protected values
		expect(schema.def.isOptional)
		.toBeUndefined();
		// @ts-expect-error // To check protected values
		expect(schema1.def.isNullable)
		.toBe(true);
		// @ts-expect-error // To check protected values
		expect(schema1.def.isOptional)
		.toBe(true);

		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size)
		.toBe(1);
		// @ts-expect-error // To check protected values
		expect(schema1.def.normalRules.size)
		.toBe(2);
		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size).not.toBe(schema1.def.normalRules.size);
	});
});
