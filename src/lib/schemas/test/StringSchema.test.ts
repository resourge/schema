import PostalCodes from '../../postalCodes';
import { type SchemaError } from '../../types';
import { number } from '../NumberSchema';
import { object } from '../ObjectSchema';
import { string, StringSchema } from '../StringSchema';

describe('string', () => {
	it('should be between', () => {
		const schema = new StringSchema()
		.between(2, 3)
		.compile();

		expect((schema.validate('11') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('_a') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('aaa3') as SchemaError[]).length === 0)
		.toBeFalsy();
	});
	it('should be empty email', () => {
		const schema = new StringSchema()
		.notRequired()
		.email('precise')
		.compile();

		// @ts-expect-error // To force validation to be true
		expect((schema.validate(null) as SchemaError[]).length === 0)
		.toBeTruthy();
		// @ts-expect-error // To force validation to be true
		expect((schema.validate(undefined) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('') as SchemaError[]).length === 0)
		.toBeTruthy();
	});
	
	it('should be required', () => {
		const schema = string()
		.required()
		.compile();

		// @ts-expect-error // To force validation to be false
		expect((schema.validate(null) as SchemaError[]).length === 0)
		.toBeFalsy();
		// @ts-expect-error // To force validation to be false
		expect((schema.validate(undefined) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('a') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be equals', () => {
		const schema = string()
		.equals('Name')
		.compile();

		expect((schema.validate('Name') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('_Name') as SchemaError[]).length === 0)
		.toBeFalsy();

		const schema1 = string()
		.equals(['Name', 'Age'])
		.compile();

		expect((schema1.validate('Name') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema1.validate('Age') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema1.validate('aaa3') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be alpha', () => {
		const schema = string()
		.alpha()
		.compile();

		expect((schema.validate('11') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('_a') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be alphadash', () => {
		const schema = string()
		.alphadash()
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('11') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('aaa11') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('a__--aa11') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be alphanum', () => {
		const schema = string()
		.alphanum()
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('11') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('aaa11') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('a__--aa11') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be base64', () => {
		const schema = string()
		.base64()
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should contain', () => {
		const schema = string()
		.contains('product')
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('aproductaa') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('aaaproduct') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('productaaaproduct') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be cuid', () => {
		const schema = string()
		.cuid()
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('cjld2cjxh0000qzrmn831i7rn') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	describe('should be email', () => {
		it('and basic', () => {
			const schema = string()
			.email('basic')
			.compile();
	
			expect((schema.validate('//') as SchemaError[]).length === 0)
			.toBeFalsy();
			expect((schema.validate('a{@a.a') as SchemaError[]).length === 0)
			.toBeTruthy();
			expect((schema.validate('a@a.a') as SchemaError[]).length === 0)
			.toBeTruthy();
		});
		it('and precise', () => {
			const schema = string()
			.email('precise')
			.compile();
	
			expect((schema.validate('//') as SchemaError[]).length === 0)
			.toBeFalsy();
			expect((schema.validate('a@a.a') as SchemaError[]).length === 0)
			.toBeFalsy();
			expect((schema.validate('a@a.pt') as SchemaError[]).length === 0)
			.toBeTruthy();
		});
	});

	it('should be empty', () => {
		const schema = string()
		.empty()
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(' ') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be hex', () => {
		const schema = string()
		.hex()
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('666FFF') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('FFFFFF') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('Q66FFF') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be length', () => {
		const schema = string()
		.length(2)
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be max', () => {
		const schema = string()
		.max(2)
		.compile();

		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be min', () => {
		const schema = string()
		.min(2)
		.compile();

		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be numeric', () => {
		const schema = string()
		.numeric()
		.compile();

		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('001') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should be pattern', () => {
		const schema = string()
		.pattern(/\D/)
		.compile();
	
		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('001') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('//') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('aaa') as SchemaError[]).length === 0)
		.toBeTruthy();
	});
	
	it('should be url', () => {
		const schema = string()
		.url()
		.compile();

		expect((schema.validate('aaaa') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('/index.html') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('https://google') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('https://.pt') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('www.google.pt') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('http://www.google.pt') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('https://www.google.pt') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('https://google.pt') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be uuid', () => {
		const schema = string()
		.uuid()
		.compile();

		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('000000') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('00000000-0000-0000-0000-000000000000') as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate('123e4567-e89b-12d3-a456-426614174000') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should be postal code', () => {
		const schema = string()
		.postalCode(PostalCodes.PT)
		.compile();

		expect((schema.validate('0') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('001') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('4999333') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate('4999-333') as SchemaError[]).length === 0)
		.toBeTruthy();

		const schema1 = string()
		.postalCode(() => PostalCodes.PT)
		.compile();

		expect((schema1.validate('0') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema1.validate('001') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema1.validate('4999333') as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema1.validate('4999-333') as SchemaError[]).length === 0)
		.toBeTruthy();
	});

	it('should test enum types', () => {
		enum FieldTypeEnum {
			FREE_TEXT = 'FREE_TEXT',
			EXISTING_FIELD = 'EXISTING_FIELD',
			SQL_EXPRESSION = 'SQL_EXPRESSION',
			SOURCE_FIELD = 'SOURCE_FIELD'
		}

		const schema = object<{ productName: FieldTypeEnum }>({
			productName: string()
			.nullable()
			.enum(FieldTypeEnum)
		})
		.compile();

		expect((schema.validate({
			productName: FieldTypeEnum.EXISTING_FIELD 
		}) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate({
			// @ts-expect-error // To force validation to be false
			productName: 'NOT ENUM VALUE' 
		}) as SchemaError[]).length === 0)
		.toBeFalsy();
	});

	it('should each schema be separated from previous', () => {
		const schema = string()
		.nullable()
		.min(1);
		const schema1 = schema.optional()
		.max(10);
	
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

		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size)
		.toBe(1);
		// @ts-expect-error // To check protected values
		expect(schema1.def.normalRules.size)
		.toBe(2);
		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size).not.toBe(schema1.def.normalRules.size);
	});

	it('should when', () => {
		const schema = string()
		.when({
			is: (value: string) => value.includes('Test'),
			then: (schema) => schema.equals('Test 10')
		})
		.compile();

		expect((schema.validate('Test 10') as SchemaError[]).length === 0)
		.toBe(true);

		expect((schema.validate('Test 11') as SchemaError[]).length === 0)
		.toBe(false);

		const schema1 = object({
			product: number(),
			productName: string()
			.notRequired()
			
			.numeric()
			.when('product', {
				is: (product: number) => product === 10,
				then: (schema) => schema.required()
			})
		})
		.compile();

		expect((schema1.validate({
			product: 10,
			productName: '10101'
		}) as SchemaError[]).length === 0)
		.toBe(true);

		expect((schema1.validate({
			product: 11,
			productName: ''
		}) as SchemaError[]).length === 0)
		.toBe(true);
	});
});
