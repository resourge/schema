import { Schema, SchemaTypes } from '../core/schema';

const NUMERIC_PATTERN = /^-?[0-9]\d*(\.\d+)?$/;
const ALPHA_PATTERN = /^[a-zA-Z]+$/;
const ALPHANUM_PATTERN = /^[a-zA-Z0-9]+$/;
const ALPHADASH_PATTERN = /^[a-zA-Z0-9_-]+$/;
const HEX_PATTERN = /^[0-9a-fA-F]+$/;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const PRECISE_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const BASIC_PATTERN = /^\S+@\S+\.\S+$/;

export class StringSchema<
	Input extends string = string,
	Final = Input
> extends Schema<Input, Input, Final> {
	public type: SchemaTypes = SchemaTypes.STRING
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: Input) => typeof value === 'string'

	constructor(message?: string) {
		super();

		this.message = message ?? this.message;
	}

	/**
	 * Checks if has a size bigger than minValue
	 * @param minValue min string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test(
			'minLength',
			(value: string) => value.length >= minValue,
			message ?? '{{key}} doens\'t have min length'
		)
	}

	/**
	 * Checks if has a size smaller than maxValue
	 * @param maxValue max string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test(
			'maxLength',
			(value: string) => value.length <= maxValue,
			message ?? '{{key}} doens\'t have max length'
		)
	}

	/**
	 * Checks if string has `maxValue` length
	 * @param length string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public length(length: number, message?: string) {
		return this.test(
			'length',
			(value: string) => value.length === length,
			message ?? `{{key}} doens't have ${length} length`
		)
	}

	/**
	 * Matches regular expression
	 * @param reg Regular expression
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public pattern(reg: RegExp, message?: string) {
		return this.test(
			'pattern',
			(value: string) => reg.test(value),
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			message ?? `{{key}} doesn't match ${reg.toString()}`
		)
	}

	/**
	 * Checks if string is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public empty(message?: string) {
		return this.test(
			'empty',
			(value: string) => value.length === 0,
			message ?? '{{key}} is not a empty string'
		)
	}

	/**
	 * Checks if string contains value
	 * @param value value to check if contains
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public contains(value: string, message?: string) {
		return this.test(
			'contains',
			(val: string) => val.includes(value),
			message ?? `{{key}} doesn't contains ${value}`
		)
	}

	/**
	 * Checks if string contains only numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public numeric(message?: string) {
		return this.test(
			'numeric',
			(value: string) => NUMERIC_PATTERN.test(value),
			message ?? '{{key}} is not numeric'
		)
	}

	/**
	 * Checks if string contains only alpha characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alpha(message?: string) {
		return this.test(
			'alpha',
			(value: string) => ALPHA_PATTERN.test(value),
			message ?? '{{key}} does not contain alpha characters.'
		)
	}

	/**
	 * Checks if string contains only alpha-numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphanum(message?: string) {
		return this.test(
			'alphanum',
			(value: string) => ALPHANUM_PATTERN.test(value),
			message ?? '{{key}} does not contain alpha-numeric characters'
		)
	}

	/**
	 * Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.'
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphadash(message?: string) {
		return this.test(
			'alphadash',
			(value: string) => ALPHADASH_PATTERN.test(value),
			message ?? '{{key}} does not contain alpha-numeric characters, as well as dashes and underscores.'
		)
	}

	/**
	 * Checks if string is hexadecimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public hex(message?: string) {
		return this.test(
			'hex',
			(value: string) => value.length % 2 === 0 && HEX_PATTERN.test(value),
			message ?? '{{key}} is not hexadecimal.'
		)
	}

	/**
	 * Checks if string is base64.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public base64(message?: string) {
		return this.test(
			'base64',
			(value: string) => BASE64_PATTERN.test(value),
			message ?? '{{key}} is not base64.'
		)
	}

	/**
	 * Checks if string is a single line.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public singleLine(message?: string) {
		return this.test(
			'singleLine',
			(value: string) => !value.includes('\\n'),
			message ?? '{{key}} is a single line.'
		)
	}

	/**
	 * Checks if is email.
	 * @param mode @option Defines if is basic or precise email
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public email(mode?: 'basic' | 'precise', message?: string) {
		const pattern = mode === 'precise' ? PRECISE_PATTERN : BASIC_PATTERN;

		return this.test(
			'email',
			(value: string) => pattern.test(value),
			message ?? '{{key}} is a single line.'
		)
	}
}

export const string = <
	Input extends string = string,
	Final = Input
>() => {
	return new StringSchema<Input, Final>();
}
