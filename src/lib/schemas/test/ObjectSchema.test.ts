import { number } from '../NumberSchema';
import { object, ObjectSchema } from '../ObjectSchema';
import { string } from '../StringSchema';

describe('object', () => {
	it('should test object', () => {
		const schema = object({
			productId: number(),
			productName: string()
		}).optional().compile();
	
		// @ts-expect-error
		expect(schema.isValid(undefined)).toBeTruthy()
		expect(schema.isValid({
			productId: 1,
			productName: 'Product Name'
		})).toBeTruthy()
	
		const schema2 = new ObjectSchema({
			productId: number(),
			productName: string()
		}).compile();
	
		// @ts-expect-error
		expect(schema2.isValid(undefined)).toBeFalsy()
		expect(schema2.isValid({
			// @ts-expect-error
			productId: '1',
			productName: 'Product Name'
		})).toBeFalsy()
		expect(schema2.isValid({
			productId: 1,
			// @ts-expect-error
			productName: 1
		})).toBeFalsy()
		expect(schema2.isValid({
			productId: 1,
			productName: 'Product Name'
		})).toBeTruthy()
	})

	it('should individual validation only on touch', () => {
		const schema = object({
			productId: number().onlyOnTouch((schema) => 
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
		).toBeTruthy()

		expect(
			schema.isValid({
				productId: 2,
				productName: 'Product Name'
			}, 
			['productId'])
		).toBeTruthy()
	})

	it('should extend schema', () => {
		const schema = object({
			productId: number(),
			productName: string()
		}).optional().compile();
	
		expect(schema.isValid({
			productId: 1,
			productName: 'Product Name'
		})).toBeTruthy()

		const schema2 = schema.extend<{ 
			productId: number
			productName: string
			productCategory?: string 
		}>({
			productCategory: string().required()
		}).compile();

		expect(schema.isValid({
			productId: 1,
			productName: 'Product Name'
		})).toBeTruthy()

		expect(schema2.isValid({
			productId: 1,
			productName: 'Product Name'
		})).toBeFalsy()

		expect(schema2.isValid({
			productId: 1,
			productName: 'Product Name',
			productCategory: 'Product Category'
		})).toBeTruthy()
	})

	it('should each schema be separated from previous', () => {
		const productIdSchema = number();
		// @ts-expect-error
		expect(productIdSchema.def.normalRules.size).toBe(0)

		const schema = object({
			productId: productIdSchema.required(),
			productName: string()
		}).nullable();
		const schema1 = schema.optional();

		// @ts-expect-error
		expect(productIdSchema.def.normalRules.size).toBe(0)
	
		expect(schema.isNullable).toBe(true)
		expect(schema.isOptional).toBe(false)
		expect(schema1.isNullable).toBe(true)
		expect(schema1.isOptional).toBe(true)
	})
})
