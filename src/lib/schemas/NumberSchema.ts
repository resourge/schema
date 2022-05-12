import { Schema, SchemaTypes } from '../core/schema';

export class NumberSchema extends Schema<number> {
	public type: SchemaTypes = SchemaTypes.NUMBER
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: number) => typeof value === 'number'

	/**
	 * 
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		this.rules.push({
			type: this.type,
			name: 'minLength',
			isValid: (value: number) => value >= minValue,
			message: message ?? '{{key}} doenst have min length'
		})

		return this;
	}

	/**
	 * 
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		this.rules.push({
			type: this.type,
			name: 'maxLength',
			isValid: (value: number) => value <= maxValue,
			message: message ?? '{{key}} doenst have max length'
		})

		return this;
	}
}

export const number = () => {
	return new NumberSchema();
}
