import { type SchemaError } from '../../types/types';
import { any, AnySchema } from '../AnySchema';
import { object } from '../ObjectSchema'; 

describe('any', () => {
	test('should validate', () => {
		const schema = any()
		.optional()
		.compile();
	
		expect((schema.validate(undefined) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(true) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(false) as SchemaError[]).length === 0)
		.toBeTruthy();
	
		const schema1 = new AnySchema()
		.compile();
	
		expect((schema1.validate(true) as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should each schema be separated from previous', () => {
		const schema = any()
		.nullable();
		const schema1 = schema.optional();
	
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

	it('should test enum types', () => {
		enum FieldTypeEnum {
			FREE_TEXT = 1,
			EXISTING_FIELD = 2,
			SQL_EXPRESSION = 3,
			SOURCE_FIELD = '4'
		}

		const schema = object<{ productName: FieldTypeEnum }>({
			productName: any()
			.nullable()
			.enum(FieldTypeEnum)
		})
		.compile();

		expect((schema.validate({
			productName: FieldTypeEnum.EXISTING_FIELD 
		}) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate({
			productName: 6 as FieldTypeEnum
		}) as SchemaError[]).length === 0)
		.toBeFalsy();
	});
});
