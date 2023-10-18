import { any, AnySchema } from '../AnySchema';
import { object } from '../ObjectSchema';

describe('any', () => {
	test('should validate', () => {
		const schema = any()
		.optional()
		.compile();
	
		expect(schema.isValid(undefined))
		.toBeTruthy();
		expect(schema.isValid(true))
		.toBeTruthy();
		expect(schema.isValid(false))
		.toBeTruthy();
	
		const schema1 = new AnySchema()
		.compile();
	
		expect(schema1.isValid(true))
		.toBeTruthy();
	});

	it('should each schema be separated from previous', () => {
		const schema = any()
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

		expect(schema.isValid({
			productName: FieldTypeEnum.EXISTING_FIELD 
		}))
		.toBeTruthy();
		expect(schema.isValid({
			productName: 6 as FieldTypeEnum
		}))
		.toBeFalsy();
	});
});
