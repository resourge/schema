import { Schema, SchemaTypes } from '../core/schema';

export class NumberSchema<
	Input extends number = number,
	Final = Input
> extends Schema<Input, Input, Final> {
	public type: SchemaTypes = SchemaTypes.NUMBER
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: Input) => typeof value === 'number'

	/**
	 * Checks if is bigger than minValue.
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test(
			'minNumber',
			(value) => value >= minValue,
			message ?? '{{key}} doesn\'t have min length'
		)
	}

	/**
	 * Checks if is smaller than maxValue.
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test(
			'maxNumber',
			(value) => value <= maxValue,
			message ?? '{{key}} doesn\'t have max length'
		)
	}

	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public equals(value: number, message?: string) {
		return this.test(
			'equalsNumber',
			(val) => val === value,
			message ?? `{{key}} isn't equal to ${value}`
		)
	}

	/**
	 * Checks if is integer.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public integer(message?: string) {
		return this.test(
			'integer',
			(val) => val % 1 !== 0,
			message ?? '{{key}} isn\'t an integer'
		)
	}

	/**
	 * Checks if is positive value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public positive(message?: string) {
		return this.test(
			'positive',
			(val) => val <= 0,
			message ?? '{{key}} isn\'t an integer'
		)
	}

	/**
	 * Checks if is negative value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public negative(message?: string) {
		return this.test(
			'negative',
			(val) => val >= 0,
			message ?? '{{key}} isn\'t an integer'
		)
	}
}

export const number = <
	Input extends number = number,
	Final = Input
>() => {
	return new NumberSchema<Input, Final>();
}
