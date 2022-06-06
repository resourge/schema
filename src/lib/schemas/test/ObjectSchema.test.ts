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
			productId: number().min(10).onlyOnTouch((schema) => 
				schema.min(1)
			),
			productName: string()
		})
		
		.compile({
			debug: true
		});

		expect(
			schema.isValid({
				productId: 1,
				productName: 'Product Name'
			})
		).toBeFalsy()
		expect(
			schema.isValid({
				productId: 1,
				productName: 'Product Name'
			}, 
			['productId'])
		).toBeTruthy()
	})
})
