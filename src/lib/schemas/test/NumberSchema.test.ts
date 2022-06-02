import { number, NumberSchema } from '../NumberSchema';
import { S } from '../index';

describe('number', () => {
	it('should be number', () => {
		const schema = S.number().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate('10')).toBeFalsy()
		expect(validate(10)).toBeTruthy()
	})

	it('should be min', () => {
		const schema = number().min(20).compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeFalsy()
		expect(validate(20)).toBeTruthy()
	})

	it('should be max', () => {
		const schema = number().max(20).compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(21)).toBeFalsy()
	})

	it('should be between', () => {
		const schema = number().between(10, 15).compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(21)).toBeFalsy()
	})

	it('should be decimal', () => {
		const schema = number().decimal(2).compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeFalsy()
		expect(validate(10.1)).toBeFalsy()
		expect(validate(10.12)).toBeTruthy()
		expect(validate(10.123)).toBeFalsy()
	})

	describe('equal', () => {
		it('should be equal to 1 number', () => {
			const schema = number().equals(10).compile();
	
			const validate = (value: any) => schema.isValid(value);
		
			expect(validate(10)).toBeTruthy()
			expect(validate(10.12)).toBeFalsy()
		})

		it('should be equal to multiple numbers', () => {
			const schema = number().equals([10, 11]).compile();
	
			const validate = (value: any) => schema.isValid(value);
		
			expect(validate(10)).toBeTruthy()
			expect(validate(11)).toBeTruthy()
			expect(validate(12)).toBeFalsy()
			expect(validate(10.12)).toBeFalsy()
		})
	})

	it('should be integer', () => {
		const schema = number().integer().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(10.12)).toBeFalsy()
	})

	it('should be negative', () => {
		const schema = number().negative().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(-10)).toBeTruthy()
		expect(validate(10.12)).toBeFalsy()
	})

	it('should be notNullable', () => {
		const schema = number().notNullable().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(null)).toBeFalsy()
	})

	it('should be notOptional', () => {
		const schema = number().notOptional().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(undefined)).toBeFalsy()
		expect(validate('10')).toBeFalsy()
	})

	it('should be notRequired', () => {
		const schema = number().notRequired().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(undefined)).toBeTruthy()
		expect(validate(null)).toBeTruthy()
		expect(validate('10')).toBeFalsy()
	})

	it('should be nullable', () => {
		const schema = number().nullable().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(null)).toBeTruthy()
		expect(validate('10')).toBeFalsy()
	})

	it('should be onlyOnTouch', () => {
		const schema = number().onlyOnTouch().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(null)).toBeTruthy()
		expect(validate('10')).toBeTruthy()
		expect(validate(undefined)).toBeTruthy()

		const validate2 = (value: any) => schema.isValid(value, ['']);
		
		expect(validate2(10)).toBeTruthy()
		expect(validate2(null)).toBeFalsy()
		expect(validate2('10')).toBeFalsy()
		expect(validate2(undefined)).toBeFalsy()
	})

	it('should be optional', () => {
		const schema = number().optional().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(undefined)).toBeTruthy()
		expect(validate(null)).toBeFalsy()
		expect(validate('10')).toBeFalsy()
	})

	it('should be positive', () => {
		const schema = new NumberSchema().positive().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(-10)).toBeFalsy()
	})

	it('should be required', () => {
		const schema = number().required().compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeTruthy()
		expect(validate(-10)).toBeTruthy()
		expect(validate(undefined)).toBeFalsy()
		expect(validate(null)).toBeFalsy()
	})

	it('should be when', () => {
		const schema = number()
		.optional()
		.when({
			is: (value) => value < 10 || value === null,
			then: (schema) => schema.negative().required(),
			otherwise: (schema) => schema.notOptional()
		})
		.compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(-9)).toBeTruthy()
		expect(validate(null)).toBeFalsy()

		expect(validate(11)).toBeTruthy()
		expect(validate(undefined)).toBeFalsy()
	})

	it('should test custom test', () => {
		const schema = number().test({
			test: (value) => value !== 10,
			message: 'Requires to be 10',
			name: ''
		}).compile();
	
		const validate = (value: any) => schema.isValid(value);
		
		expect(validate(10)).toBeFalsy()
		expect(validate(-10)).toBeTruthy()
	})
})
