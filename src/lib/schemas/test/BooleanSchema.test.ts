import { boolean, BooleanSchema } from '../BooleanSchema';

describe('boolean', () => {
	it('should validate', () => {
		const schema = boolean().optional().compile();
	
		// @ts-expect-error
		expect(schema.isValid(undefined)).toBeTruthy()
		expect(schema.isValid(true)).toBeTruthy()
		expect(schema.isValid(false)).toBeTruthy()
	
		const schema1 = new BooleanSchema().compile();
	
		expect(schema1.isValid(true)).toBeTruthy()
	})

	it('should each schema be separated from previous', () => {
		const schema = boolean().nullable();
		const schema1 = schema.optional()
	
		expect(schema.isNullable).toBe(true)
		expect(schema.isOptional).toBe(false)
		expect(schema1.isNullable).toBe(true)
		expect(schema1.isOptional).toBe(true)
	})
})
