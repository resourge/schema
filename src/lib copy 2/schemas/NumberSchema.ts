import { Schema, SchemaTypes } from '../core/schema';

export class NumberSchema extends Schema<number> {
	public type: SchemaTypes = SchemaTypes.NUMBER
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: number) => typeof value === 'number'

	/**
	 * Checks if is bigger than minValue.
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test(
			'minNumber',
			(value: number) => value >= minValue,
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
			(value: number) => value <= maxValue,
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
			(val: number) => val === value,
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
			(val: number) => val % 1 !== 0,
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
			(val: number) => val <= 0,
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
			(val: number) => val >= 0,
			message ?? '{{key}} isn\'t an integer'
		)
	}
}

export const number = () => {
	return new NumberSchema();
}
