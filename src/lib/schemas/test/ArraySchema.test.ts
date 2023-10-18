import { number, object, string } from '..';
import { array, ArraySchema } from '../ArraySchema';

describe('array', () => {
	it('should be empty', () => {
		const schema = array(number())
		.empty()
		.compile();

		expect(schema.isValid([]))
		.toBeTruthy();
		expect(schema.isValid([1]))
		.toBeFalsy();
	});

	it('should be length', () => {
		const schema = array(number())
		.length(2)
		.compile();

		expect(schema.isValid([]))
		.toBeFalsy();
		expect(schema.isValid([1]))
		.toBeFalsy();
		expect(schema.isValid([1, 2]))
		.toBeTruthy();
		expect(schema.isValid([1, 2, 3]))
		.toBeFalsy();

		expect(array(number())
		.length(1)
		.isValid([1, 2, 3]))
		.toBeFalsy();
	});

	it('should be max', () => {
		const schema = new ArraySchema(number())
		.max(2)
		.compile();

		expect(schema.isValid([]))
		.toBeTruthy();
		expect(schema.isValid([1]))
		.toBeTruthy();
		expect(schema.isValid([1, 2]))
		.toBeTruthy();
		expect(schema.isValid([1, 2, 3]))
		.toBeFalsy();

		expect(array(number())
		.max(1)
		.isValid([1, 2, 3]))
		.toBeFalsy();
	});

	it('should be min', () => {
		const schema = array(number())
		.min(2)
		.compile();

		expect(schema.isValid([]))
		.toBeFalsy();
		expect(schema.isValid([1]))
		.toBeFalsy();
		expect(schema.isValid([1, 2]))
		.toBeTruthy();
		expect(schema.isValid([1, 2, 3]))
		.toBeTruthy();

		expect(array(number())
		.min(1)
		.isValid([1, 2, 3]))
		.toBeTruthy();
	});
	
	describe('unique', () => {
		it('should be unique number', () => {
			const schemaNumber = array(number())
			.unique()
			.compile();
	
			expect(schemaNumber.isValid([]))
			.toBeTruthy();
			expect(schemaNumber.isValid([1, 2]))
			.toBeTruthy();
			expect(schemaNumber.isValid([2, 2]))
			.toBeFalsy();
	
			const schemaObject = array(
				object({
					product: number(),
					productName: string()
				})
			)
			.unique()
			.compile();
	
			expect(schemaObject.isValid([]))
			.toBeTruthy();
			expect(schemaObject.isValid([
				{
					product: 1,
					productName: 'Name'
				}
			]))
			.toBeTruthy();
			expect(schemaObject.isValid([
				{
					product: 1,
					productName: 'Name'
				},
				{
					product: 2,
					productName: 'Name'
				}
			]))
			.toBeTruthy();
	
			expect(
				schemaObject.isValid([
					{
						product: 1,
						productName: 'Name'
					},
					{
						product: 1,
						productName: 'Name'
					}
				])
			)
			.toBeTruthy();
		});

		it('should be unique 2 types', () => {
			const schemaNumber = array<Array<1 | 2>>(
				number()
				.equals([1, 2])
			)
			.compile();
	
			expect(schemaNumber.isValid([]))
			.toBeTruthy();
			expect(schemaNumber.isValid([1]))
			.toBeTruthy();
			expect(schemaNumber.isValid([2, 4]))
			.toBeFalsy();
		});
	});

	describe('should be uniqueby', () => {
		it('key', () => {
			const schemaObject = array(
				object({
					product: number(),
					productName: string()
				})
			)
			.uniqueBy('product')
			.compile();
	
			expect(schemaObject.isValid([]))
			.toBeTruthy();
			expect(schemaObject.isValid([
				{
					product: 1,
					productName: 'Name'
				}
			]))
			.toBeTruthy();
			expect(schemaObject.isValid([
				{
					product: 1,
					productName: 'Name'
				},
				{
					product: 2,
					productName: 'Name'
				}
			]))
			.toBeTruthy();
	
			expect(
				schemaObject.isValid([
					{
						product: 1,
						productName: 'Name'
					},
					{
						product: 1,
						productName: 'Name'
					}
				])
			)
			.toBeFalsy();
		});

		it('value', () => {
			const schemaObject = array(
				object({
					product: number(),
					productName: string()
				})
			)
			.uniqueBy((value) => value.productName)
			.compile();
	
			expect(schemaObject.isValid([]))
			.toBeTruthy();
			expect(schemaObject.isValid([
				{
					product: 1,
					productName: 'Name'
				}
			]))
			.toBeTruthy();
			expect(schemaObject.isValid([
				{
					product: 1,
					productName: 'Name'
				},
				{
					product: 2,
					productName: 'Name'
				}
			]))
			.toBeFalsy();
	
			expect(
				schemaObject.isValid([
					{
						product: 1,
						productName: 'Name'
					},
					{
						product: 1,
						productName: 'Name'
					}
				])
			)
			.toBeFalsy();
		});
	});

	it('should each schema be separated from previous', () => {
		const schema = array(number())
		.nullable()
		.min(1);
		const schema1 = schema.optional()
		.max(10);
	
		// @ts-expect-error // To check protected values
		expect(schema.isNullable)
		.toBe(true);
		// @ts-expect-error // To check protected values
		expect(schema.isOptional)
		.toBe(false);
		// @ts-expect-error // To check protected values
		expect(schema1.isNullable)
		.toBe(true);
		// @ts-expect-error // To check protected values
		expect(schema1.isOptional)
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
});
