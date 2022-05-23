
import { ArrayTypedSchema } from '../core/ArrayTypedSchema';
import { RuleFn, SchemaTypes } from '../core/schema';
import { ArrayShape } from '../types/SchemaObject';

export class ArraySchema<
	Input extends any[]
> extends ArrayTypedSchema<Input> {
	public type: SchemaTypes = SchemaTypes.ARRAY
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<any[], '', any[]> = (value: any[]) => Array.isArray(value)

	constructor(schema: ArrayShape<Input>, message?: string) {
		super(schema);

		this.message = message ?? this.message;
	}

	/**
	 * Checks if is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public empty(message?: string) {
		return this.test(
			'empty',
			(value: any[]) => value.length === 0,
			message ?? '{{key}} is not an empty array'
		)
	}

	/**
	 * Checks if min number of elements
	 * @param minValue
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test(
			'minArray',
			(value: any[]) => minValue < value.length,
			message ?? `{{key}} doens\t have a minimal of ${minValue} elements`
		)
	}

	/**
	 * Checks if max number of elements
	 * @param maxValue 
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test(
			'maxArray',
			(value: any[]) => value.length < maxValue,
			message ?? `{{key}} doens\t have a maximal of ${maxValue} elements`
		)
	}

	/**
	 * Checks if array has "length" number of elements
	 * @param length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public length(length: number, message?: string) {
		return this.test(
			'lengthArray',
			(value: string) => value.length === length,
			message ?? `{{key}} doens\t have a ${length} elements`
		)
	}

	/**
	 * Checks if has only unique elements
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public unique(message?: string) {
		return this.test(
			'uniqueArray',
			(value: any[]) => value.length === (new Set(value)).size,
			message ?? '{{key}} doens\t have a unique elements'
		)
	}

	/*
	/**
	 * Checks if has only unique by key elements
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	public uniqueBy(key: keyof Input[0], message?: string) {
		return this.test(
			'uniqueArray',
			(value: any[]) => uniqueBy(value, key),
			message ?? '{{key}} doens\t have unique elements'
		)
	} */
}
/*
const uniqueBy = (arr: any[], key: any): boolean => {
	const len = arr.length;
	const obj: any = {};
	for (let i = 0; i < len; i++) {
		const element = arr[i][key];
		
		if ( element in obj ) {
			return false
		}

		obj[element] = true;
	}
	return true
}
*/

export const array = <
	Input extends any[]
>(
	schemas: ArrayShape<Input>,
	cb?: (schema: ArraySchema<Input>) => void
) => {
	const schema = new ArraySchema<Input>(schemas, '');

	cb && cb(schema);

	return schema;
}
