import { any, AnySchema } from '../AnySchema';

test('any', () => {
	const schema = any().optional().compile();

	expect(schema.isValid(undefined)).toBeTruthy()
	expect(schema.isValid(true)).toBeTruthy()
	expect(schema.isValid(false)).toBeTruthy()

	const schema1 = new AnySchema().compile();

	expect(schema1.isValid(true)).toBeTruthy()
})
