import { describe, expect, it } from 'vitest';

import { type SchemaError } from '../../types/types';
import { date } from '../DateSchema';
import { number } from '../NumberSchema';
import { object, ObjectSchema } from '../ObjectSchema';
import { string } from '../StringSchema';

describe('object', () => {
	it('should test object', () => {
		const schema = object({
			productId: number(),
			productName: string()
		})
		.optional()
		.compile();
	
		// @ts-expect-error // To be able to check
		expect((schema.validate(undefined) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate({
			productId: 1,
			productName: 'Product Name'
		}) as SchemaError[]).length === 0)
		.toBeTruthy();
	
		const schema2 = new ObjectSchema({
			productId: number(),
			productName: string()
		})
		.compile();
	
		// @ts-expect-error // To be able to check
		expect((schema2.validate(undefined) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema2.validate({
			// @ts-expect-error // To be able to check
			productId: '1',
			productName: 'Product Name'
		}) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema2.validate({
			productId: 1,
			// @ts-expect-error // To be able to check
			productName: 1
		}) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema2.validate({
			productId: 1,
			productName: 'Product Name'
		}) as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should test object when', () => {
		const schema = object<{ productId: number
			productName?: string }>({
			productId: number().required(),
			productName: string()
			.notRequired()
			.when('productId', {
				is: (productId) => productId === 10,
				then: (schema) => schema.required()
			})
		})
		.compile();

		expect(
			(schema.validate({
				productId: 1
			}) as SchemaError[]).length === 0
		)
		.toBeTruthy();

		expect(
			(schema.validate({
				productId: 10
			}) as SchemaError[]).length === 0
		)
		.toBeFalsy();

		expect(
			(schema.validate({
				productId: 10,
				productName: 'Name '
			}) as SchemaError[]).length === 0
		)
		.toBeTruthy();
	});

	it('should individual validation only on touch', () => {
		const schema = object({
			productId: number()
			.onlyOnTouch((schema) => 
				schema.min(2)
			),
			productName: string()
		})
		.compile();
		
		expect(
			(schema.validate({
				productId: 1,
				productName: 'Product Name'
			}) as SchemaError[]).length === 0
		)
		.toBeTruthy();

		let errors = schema.validate({
			productId: 1,
			productName: 'Product Name'
		});

		expect(
			schema.validate({
				productId: 1,
				productName: 'Product Name'
			})
		)
		.toEqual(errors);

		expect(
			schema.validate(
				{
					productId: 0,
					productName: 'Product Name'
				}, 
				['productId']
			)
		).not.toEqual(errors);

		errors = schema.validate(
			{
				productId: 0,
				productName: 'Product Name'
			}, 
			['productId']
		);

		expect(
			schema.validate(
				{
					productId: 1,
					productName: 'Product Name'
				}, 
				['productId']
			)
		)
		.toEqual(errors);

		expect(
			schema.validate(
				{
					productId: 1,
					productName: 'Product Name v2'
				}, 
				['productName']
			)
		)
		.toEqual(errors);

		expect(
			schema.validate(
				{
					productId: 3,
					productName: 'Product Name v2'
				}, 
				['productId']
			)
		).not.toEqual(errors);

		errors = schema.validate(
			{
				productId: 3,
				productName: 'Product Name v2'
			}, 
			['productId']
		);

		expect(
			schema.validate(
				{
					productId: 3,
					productName: 'Product Name v3'
				}, 
				['productName']
			)
		)
		.toEqual(errors);

		expect(
			(schema.validate({
				productId: 2,
				productName: 'Product Name'
			}, 
			['productId']
			) as SchemaError[]).length === 0
		)
		.toBeTruthy();
	});

	it('should extend schema', () => {
		const schema = object({
			productId: number().optional(),
			productName: string().optional()
		})
		.optional()
		.compile();
	
		expect((
			schema.validate({
				productId: 1,
				productName: 'Product Name'
			}) as SchemaError[]
		).length === 0)
		.toBeTruthy();

		const schema2 = schema.extend<{ 
			productId: number
			productName: string
			productCategory?: string 
		}>({
			productId: number()
			.required(),
			productCategory: string()
			.required()
		})
		.compile();

		expect((schema.validate({
			productId: 1,
			productName: 'Product Name'
		}) as SchemaError[]
		).length === 0)
		.toBeTruthy();

		expect((schema2.validate({
			productId: 1,
			productName: 'Product Name'
		}) as SchemaError[]
		).length === 0)
		.toBeFalsy();

		expect((schema2.validate({
			productId: 1,
			productName: 'Product Name',
			productCategory: 'Product Category'
		}) as SchemaError[]
		).length === 0)
		.toBeTruthy();
	});

	it('should each schema be separated from previous', () => {
		const productIdSchema = number();
		// @ts-expect-error // To check protected values
		expect(productIdSchema.def.normalRules.size)
		.toBe(0);

		const schema = object({
			productId: productIdSchema.required(),
			productName: string()
		})
		.nullable();
		const schema1 = schema.optional();

		// @ts-expect-error // To check private values
		expect(productIdSchema.def.normalRules.size)
		.toBe(0);

		// @ts-expect-error // To check private values
		expect(schema.def.isNullable)
		.toBe(true);

		// @ts-expect-error // To check private values
		expect(schema.def.isOptional)
		.toBeUndefined();

		// @ts-expect-error // To check private values
		expect(schema1.def.isNullable)
		.toBe(true);

		// @ts-expect-error // To check private values
		expect(schema1.def.isOptional)
		.toBe(true);
	});

	it('should date inside object be true', () => {
		const schema = object({
			productDate: date()
			.notRequired()
		})
		.compile();
		
		expect((schema.validate({
		// @ts-expect-error To test if is valid
			productDate: 10
		}) as SchemaError[]
		).length === 0)
		.toBeFalsy();

		expect((schema.validate({
			productDate: new Date()
		}) as SchemaError[]
		).length === 0)
		.toBeTruthy();
	
		expect((schema.validate({
		// @ts-expect-error To test if is valid
			productDate: undefined
		}) as SchemaError[]
		).length === 0)
		.toBeTruthy();
	});

	describe('should have one of the keys true', () => {
		it('diferent schemas', () => {
			const schema = object<{
				productId?: number
				productName?: string
				productType?: string
			}>({
				productId: number().notRequired(),
				productName: string().notRequired(),
				productType: string().notRequired()
			})
			.oneOf({
				productId: number().required(),
				productName: string().required(),
				productType: string().required()
			})
			.compile();

			expect((schema.validate({ }) as SchemaError[]).length === 0)
			.toBeFalsy();

			expect((schema.validate({
				productId: 1
			}) as SchemaError[]
			).length === 0)
			.toBeTruthy();

			expect((schema.validate({
				productName: 'Test'
			}) as SchemaError[]
			).length === 0)
			.toBeTruthy();

			expect((schema.validate({
				productType: 'Test'
			}) as SchemaError[]).length === 0)
			.toBeTruthy();

			expect((schema.validate({
				productId: 1,
				productName: 'Test',
				productType: 'Test'
			}) as SchemaError[]).length === 0)
			.toBeTruthy();
		});
		it('same schema', () => {
			const schema = object<{
				productName?: string
				productType?: string
			}>({
				productName: string().notRequired(),
				productType: string().notRequired()
			})
			.oneOf(['productName', 'productType'], string().required())
			.compile();

			expect((schema.validate({ }) as SchemaError[]).length === 0)
			.toBeFalsy();

			expect((schema.validate({
				productName: 'Test'
			}) as SchemaError[]).length === 0)
			.toBeTruthy();

			expect((schema.validate({
				productType: 'Test'
			}) as SchemaError[]).length === 0)
			.toBeTruthy();

			expect((schema.validate({
				productName: 'Test',
				productType: 'Test'
			}) as SchemaError[]).length === 0)
			.toBeTruthy();
		});

		it('multiple oneOf', () => {
			const productSchema = object<{
				productName?: string
				productType?: string
			}>({
				productName: string().notRequired(),
				productType: string().notRequired()
			})
			.oneOf(['productName', 'productType'], string().required());

			const schema = object({
				product1: productSchema,
				product2: productSchema
			})
			.compile();

			expect((schema.validate({ 
				product1: {},
				product2: {}
			}) as SchemaError[]).length === 0)
			.toBeFalsy();

			expect((schema.validate({
				product1: {
					productName: 'Test'
				},
				product2: {}
			}) as SchemaError[]).length === 0)
			.toBeFalsy();

			expect((schema.validate({
				product1: { },
				product2: {
					productName: 'Test'
				}
			}) as SchemaError[]).length === 0)
			.toBeFalsy();

			expect((schema.validate({
				product1: {
					productName: 'Test'
				},
				product2: {
					productName: 'Test'
				}
			}) as SchemaError[]).length === 0)
			.toBeTruthy();
		});

		describe('should have a custom message', () => {
			it('should all errors have the same custom message', () => {
				const customMessage = 'Custom Message';
				const schema = object<{
					productName?: string
					productType?: string
				}>({
					productName: string().notRequired(),
					productType: string().notRequired()
				})
				.oneOf({
					productName: string().required(),
					productType: string().required()
				}, customMessage)
				.compile();

				expect(schema.validate({}))
				.toEqual([
					{
						path: 'productName',
						error: customMessage
					},
					{
						path: 'productType',
						error: customMessage
					}
				]);

				expect(schema.validate({
					productName: 'Test547896'
				}))
				.toEqual([]);
			});

			it('should have one custom error', () => {
				const customMessage = 'Custom Message';
				const schema = object<{
					productName?: string
					productType?: string
				}>({
					productName: string().notRequired(),
					productType: string().notRequired()
				})
				.oneOf({
					productName: string().required(),
					productType: string().required()
				}, {
					path: 'productName',
					error: customMessage
				})
				.compile();

				expect(schema.validate({}))
				.toEqual([
					{
						path: 'productName',
						error: customMessage
					}
				]);

				expect(schema.validate({
					productName: 'Test'
				}))
				.toEqual([]);

				expect(schema.validate({
					productType: 'Test'
				}))
				.toEqual([]);
			});

			it('should have multiple custom error', () => {
				const customMessage = 'Custom Message';
				const schema = object<{
					productId?: number
					productName?: string
					productType?: string
				}>({
					productId: number().notRequired(),
					productName: string().notRequired(),
					productType: string().notRequired()
				})
				.oneOf({
					productName: string().required(),
					productType: string().required()
				}, [
					{
						path: 'productId',
						error: customMessage
					},
					{
						path: 'productName',
						error: customMessage
					},
					{
						path: 'productType',
						error: customMessage
					}
				])
				.compile();

				expect(schema.validate({}))
				.toEqual([
					{
						path: 'productId',
						error: customMessage
					},
					{
						path: 'productName',
						error: customMessage
					},
					{
						path: 'productType',
						error: customMessage
					}
				]);

				expect(schema.validate({
					productName: 'Test'
				}))
				.toEqual([]);
			});
		});
	});
});
