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
		expect(schema.isValid(undefined))
		.toBeTruthy()
		expect(schema.isValid({
			productId: 1,
			productName: 'Product Name'
		}))
		.toBeTruthy()
	
		const schema2 = new ObjectSchema({
			productId: number(),
			productName: string()
		})
		.compile();
	
		// @ts-expect-error // To be able to check
		expect(schema2.isValid(undefined))
		.toBeFalsy()
		expect(schema2.isValid({
			// @ts-expect-error // To be able to check
			productId: '1',
			productName: 'Product Name'
		}))
		.toBeFalsy()
		expect(schema2.isValid({
			productId: 1,
			// @ts-expect-error // To be able to check
			productName: 1
		}))
		.toBeFalsy()
		expect(schema2.isValid({
			productId: 1,
			productName: 'Product Name'
		}))
		.toBeTruthy()
	})

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
			schema.isValid({
				productId: 1,
				productName: 'Product Name'
			})
		)
		.toBeTruthy()

		let errors = schema.validate({
			productId: 1,
			productName: 'Product Name'
		})

		expect(
			schema.validate({
				productId: 1,
				productName: 'Product Name'
			})
		)
		.toEqual(errors)

		expect(
			schema.validate(
				{
					productId: 0,
					productName: 'Product Name'
				}, 
				['productId']
			)
		).not.toEqual(errors)

		errors = schema.validate(
			{
				productId: 0,
				productName: 'Product Name'
			}, 
			['productId']
		)

		expect(
			schema.validate(
				{
					productId: 1,
					productName: 'Product Name'
				}, 
				['productId']
			)
		)
		.toEqual(errors)

		expect(
			schema.validate(
				{
					productId: 1,
					productName: 'Product Name v2'
				}, 
				['productName']
			)
		)
		.toEqual(errors)

		expect(
			schema.validate(
				{
					productId: 3,
					productName: 'Product Name v2'
				}, 
				['productId']
			)
		).not.toEqual(errors)

		errors = schema.validate(
			{
				productId: 3,
				productName: 'Product Name v2'
			}, 
			['productId']
		)

		expect(
			schema.validate(
				{
					productId: 3,
					productName: 'Product Name v3'
				}, 
				['productName']
			)
		)
		.toEqual(errors)

		expect(
			schema.isValid({
				productId: 2,
				productName: 'Product Name'
			}, 
			['productId'])
		)
		.toBeTruthy()
	})

	it('should extend schema', () => {
		const schema = object({
			productId: number(),
			productName: string()
		})
		.optional()
		.compile();
	
		expect(schema.isValid({
			productId: 1,
			productName: 'Product Name'
		}))
		.toBeTruthy()

		const schema2 = schema.extend<{ 
			productId: number
			productName: string
			productCategory?: string 
		}>({
			productCategory: string()
			.required()
		})
		.compile();

		expect(schema.isValid({
			productId: 1,
			productName: 'Product Name'
		}))
		.toBeTruthy()

		expect(schema2.isValid({
			productId: 1,
			productName: 'Product Name'
		}))
		.toBeFalsy()

		expect(schema2.isValid({
			productId: 1,
			productName: 'Product Name',
			productCategory: 'Product Category'
		}))
		.toBeTruthy()
	})

	it('should each schema be separated from previous', () => {
		const productIdSchema = number();
		// @ts-expect-error // To check protected values
		expect(productIdSchema.def.normalRules.size)
		.toBe(0)

		const schema = object({
			productId: productIdSchema.required(),
			productName: string()
		})
		.nullable();
		const schema1 = schema.optional();

		// @ts-expect-error // To check private values
		expect(productIdSchema.def.normalRules.size)
		.toBe(0)

		// @ts-expect-error // To check private values
		expect(schema.isNullable)
		.toBe(true)

		// @ts-expect-error // To check private values
		expect(schema.isOptional)
		.toBe(false)

		// @ts-expect-error // To check private values
		expect(schema1.isNullable)
		.toBe(true)

		// @ts-expect-error // To check private values
		expect(schema1.isOptional)
		.toBe(true)
	})

	it('should date inside object be true', () => {
		const schema = object({
			productDate: date()
			.notRequired()
		})
		.compile();
		
		expect(schema.isValid({
		// @ts-expect-error To test if is valid
			productDate: 10
		}))
		.toBeFalsy()

		expect(schema.isValid({
			productDate: new Date()
		}))
		.toBeTruthy()
	
		expect(schema.isValid({
		// @ts-expect-error To test if is valid
			productDate: undefined
		}))
		.toBeTruthy()
	})

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

			expect(schema.isValid({ }))
			.toBeFalsy()

			expect(schema.isValid({
				productId: 1
			}))
			.toBeTruthy()

			expect(schema.isValid({
				productName: 'Test'
			}))
			.toBeTruthy()

			expect(schema.isValid({
				productType: 'Test'
			}))
			.toBeTruthy()

			expect(schema.isValid({
				productId: 1,
				productName: 'Test',
				productType: 'Test'
			}))
			.toBeTruthy()
		})
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

			expect(schema.isValid({ }))
			.toBeFalsy()

			expect(schema.isValid({
				productName: 'Test'
			}))
			.toBeTruthy()

			expect(schema.isValid({
				productType: 'Test'
			}))
			.toBeTruthy()

			expect(schema.isValid({
				productName: 'Test',
				productType: 'Test'
			}))
			.toBeTruthy()
		})

		it('multiple oneOf', () => {
			const productSchema = object<{
				productName?: string
				productType?: string
			}>({
				productName: string().notRequired(),
				productType: string().notRequired()
			})
			.oneOf(['productName', 'productType'], string().required())

			const schema = object({
				product1: productSchema,
				product2: productSchema
			})
			.compile();

			expect(schema.isValid({ 
				product1: {},
				product2: {}
			}))
			.toBeFalsy()

			expect(schema.isValid({
				product1: {
					productName: 'Test'
				},
				product2: {}
			}))
			.toBeFalsy()

			expect(schema.isValid({
				product1: { },
				product2: {
					productName: 'Test'
				}
			}))
			.toBeFalsy()

			expect(schema.isValid({
				product1: {
					productName: 'Test'
				},
				product2: {
					productName: 'Test'
				}
			}))
			.toBeTruthy()
		})

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
				])

				expect(schema.validate({
					productName: 'Test547896'
				}))
				.toEqual([])
			})

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
				])

				expect(schema.validate({
					productName: 'Test'
				}))
				.toEqual([])
			})

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
				])

				expect(schema.validate({
					productName: 'Test'
				}))
				.toEqual([])
			})
		})
	})
})
