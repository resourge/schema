import { Schema, SchemaTypes } from '../core/schema';

export class StringSchema extends Schema<string> {
	public type: SchemaTypes = SchemaTypes.STRING
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: string) => typeof value === 'string'

	constructor(message?: string) {
		super();

		this.message = message ?? this.message;
	}

	/**
	 * 
	 * @param minValue min string value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public minLength(minValue: number, message?: string) {
		this.rules.push({
			type: this.type,
			name: 'minLength',
			isValid: (value: string) => Boolean(value && value.length >= minValue),
			message: message ?? '{{key}} doenst have min length'
		})

		return this;
	}

	/**
	 * 
	 * @param maxValue max string value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public maxLength(maxValue: number, message?: string) {
		this.rules.push({
			type: this.type,
			name: 'maxLength',
			isValid: (value: string) => Boolean(value && value.length <= maxValue),
			message: message ?? '{{key}} doenst have max length'
		})

		return this;
	}
}

export const string = () => {
	return new StringSchema();
}
