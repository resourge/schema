/* eslint-disable no-useless-escape */
import { Schema, SchemaTypes } from '../core/schema';

const NUMERIC_PATTERN = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
const ALPHA_PATTERN = /^[a-zA-Z]+$/;
const ALPHANUM_PATTERN = /^[a-zA-Z0-9]+$/;
const ALPHADASH_PATTERN = /^[a-zA-Z0-9_-]+$/;
const HEX_PATTERN = /^[0-9a-fA-F]+$/;
const URL_PATTERN = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
const BASE64_PATTERN = /^(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const PRECISE_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const CUID_PATTERN = /^c[^\s-]{8,}$/i;
const UUID_PATTERN = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const BASIC_PATTERN = /^\S+@\S+\.\S+$/;

export class StringSchema<
	Input extends string = string,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.STRING
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: string) => typeof value === 'string'

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
			(value: string) => value.length >= minValue,
			message ?? ((messages) => messages.string.min(minValue)),
			'minLength'
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
			(value: string) => value.length <= maxValue,
			message ?? ((messages) => messages.string.max(maxValue)),
			'maxLength'
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
			(value: string) => value.length === length,
			message ?? ((messages) => messages.string.length(length)),
			'length'
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
			(value: string) => reg.test(value),
			message ?? ((messages) => messages.string.pattern(reg)),
			'pattern'
		)
	}

	/**
	 * Checks if string is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public empty(message?: string) {
		return this.test(
			(value: string) => value.length === 0,
			message ?? ((messages) => messages.string.empty),
			'empty'
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
			(val: string) => val.includes(value),
			message ?? ((messages) => messages.string.contains(value)),
			'contains'
		)
	}

	/**
	 * Checks if string contains only numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public numeric(message?: string) {
		return this.test(
			(value: string) => NUMERIC_PATTERN.test(value),
			message ?? ((messages) => messages.string.numeric),
			'numeric'
		)
	}

	/**
	 * Checks if string contains only alpha characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alpha(message?: string) {
		return this.test(
			(value: string) => ALPHA_PATTERN.test(value),
			message ?? ((messages) => messages.string.alpha),
			'alpha'
		)
	}

	/**
	 * Checks if string contains only alpha-numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphanum(message?: string) {
		return this.test(
			(value: string) => ALPHANUM_PATTERN.test(value),
			message ?? ((messages) => messages.string.alphanum),
			'alphanum'
		)
	}

	/**
	 * Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.'
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphadash(message?: string) {
		return this.test(
			(value: string) => ALPHADASH_PATTERN.test(value),
			message ?? ((messages) => messages.string.alphadash),
			'alphadash'
		)
	}

	/**
	 * Checks if string is hexadecimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public hex(message?: string) {
		return this.test(
			(value: string) => value.length % 2 === 0 && HEX_PATTERN.test(value),
			message ?? ((messages) => messages.string.hex),
			'hex'
		)
	}

	/**
	 * Checks if string is base64.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public base64(message?: string) {
		return this.test(
			(value: string) => BASE64_PATTERN.test(value),
			message ?? ((messages) => messages.string.base64),
			'base64'
		)
	}

	/**
	 * Checks if string is format uuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public uuid(message?: string) {
		return this.test(
			(value: string) => UUID_PATTERN.test(value),
			message ?? ((messages) => messages.string.uuid),
			'uuid'
		)
	}

	/**
	 * Checks if string is URL accepted
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public url(message?: string) {
		return this.test(
			(value: string) => URL_PATTERN.test(value),
			message ?? ((messages) => messages.string.url),
			'url'
		)
	}

	/**
	 * Checks if string is format cuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public cuid(message?: string) {
		return this.test(
			(value: string) => CUID_PATTERN.test(value),
			message ?? ((messages) => messages.string.cuid),
			'cuid'
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
			(value: string) => pattern.test(value),
			message ?? ((messages) => messages.string.email),
			'email'
		)
	}
}

export const string = <
	Input extends string = string,
	Final = Input
>(
	cb?: (schema: StringSchema<Input, Final>) => void
) => {
	const schema = new StringSchema<Input, Final>();

	cb && cb(schema);

	return schema;
}
