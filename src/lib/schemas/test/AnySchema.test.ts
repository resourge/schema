import { any, AnySchema } from '../AnySchema';

describe('any', () => {
	test('should validate', () => {
		const schema = any().optional().compile();
	
		expect(schema.isValid(undefined)).toBeTruthy()
		expect(schema.isValid(true)).toBeTruthy()
		expect(schema.isValid(false)).toBeTruthy()
	
		const schema1 = new AnySchema().compile();
	
		expect(schema1.isValid(true)).toBeTruthy()
	})

	it('should each schema be separated from previous', () => {
		const schema = any().nullable();
		const schema1 = schema.optional();
	
		expect(schema.isNullable).toBe(true)
		expect(schema.isOptional).toBe(false)
		expect(schema1.isNullable).toBe(true)
		expect(schema1.isOptional).toBe(true)
	})
})
