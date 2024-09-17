/* eslint-disable no-useless-escape */
import { Schema } from '../core/schema';
import type { PhoneNumberInfo } from '../phoneNumbers';
import type { PostalCodeInfo } from '../postalCodes';
import { type NullableType } from '../types/SchemaMap';

const NUMERIC_PATTERN = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
const ALPHA_PATTERN = /^[a-zA-Z]+$/;
const ALPHANUM_PATTERN = /^[a-zA-Z0-9]+$/;
const ALPHADASH_PATTERN = /^[a-zA-Z0-9_-]+$/;
const HEX_PATTERN = /^[0-9a-fA-F]+$/;
const URL_PATTERN = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const PRECISE_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const CUID_PATTERN = /^c[^\s-]{8,}$/i;
const UUID_PATTERN = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const BASIC_PATTERN = /^\S+@\S+\.\S+$/;

export class StringSchema<
	Input extends NullableType<string> = string,
	Final = any
> extends Schema<Input, Final> {
	protected message: string = '{{key}} is not string';
	protected rule = (value: string) => typeof value === 'string';

	protected getRequiredStringCondition = (valueKey: string) => `if ( ${valueKey} === null || ${valueKey} === undefined || ${valueKey} === '' ){`;
	protected getNotRequiredStringCondition = (valueKey: string) => `if ( ${valueKey} !== null && ${valueKey} !== undefined && ${valueKey} !== '' ){`;

	/**
	 * Checks if has a size bigger than minValue
	 * @param minValue min string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public min(minValue: number, message?: string) {
		return this.test({
			is: (value) => value.length < minValue,
			message: message ?? ((messages) => messages.string.min(minValue)),
			name: `minLength_${minValue}_${message}`
		});
	}

	/**
	 * Checks if has a size smaller than maxValue
	 * @param maxValue max string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public max(maxValue: number, message?: string) {
		return this.test({
			is: (value) => value.length > maxValue,
			message: message ?? ((messages) => messages.string.max(maxValue)),
			name: `maxLength_${maxValue}_${message}`
		});
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
			is: (value) => value.length < minValue || value.length > maxValue,
			message: message ?? ((messages) => messages.number.between(minValue, maxValue)),
			name: `betweenString_${minValue}_${maxValue}_${message}`
		});
	}

	/**
	 * Checks if string has `maxValue` length
	 * @param length string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public length(length: number, message?: string) {
		return this.test({
			is: (value) => value.length !== length,
			message: message ?? ((messages) => messages.string.length(length)),
			name: `length_${length}_${message}`
		});
	}

	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public equals(value: string | string[], message?: string) {
		const is = Array.isArray(value)
			? (val: string) => !value.includes(val)
			: (val: string) => val !== value;
		
		return this.test({
			is: is as any,
			message: message ?? ((messages) => messages.string.equals(value)),
			name: `equalsString_${Array.isArray(value) ? value.join('_') : value}_${message}`
		});
	}

	/**
	 * Matches regular expression
	 * @param reg Regular expression
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public pattern(reg: RegExp, message?: string) {
		return this.test({
			is: (value) => !reg.test(value),
			message: message ?? ((messages) => messages.string.pattern(reg)),
			name: `pattern_${reg.source.replace(/(\W|\W|-)/g, '_')}`
		});
	}

	/**
	 * Checks if string is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public empty(message?: string) {
		return this.test({
			is: (value) => value.length !== 0,
			message: message ?? ((messages) => messages.string.empty),
			name: `empty_${message}`
		});
	}

	/**
	 * Checks if string contains value
	 * @param value value to check if contains
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public contains(value: string, message?: string) {
		return this.test({
			is: (val: any) => !val.includes(value),
			message: message ?? ((messages) => messages.string.contains(value)),
			name: `contains_${value}_${message}`
		});
	}

	/**
	 * Checks if string contains only numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public numeric(message?: string) {
		return this.test({
			is: (value) => value && !NUMERIC_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.numeric),
			name: `numeric_${message}`
		});
	}

	/**
	 * Checks if string contains only alpha characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alpha(message?: string) {
		return this.test({
			is: (value) => !ALPHA_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.alpha),
			name: `alpha_${message}`
		});
	}

	/**
	 * Checks if string contains only alpha-numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphanum(message?: string) {
		return this.test({
			is: (value) => !ALPHANUM_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.alphanum),
			name: `alphanum_${message}`
		});
	}

	/**
	 * Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.'
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public alphadash(message?: string) {
		return this.test({
			is: (value) => !ALPHADASH_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.alphadash),
			name: `alphadash_${message}`
		});
	}

	/**
	 * Checks if string is hexadecimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public hex(message?: string) {
		return this.test({
			is: (value) => value.length % 2 !== 0 || !HEX_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.hex),
			name: `hex_${message}`
		});
	}

	/**
	 * Checks if string is base64.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public base64(message?: string) {
		return this.test({
			is: (value) => !BASE64_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.base64),
			name: `base64_${message}`
		});
	}

	/**
	 * Checks if string is format uuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public uuid(message?: string) {
		return this.test({
			is: (value) => !UUID_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.uuid),
			name: `uuid_${message}`
		});
	}

	/**
	 * Checks if string is URL accepted
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public url(message?: string) {
		return this.test({
			is: (value) => !URL_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.url),
			name: `url_${message}`
		});
	}

	/**
	 * Checks if string is format cuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public cuid(message?: string) {
		return this.test({
			is: (value) => !CUID_PATTERN.test(value),
			message: message ?? ((messages) => messages.string.cuid),
			name: `cuid_${message}`
		});
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
			is: (value) => !pattern.test(value),
			message: message ?? ((messages) => messages.string.email),
			name: `email_${mode}_${message}`
		});
	}

	/**
	 * Checks if is a valid postalCode.
	 * @param postalCode postal code to validate or a function which we can return desired postal code
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public postalCode(
		postalCode: PostalCodeInfo | ((value: NonNullable<Input>, form: any) => PostalCodeInfo), 
		message?: string
	) {
		if ( typeof postalCode === 'function' ) {
			return this.test((value, form, { context }) => {
				const _postalCode = postalCode(value, form);
				if ( _postalCode.regex.test((value )) ) {
					return true;
				}

				return [
					{
						path: '',
						error: message ?? context.messages.string.postalCode(_postalCode)
					}
				];
			});
		}

		return this.test({
			is: (value) => !postalCode.regex.test(value),
			message: message ?? ((messages) => messages.string.postalCode(postalCode)),
			name: `postalCode_${postalCode.country}_${message}`
		});
	}

	/**
	 * Checks if is a valid phoneNumber.
	 * @param phoneNumber phone number to validate or a function which we can return desired phone number
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public phoneNumber(
		phoneNumber: PhoneNumberInfo | ((value: NonNullable<Input>, form: any) => PhoneNumberInfo), 
		message?: string
	) {
		if ( typeof phoneNumber === 'function' ) {
			return this.test((value, form, { context }) => {
				const _phoneNumber = phoneNumber(value, form);
				if ( _phoneNumber.regex.test((value )) ) {
					return true;
				}

				return [
					{
						path: '',
						error: message ?? context.messages.string.phoneNumber(_phoneNumber)
					}
				];
			});
		}

		return this.test({
			is: (value) => !phoneNumber.regex.test(value),
			message: message ?? ((messages) => messages.string.phoneNumber(phoneNumber)),
			name: `phoneNumber_${phoneNumber.country}_${message}`
		});
	}

	/**
	 * Checks if is a value of enum.
	 * @param enumObject enum
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	public enum<T extends { [name: string]: any }>(enumObject: T, message?: string) {
		const enumValues = Object.values(enumObject);

		return this.test({
			is: (value) => !enumValues.includes(value),
			message: message ?? ((messages) => messages.string.enum)
		}) as unknown as StringSchema<T[keyof T], Final>;
	}
}

export const string = <
	Input extends string = string,
	Final = any
>(message?: string) => new StringSchema<Input, Final>(message);
