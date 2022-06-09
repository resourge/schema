import { PostalCodes } from 'src/lib/postalCodes';

import { string, StringSchema } from '../StringSchema';

describe('string', () => {
	it('should be between', () => {
		const schema = new StringSchema().between(2, 3).compile();

		expect(schema.isValid('11')).toBeTruthy()
		expect(schema.isValid('_a')).toBeTruthy()
		expect(schema.isValid('aaa')).toBeTruthy()
		expect(schema.isValid('aaa3')).toBeFalsy()
	})

	it('should be equals', () => {
		const schema = string().equals('Name').compile();

		expect(schema.isValid('Name')).toBeTruthy();
		expect(schema.isValid('_Name')).toBeFalsy();

		const schema1 = string().equals(['Name', 'Age']).compile();

		expect(schema1.isValid('Name')).toBeTruthy()
		expect(schema1.isValid('Age')).toBeTruthy()
		expect(schema1.isValid('aaa3')).toBeFalsy()
	})

	it('should be alpha', () => {
		const schema = string().alpha().compile();

		expect(schema.isValid('11')).toBeFalsy()
		expect(schema.isValid('_a')).toBeFalsy()
		expect(schema.isValid('aaa')).toBeTruthy()
	})

	it('should be alphadash', () => {
		const schema = string().alphadash().compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('aaa')).toBeTruthy()
		expect(schema.isValid('11')).toBeTruthy()
		expect(schema.isValid('aaa11')).toBeTruthy()
		expect(schema.isValid('a__--aa11')).toBeTruthy()
	})

	it('should be alphanum', () => {
		const schema = string().alphanum().compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('aaa')).toBeTruthy()
		expect(schema.isValid('11')).toBeTruthy()
		expect(schema.isValid('aaa11')).toBeTruthy()
		expect(schema.isValid('a__--aa11')).toBeFalsy()
	})

	it('should be base64', () => {
		const schema = string().base64().compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('aaa')).toBeFalsy()
		expect(schema.isValid('TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=')).toBeTruthy()
	})

	it('should contain', () => {
		const schema = string().contains('product').compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('aaa')).toBeFalsy()
		expect(schema.isValid('aproductaa')).toBeTruthy()
		expect(schema.isValid('aaaproduct')).toBeTruthy()
		expect(schema.isValid('productaaaproduct')).toBeTruthy()
	})

	it('should be cuid', () => {
		const schema = string().cuid().compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('cjld2cjxh0000qzrmn831i7rn')).toBeTruthy()
	})

	describe('should be email', () => {
		it('and basic', () => {
			const schema = string().email('basic').compile();
	
			expect(schema.isValid('//')).toBeFalsy()
			expect(schema.isValid('a{@a.a')).toBeTruthy()
			expect(schema.isValid('a@a.a')).toBeTruthy()
		})
		it('and precise', () => {
			const schema = string().email('precise').compile();
	
			expect(schema.isValid('//')).toBeFalsy()
			expect(schema.isValid('a@a.a')).toBeFalsy()
			expect(schema.isValid('a@a.pt')).toBeTruthy()
		})
	})

	it('should be empty', () => {
		const schema = string().empty().compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('')).toBeTruthy()
		expect(schema.isValid(' ')).toBeFalsy()
	})

	it('should be hex', () => {
		const schema = string().hex().compile();

		expect(schema.isValid('//')).toBeFalsy()
		expect(schema.isValid('000000')).toBeTruthy()
		expect(schema.isValid('666FFF')).toBeTruthy()
		expect(schema.isValid('FFFFFF')).toBeTruthy()
		expect(schema.isValid('Q66FFF')).toBeFalsy()
	})

	it('should be length', () => {
		const schema = string().length(2).compile();

		expect(schema.isValid('//')).toBeTruthy()
		expect(schema.isValid('000000')).toBeFalsy()
		expect(schema.isValid('0')).toBeFalsy()
	})

	it('should be max', () => {
		const schema = string().max(2).compile();

		expect(schema.isValid('//')).toBeTruthy()
		expect(schema.isValid('0')).toBeTruthy()
		expect(schema.isValid('000000')).toBeFalsy()
	})

	it('should be min', () => {
		const schema = string().min(2).compile();

		expect(schema.isValid('0')).toBeFalsy()
		expect(schema.isValid('//')).toBeTruthy()
		expect(schema.isValid('000000')).toBeTruthy()
	})

	it('should be numeric', () => {
		const schema = string().numeric().compile();

		expect(schema.isValid('0')).toBeTruthy()
		expect(schema.isValid('001')).toBeFalsy()
		expect(schema.isValid('000000')).toBeFalsy()
		expect(schema.isValid('//')).toBeFalsy()
	})

	it('should be pattern', () => {
		const schema = string().pattern(/\D/).compile();
	
		expect(schema.isValid('0')).toBeFalsy()
		expect(schema.isValid('001')).toBeFalsy()
		expect(schema.isValid('000000')).toBeFalsy()
		expect(schema.isValid('//')).toBeTruthy()
		expect(schema.isValid('aaa')).toBeTruthy()
	})
	
	it('should be url', () => {
		const schema = string().url().compile();

		expect(schema.isValid('aaaa')).toBeFalsy()
		expect(schema.isValid('/index.html')).toBeFalsy()
		expect(schema.isValid('https://google')).toBeFalsy()
		expect(schema.isValid('https://.pt')).toBeFalsy()
		expect(schema.isValid('www.google.pt')).toBeTruthy()
		expect(schema.isValid('http://www.google.pt')).toBeTruthy()
		expect(schema.isValid('https://www.google.pt')).toBeTruthy()
		expect(schema.isValid('https://google.pt')).toBeTruthy()
	})

	it('should be uuid', () => {
		const schema = string().uuid().compile();

		expect(schema.isValid('0')).toBeFalsy()
		expect(schema.isValid('000000')).toBeFalsy()
		expect(schema.isValid('00000000-0000-0000-0000-000000000000')).toBeTruthy()
		expect(schema.isValid('123e4567-e89b-12d3-a456-426614174000')).toBeTruthy()
	})

	it('should be postal code', () => {
		const schema = string().postalCode(PostalCodes.PT).compile();

		expect(schema.isValid('0')).toBeFalsy()
		expect(schema.isValid('001')).toBeFalsy()
		expect(schema.isValid('4999333')).toBeFalsy()
		expect(schema.isValid('4999-333')).toBeTruthy()

		const schema1 = string().postalCode(() => PostalCodes.PT).compile();

		expect(schema1.isValid('0')).toBeFalsy()
		expect(schema1.isValid('001')).toBeFalsy()
		expect(schema1.isValid('4999333')).toBeFalsy()
		expect(schema1.isValid('4999-333')).toBeTruthy()
	})

	it('should each schema be separated from previous', () => {
		const schema = string().nullable().min(1);
		const schema1 = schema.optional().max(10);
	
		expect(schema.isNullable).toBe(true)
		expect(schema.isOptional).toBe(false)
		expect(schema1.isNullable).toBe(true)
		expect(schema1.isOptional).toBe(true)

		// @ts-expect-error
		expect(schema.def.normalRules.size).toBe(1)
		// @ts-expect-error
		expect(schema1.def.normalRules.size).toBe(2)
		// @ts-expect-error
		expect(schema.def.normalRules.size).not.toBe(schema1.def.normalRules.size)
	})
})
