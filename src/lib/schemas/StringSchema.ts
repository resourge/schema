/* eslint-disable no-useless-escape */
import { Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { PostalCodeInfo } from '../postalCodes';
import { NullableType } from '../types/SchemaMap';
import { Context } from '../types/types';
import { SchemaTypes } from '../utils/Utils';

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
	Input extends NullableType<string> = string,
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.STRING
	protected override message: string = `{{key}} is not ${this.type}`
	protected rule = (value: any) => typeof value === 'string'

	public clone() {
		return new StringSchema<Input, Final>(this.message, this.def)
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}

	/**
	 * Checks if has a size bigger than minValue
	 * @param minValue min string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test({
			test: (value: any) => value.length >= minValue,
			message: message ?? ((messages) => messages.string.min(minValue)),
			name: 'minLength'
		})
	}

	/**
	 * Checks if has a size smaller than maxValue
	 * @param maxValue max string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test({
			test: (value: any) => value.length <= maxValue,
			message: message ?? ((messages) => messages.string.max(maxValue)),
			name: 'maxLength'
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
			test: (value) => value.length >= minValue && value.length <= maxValue,
			message: message ?? ((messages) => messages.number.between(minValue, maxValue)),
			name: 'betweenNumber'
		})
	}

	/**
	 * Checks if string has `maxValue` length
	 * @param length string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public length(length: number, message?: string) {
		return this.test({
			test: (value: any) => value.length === length,
			message: message ?? ((messages) => messages.string.length(length)),
			name: 'length'
		})
	}

	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public equals(value: string | string[], message?: string) {
		let test = (val: string) => val === value
		if ( Array.isArray(value) ) {
			test = (val: string) => value.includes(val)
		}
		
		return this.test({
			test: test,
			message: message ?? ((messages) => messages.string.equals(value)),
			name: 'equalsString'
		})
	}

	/**
	 * Matches regular expression
	 * @param reg Regular expression
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public pattern(reg: RegExp, message?: string) {
		return this.test({
			test: (value: any) => reg.test(value),
			message: message ?? ((messages) => messages.string.pattern(reg)),
			name: 'pattern'
		})
	}

	/**
	 * Checks if string is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public empty(message?: string) {
		return this.test({
			test: (value: any) => value.length === 0,
			message: message ?? ((messages) => messages.string.empty),
			name: 'empty'
		})
	}

	/**
	 * Checks if string contains value
	 * @param value value to check if contains
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public contains(value: string, message?: string) {
		return this.test({
			test: (val: any) => val.includes(value),
			message: message ?? ((messages) => messages.string.contains(value)),
			name: 'contains'
		})
	}

	/**
	 * Checks if string contains only numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public numeric(message?: string) {
		return this.test({
			test: (value: any) => NUMERIC_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.numeric),
			name: 'numeric'
		})
	}

	/**
	 * Checks if string contains only alpha characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alpha(message?: string) {
		return this.test({
			test: (value: any) => ALPHA_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.alpha),
			name: 'alpha'
		})
	}

	/**
	 * Checks if string contains only alpha-numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphanum(message?: string) {
		return this.test({
			test: (value: any) => ALPHANUM_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.alphanum),
			name: 'alphanum'
		})
	}

	/**
	 * Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.'
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphadash(message?: string) {
		return this.test({
			test: (value: any) => ALPHADASH_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.alphadash),
			name: 'alphadash'
		})
	}

	/**
	 * Checks if string is hexadecimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public hex(message?: string) {
		return this.test({
			test: (value: any) => value.length % 2 === 0 && HEX_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.hex),
			name: 'hex'
		})
	}

	/**
	 * Checks if string is base64.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public base64(message?: string) {
		return this.test({
			test: (value: any) => BASE64_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.base64),
			name: 'base64'
		})
	}

	/**
	 * Checks if string is format uuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public uuid(message?: string) {
		return this.test({
			test: (value: any) => UUID_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.uuid),
			name: 'uuid'
		})
	}

	/**
	 * Checks if string is URL accepted
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public url(message?: string) {
		return this.test({
			test: (value: any) => URL_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.url),
			name: 'url'
		})
	}

	/**
	 * Checks if string is format cuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public cuid(message?: string) {
		return this.test({
			test: (value: any) => CUID_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.cuid),
			name: 'cuid'
		})
	}

	/**
	 * Checks if is a valid email.
	 * @param mode @option Defines if is basic or precise validation
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public email(mode?: 'basic' | 'precise', message?: string) {
		const pattern = mode === 'precise' ? PRECISE_PATTERN : BASIC_PATTERN;

		return this.test({
			test: (value: any) => pattern.test(value),
			message: message ?? ((messages) => messages.string.email),
			name: 'email'
		})
	}

	/**
	 * Checks if is a valid postalCode.
	 * @param postalCode postal code to validate or a function which we can return desired postal code
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public postalCode(
		postalCode: PostalCodeInfo | ((value: NonNullable<Input>, form: this['final']) => PostalCodeInfo), 
		message?: string
	) {
		if ( typeof postalCode === 'function' ) {
			return this.test((value, form, context: Context) => {
				const _postalCode = postalCode(value, form);
				if ( _postalCode.regex.test(value) ) {
					return true;
				}

				return [
					{
						path: '',
						error: message ?? context.messages.string.postalCode(_postalCode)
					}
				]
			})
		}

		return this.test({
			test: (value: any) => postalCode.regex.test(value),
			message: message ?? ((messages) => messages.string.postalCode(postalCode)),
			name: 'postalCode'
		})
	}
}

export const string = <
	Input extends string = string,
	Final = any
>() => {
	return new StringSchema<Input, Final>(); ;
}
