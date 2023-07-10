import { Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { NullableType } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class NumberSchema<
	Input extends NullableType<number> = number,
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.NUMBER
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: number) => typeof value === 'number'

	protected clone() {
		return new NumberSchema(this.message, this.def)
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}
	
	/**
	 * Checks if is bigger than minValue.
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test({
			is: (value) => !(value >= minValue),
			message: message ?? ((messages) => messages.number.min(minValue)),
			name: 'minNumber'
		})
	}

	/**
	 * Checks if is smaller than maxValue.
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test({
			is: (value) => !(value <= maxValue),
			message: message ?? ((messages) => messages.number.max(maxValue)),
			name: 'maxNumber'
		})
	}

	/**
	 * Checks if is between minValue and maxValue.
	 * @param minValue min number value
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public between(minValue: number, maxValue: number, message?: string) {
		return this.test({
			is: (value) => !(value >= minValue && value <= maxValue),
			message: message ?? ((messages) => messages.number.between(minValue, maxValue)),
			name: 'betweenNumber'
		})
	}

	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public equals(value: number | number[], message?: string) {
		let is = (val: number) => !(val === value)
		if ( Array.isArray(value) ) {
			is = (val: number) => !value.includes(val)
		}
		
		return this.test({
			is,
			message: message ?? ((messages) => messages.number.equals(value)),
			name: 'equalsNumber'
		})
	}

	/**
	 * Checks if is integer.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public integer(message?: string) {
		return this.test({
			is: (val) => !(val % 1 === 0),
			message: message ?? ((messages) => messages.number.integer),
			name: 'integer'
		})
	}

	/**
	 * Checks if is decimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public decimal(decimal: number, message?: string) {
		return this.test({
			is: (val) => !(val.toFixed(decimal) === val.toString()),
			message: message ?? ((messages) => messages.number.decimal(decimal)),
			name: 'decimal'
		})
	}

	/**
	 * Checks if is positive value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public positive(message?: string) {
		return this.test({
			is: (val) => !(val >= 0),
			message: message ?? ((messages) => messages.number.positive),
			name: 'positive'
		})
	}

	/**
	 * Checks if is negative value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public negative(message?: string) {
		return this.test({
			is: (val) => !(val < 0),
			message: message ?? ((messages) => messages.number.negative),
			name: 'negative'
		})
	}

	/**
	 * Checks if is a value of enum.
	 * @param enumObject enum
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public enum<T extends { [name: string]: any }>(enumObject: T, message?: string) {
		const enumValues = Object.values(enumObject);

		return this.test({
			is: (value: any) => !enumValues.includes(value),
			message: message ?? ((messages) => messages.number.enum),
			name: 'enumNumber'
		})
	}
}

export const number = <
	Input extends number = number,
	Final = any
>(message?: string) => {
	return new NumberSchema<Input, Final>(message);
}
