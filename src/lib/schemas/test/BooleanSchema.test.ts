import { boolean, BooleanSchema } from '../BooleanSchema';

test('boolean', () => {
	const schema = boolean().optional().compile();

	// @ts-expect-error
	expect(schema.isValid(undefined)).toBeTruthy()
	expect(schema.isValid(true)).toBeTruthy()
	expect(schema.isValid(false)).toBeTruthy()

	const schema1 = new BooleanSchema().compile();

	expect(schema1.isValid(true)).toBeTruthy()
})
