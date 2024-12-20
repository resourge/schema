import { Schema } from '../core/schema';
import { type NullableType } from '../types/types';

export class NumberSchema<
	Input extends NullableType<number> = number,
	Final = any
> extends Schema<Input, Final> {
	protected message: string = 'Is not number';
	protected rule = (value: number) => typeof value === 'number';

	/**
	 * Checks if is bigger than minValue.
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 */
	public min(minValue: number, message?: string) {
		return this.test({
			is: (value: number) => value < minValue,
			message: message ?? ((messages) => messages.number.min(minValue)),
			name: `minNumber_${minValue}_${message}`
		});
	}

	/**
	 * Checks if is smaller than maxValue.
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 */
	public max(maxValue: number, message?: string) {
		return this.test({
			is: (value) => value > maxValue,
			message: message ?? ((messages) => messages.number.max(maxValue)),
			name: `maxNumber_${maxValue}_${message}`
		});
	}

	/**
	 * Checks if is between minValue and maxValue.
	 * @param minValue min number value
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 */
	public between(minValue: number, maxValue: number, message?: string) {
		return this.test({
			is: (value) => value < minValue || value > maxValue,
			message: message ?? ((messages) => messages.number.between(minValue, maxValue)),
			name: `betweenNumber_${minValue}_${maxValue}_${message}`
		});
	}

	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 */
	public equals(value: number | number[], message?: string) {
		const is = Array.isArray(value)
			? (val: number) => !value.includes(val)
			: (val: number) => val !== value;
		
		return this.test({
			is,
			message: message ?? ((messages) => messages.number.equals(value)),
			name: `equalsNumber_${Array.isArray(value) ? value.join('_') : value}_${message}`
		});
	}

	/**
	 * Checks if is integer.
	 * @param message @option Overrides default message
	 */
	public integer(message?: string) {
		return this.test({
			is: (val) => val % 1 !== 0,
			message: message ?? ((messages) => messages.number.integer),
			name: `integer_${message}`
		});
	}

	/**
	 * Checks if is decimal.
	 * @param message @option Overrides default message
	 */
	public decimal(decimal: number, message?: string) {
		return this.test({
			is: (val) => val.toFixed(decimal) !== val.toString(),
			message: message ?? ((messages) => messages.number.decimal(decimal)),
			name: `decimal_${decimal}_${message}`
		});
	}

	/**
	 * Checks if is positive value.
	 * @param message @option Overrides default message
	 */
	public positive(message?: string) {
		return this.test({
			is: (val) => val < 0,
			message: message ?? ((messages) => messages.number.positive),
			name: `positive_${message}`
		});
	}

	/**
	 * Checks if is negative value.
	 * @param message @option Overrides default message
	 */
	public negative(message?: string) {
		return this.test({
			is: (val) => val >= 0,
			message: message ?? ((messages) => messages.number.negative),
			name: `negative_${message}`
		});
	}

	/**
	 * Checks if is a value of enum.
	 * @param enumObject enum
	 * @param message @option Overrides default message
	 */
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	public enum<T extends { [name: string]: any }>(enumObject: T, message?: string) {
		const enumValues = Object.values(enumObject);

		return this.test({
			is: (value: any) => !enumValues.includes(value),
			message: message ?? ((messages) => messages.number.enum)
			// name: 'enumNumber'
		}) as unknown as NumberSchema<T[keyof T], Final>;
	}
}

export const number = <
	Input extends number = number,
	Final = any
>(message?: string) => new NumberSchema<Input, Final>(message);
