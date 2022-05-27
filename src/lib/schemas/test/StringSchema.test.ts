import { string, StringSchema } from '../StringSchema';

describe('string', () => {
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
		const schema = string((schema) => schema.url()).compile();

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
		const schema = new StringSchema().uuid().compile();

		expect(schema.isValid('0')).toBeFalsy()
		expect(schema.isValid('000000')).toBeFalsy()
		expect(schema.isValid('00000000-0000-0000-0000-000000000000')).toBeTruthy()
		expect(schema.isValid('123e4567-e89b-12d3-a456-426614174000')).toBeTruthy()
	})
})
