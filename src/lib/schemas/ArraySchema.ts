
import { ArrayTypedSchema } from '../core/ArrayTypedSchema';
import { RuleFn, SchemaTypes } from '../core/schema';
import { ArrayShape } from '../types/SchemaObject';

export class ArraySchema<
	Input extends any[],
	Final = Input
> extends ArrayTypedSchema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.ARRAY
	protected message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Input, Final> = (value) => Array.isArray(value)

	constructor(schema: ArrayShape<Input, Final>, message?: string) {
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
			(value) => value.length === 0,
			message ?? ((messages) => messages.array.empty),
			'empty'
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
			(value) => minValue <= value.length,
			message ?? ((messages) => messages.array.min(minValue)),
			'minArray'
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
			(value) => value.length <= maxValue,
			message ?? ((messages) => messages.array.max(maxValue)),
			'maxArray'
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
			(value) => value.length === length,
			message ?? ((messages) => messages.array.length(length)),
			'lengthArray'
		)
	}

	/**
	 * Checks if has only unique elements
	 * 
	 * Note: This only check basic values, like numbers, string, boolean.
	 * For object arrays and more complex values use {@link ArraySchema#uniqueBy}
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public unique(message?: string) {
		return this.test(
			(value) => value.length === (new Set(value)).size,
			message ?? ((messages) => messages.array.unique),
			'uniqueArray'
		)
	}

	/**
	 * Checks if has only unique by key elements
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public uniqueBy(key: keyof Input[number] | ((val: Input[number]) => any), message?: string) {
		const mapCb: (val: Input[number]) => any = (
			typeof key === 'string' ? (val: Input[number]) => val[key] : key as (val: Input[number]) => any
		)

		return this.test(
			(value) => value.length === (new Set(value.map(mapCb))).size,
			message ?? ((messages) => messages.array.uniqueBy),
			'uniqueByArray'
		)
	}
}

export const array = <
	Input extends any[] = any[],
	Final = Input
>(
	schemas: ArrayShape<Input, Final>,
	cb?: (schema: ArraySchema<Input, Final>) => void
) => {
	const schema = new ArraySchema<Input, Final>(schemas);

	cb && cb(schema);

	return schema;
}
