import { type SchemaError } from 'src/lib/types';

import { boolean, BooleanSchema } from '../BooleanSchema';

describe('boolean', () => {
	it('should validate', () => {
		const schema = boolean()
		.optional()
		.compile();
	
		// @ts-expect-error // To check validation optional
		expect((schema.validate(undefined) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(true) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(false) as SchemaError[]).length === 0)
		.toBeTruthy();
	
		const schema1 = new BooleanSchema()
		.compile();
	
		expect((schema1.validate(true) as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('must be', () => {
		const schema = boolean()
		.mustBe(true)
		.compile();
	
		expect((schema.validate(true) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(false) as SchemaError[]).length === 0)
		.toBeFalsy();

		const schema1 = boolean()
		.mustBe(false)
		.compile();
	
		expect((schema1.validate(true) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema1.validate(false) as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should each schema be separated from previous', () => {
		const schema = boolean()
		.nullable();
		const schema1 = schema.optional();
	
		// @ts-expect-error // To check private values
		expect(schema.def._isNullable)
		.toBe(true);
		// @ts-expect-error // To check private values
		expect(schema.def._isOptional)
		.toBeUndefined();
		// @ts-expect-error // To check private values
		expect(schema1.def._isNullable)
		.toBe(true);
		// @ts-expect-error // To check private values
		expect(schema1.def._isOptional)
		.toBe(true);
	});
});
