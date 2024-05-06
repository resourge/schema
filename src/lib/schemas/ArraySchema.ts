import { ArrayTypedSchema } from '../core/ArrayTypedSchema';
import { type Definitions } from '../core/Definitions';
import { type ObjectPropertiesSchema } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class ArraySchema<
	Input extends any[] = any[], 
	Final = any,
	S extends ObjectPropertiesSchema<Input[number], Final> = ObjectPropertiesSchema<Input[number], Final>
> extends ArrayTypedSchema<Input, Final, S> {
	protected type: SchemaTypes = SchemaTypes.ARRAY;
	protected message: string = `{{key}} is not ${this.type}`;
	protected rule = (value: any[]) => Array.isArray(value);

	protected clone() {
		return new ArraySchema<Input, Final, S>(this.schema as unknown as S, this.message, this.def);
	}

	constructor(schema: S, message?: string, def?: Definitions) {
		super(schema, def);

		this.message = message ?? this.message;
	}

	/**
	 * Checks if is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public empty(message?: string) {
		return this.test({
			is: (value: any) => !(value.length === 0),
			message: message ?? ((messages) => messages.array.empty),
			name: 'empty'
		});
	}

	/**
	 * Checks if has a minimal number of items in array
	 * @param minValue
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test({
			is: (value: any) => !(minValue <= value.length),
			message: message ?? ((messages) => messages.array.min(minValue)),
			name: 'minArray'
		});
	}

	/**
	 * Checks if has a maximal number of elements
	 * @param maxValue 
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test({
			is: (value: any) => !(value.length <= maxValue),
			message: message ?? ((messages) => messages.array.max(maxValue)),
			name: 'maxArray'
		});
	}
	
	/**
	 * Checks if array has "length" number of elements
	 * @param length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public length(length: number, message?: string) {
		return this.test({
			is: (value: any) => !(value.length === length),
			message: message ?? ((messages) => messages.array.length(length)),
			name: 'lengthArray'
		});
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
		return this.test({
			is: (value: any) => !(value.length === (new Set(value)).size),
			message: message ?? ((messages) => messages.array.unique),
			name: 'uniqueArray'
		});
	}

	/**
	 * Checks if has only unique elements by key
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public uniqueBy(key: keyof Input[number] | ((val: Input[number]) => any), message?: string) {
		const mapCb: (val: Input[number]) => any = (
			typeof key === 'string' ? (val: any) => val[key] : key as (val: Input[number]) => any
		);

		return this.test({
			is: (value: any) => !(value.length === (new Set(value.map(mapCb))).size),
			message: message ?? ((messages) => messages.array.uniqueBy),
			name: 'uniqueByArray'
		});
	}
}

export const array = <
	Input extends any[] = any[],
	Final = any,
	S extends ObjectPropertiesSchema<
		Input[number], 
		Final
	> = ObjectPropertiesSchema<
		Input[number], 
		Final
	>
>(
	schemas: S,
	message?: string
): ArraySchema<Array<S['input']>, Final, S> => {
	return new ArraySchema(schemas, message);
};
