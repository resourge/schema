import { boolean, BooleanSchema } from '../BooleanSchema';

describe('boolean', () => {
	it('should validate', () => {
		const schema = boolean()
		.optional()
		.compile();
	
		// @ts-expect-error // To check validation optional
		expect(schema.isValid(undefined))
		.toBeTruthy();
		expect(schema.isValid(true))
		.toBeTruthy();
		expect(schema.isValid(false))
		.toBeTruthy();
	
		const schema1 = new BooleanSchema()
		.compile();
	
		expect(schema1.isValid(true))
		.toBeTruthy();
	});

	it('must be', () => {
		const schema = boolean()
		.mustBe(true)
		.compile();
	
		expect(schema.isValid(true))
		.toBeTruthy();
		expect(schema.isValid(false))
		.toBeFalsy();

		const schema1 = boolean()
		.mustBe(false)
		.compile();
	
		expect(schema1.isValid(true))
		.toBeFalsy();
		expect(schema1.isValid(false))
		.toBeTruthy();
	});

	it('should each schema be separated from previous', () => {
		const schema = boolean()
		.nullable();
		const schema1 = schema.optional();
	
		// @ts-expect-error // To check private values
		expect(schema.isNullable)
		.toBe(true);
		// @ts-expect-error // To check private values
		expect(schema.isOptional)
		.toBe(false);
		// @ts-expect-error // To check private values
		expect(schema1.isNullable)
		.toBe(true);
		// @ts-expect-error // To check private values
		expect(schema1.isOptional)
		.toBe(true);
	});
});
