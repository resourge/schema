import { Schema, SchemaTypes } from '../core/schema';

export class NumberSchema<
	Input extends number = number,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.NUMBER
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: number) => typeof value === 'number'

	/**
	 * Checks if is bigger than minValue.
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test(
			(value: number) => value >= minValue,
			message ?? ((messages) => messages.number.min(minValue)),
			'minNumber'
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
			(value: number) => value <= maxValue,
			message ?? ((messages) => messages.number.max(maxValue)),
			'maxNumber'
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
			(val: number) => val === value,
			message ?? ((messages) => messages.number.equals(value)),
			'equalsNumber'
		)
	}

	/**
	 * Checks if is integer.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public integer(message?: string) {
		return this.test(
			(val: number) => val % 1 === 0,
			message ?? ((messages) => messages.number.integer),
			'integer'
		)
	}

	/**
	 * Checks if is decimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public decimal(decimal: number, message?: string) {
		return this.test(
			(val: number) => val.toFixed(decimal) === val.toString(),
			message ?? ((messages) => messages.number.decimal(decimal)),
			'decimal'
		)
	}

	/**
	 * Checks if is positive value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public positive(message?: string) {
		return this.test(
			(val: number) => val >= 0,
			message ?? ((messages) => messages.number.positive),
			'positive'
		)
	}

	/**
	 * Checks if is negative value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public negative(message?: string) {
		return this.test(
			(val: number) => val < 0,
			message ?? ((messages) => messages.number.negative),
			'negative'
		)
	}
}

export const number = <
	Input extends number = number,
	Final = Input
>(
	cb?: (schema: NumberSchema<Input, Final>) => void
) => {
	const schema = new NumberSchema<Input, Final>();

	cb && cb(schema);

	return schema;
}
