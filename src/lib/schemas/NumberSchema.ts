import { Schema } from '../core/schema';
import { NullableType } from '../types/_types';
import { SchemaTypes } from '../utils/Utils';

export class NumberSchema<
	Input extends NullableType<number> = number,
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.NUMBER
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: number) => typeof value === 'number'

	constructor(message?: string) {
		super();

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
			test: (value) => value >= minValue,
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
			test: (value) => value <= maxValue,
			message: message ?? ((messages) => messages.number.max(maxValue)),
			name: 'maxNumber'
		})
	}

	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public equals(value: number, message?: string) {
		return this.test({
			test: (val) => val === value,
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
			test: (val) => val % 1 === 0,
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
			test: (val) => val.toFixed(decimal) === val.toString(),
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
			test: (val) => val >= 0,
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
			test: (val) => val < 0,
			message: message ?? ((messages) => messages.number.negative),
			name: 'negative'
		})
	}
}

export const number = <
	Input extends number = number,
	Final = any
>() => {
	return new NumberSchema<Input, Final>();
}
