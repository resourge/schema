import { type PhoneNumberInfo } from '../phoneNumbers';
import { type PostalCodeInfo } from '../postalCodes';
import { type MinDateMethod } from '../schemas/DateSchema';
import { type DateFormat } from '../types/DateFormat';

type BaseValidation = {
	/**
	 * Makes schema validation nullable (meaning value can be null).
	 */
	nullable?: boolean | string
	/**
	 * Makes schema validation optional (meaning value can be undefined).
	 */
	optional?: boolean | string
	/**
	 * Makes schema validation required (meaning value can not be undefined and null).
	 */
	required?: boolean | string
};

type DeepOmit<T, K> = T extends Primitive ? T : DeepOmitHelper<T, Exclude<keyof T, K>>; 

type DeepOmitArray<T extends any[], K> = {
	[P in keyof T]: DeepOmit<T[P], K>
};

type DeepOmitHelper<T, K extends keyof T> = {
	[P in K]: // extra level of indirection needed to trigger homomorhic behavior 
	T[P] extends infer TP // distribute over unions
		? TP extends Primitive ? TP // leave primitives and functions alone
			: TP extends any[] ? DeepOmitArray<TP, K> // Array special handling
				: DeepOmit<TP, K> 
		: never
}; 

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type Primitive = boolean | Function | null | number | string | symbol | undefined;

export type JsonSchemaArrayValidationType = BaseValidation & {
	/**
	 * Checks if is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	empty?: boolean | string
	/**
	 * Checks if array has "length" number of elements
	 * @param length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	length?: {
		length: number
		message?: string
	}
	/**
	 * Checks if has a maximal number of elements
	 * @param maxValue
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	max?: {
		maxValue: number
		message?: string
	}
	/**
	 * Checks if has a minimal number of items in array
	 * @param minValue
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	min?: {
		message?: string
		minValue: number
	}
	/**
	 * Checks if has only unique elements
	 *
	 * Note: This only check basic values, like numbers, string, boolean.
	 * For object arrays and more complex values use {@link ArraySchema#uniqueBy}
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	unique?: boolean | string
	/**
	 * Checks if has only unique elements by key
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	uniqueBy?: {
		key: number | string | symbol
		message?: string
	}
};

export type JsonSchemaBooleanValidationType = BaseValidation & {
	/**
	 * Checks if is true or false
	 * @param mustBeValue
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	mustBe?: {
		message?: string
		mustBeValue: boolean
	}
};

export type JsonSchemaDateValidationType = BaseValidation & {
	/**
	 * Checks if is date is equal than maxDate
	 * @param date
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	equals?: {
		date: Date | MinDateMethod<unknown>
		format?: DateFormat | undefined
		message?: string
	}
	/**
	 * Checks if is date is smaller than maxDate
	 * @param maxDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	maxDate?: {
		format?: DateFormat | undefined
		maxDate: Date | MinDateMethod<unknown>
		message?: string
	}
	/**
	 * Checks if is date is bigger than minDate
	 * @param minDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	minDate?: {
		format?: DateFormat | undefined
		message?: string
		minDate: Date | MinDateMethod<unknown>
	}
	/**
	 * Checks if is today
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	today?: boolean | string
};

export type JsonSchemaNumberValidationType = BaseValidation & {
	/**
	 * Checks if is between minValue and maxValue.
	 * @param minValue min number value
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	between?: {
		maxValue: number
		message?: string
		minValue: number
	}
	/**
	 * Checks if is decimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	decimal?: {
		decimal: number
		message?: string
	}
	/**
	 * Checks if is a value of enum.
	 * @param enumObject enum
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	enum?: {
		enumObject: Record<string, any>
		message?: string
	}
	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	equals?: {
		message?: string
		value: number | number[]
	}
	/**
	 * Checks if is integer.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	integer?: boolean | string
	/**
	 * Checks if is smaller than maxValue.
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	max?: {
		maxValue: number
		message?: string
	}
	/**
	 * Checks if is bigger than minValue.
	 * @param minValue min number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	min?: {
		message?: string
		minValue: number
	}
	/**
	 * Checks if is negative value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	negative?: boolean | string
	/**
	 * Checks if is positive value.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	positive?: boolean | string
};

export type JsonSchemaObjectValidationType = BaseValidation & {
	oneOf?: {
		message?: string
		properties: Record<string, DeepOmit<JsonSchemaValidationType, 'ui'>>
	}
};

export type JsonSchemaStringValidationType = BaseValidation & {
	/**
	 * Checks if string contains only alpha characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	alpha?: boolean | string
	/**
	 * Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.'
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	alphadash?: boolean | string
	/**
	 * Checks if string contains only alpha-numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	alphanum?: boolean | string
	/**
	 * Checks if string is base64.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	base64?: boolean | string
	/**
	 * Checks if is between minValue and maxValue.
	 * @param minValue min number value
	 * @param maxValue max number value
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	between?: {
		maxValue: number
		message?: string
		minValue: number
	}
	/**
	 * Checks if string contains value
	 * @param value value to check if contains
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	contains?: {
		message?: string
		value: string
	}
	/**
	 * Checks if string is format cuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	cuid?: boolean | string
	/**
	 * Checks if is a valid email.
	 * @param mode @option Defines if is basic or precise validation
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	email?:
		| boolean
		| {
			message?: string
			mode?: 'basic' | 'precise'
		}
	/**
	 * Checks if string is empty
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	empty?: boolean | string
	/**
	 * Checks if is a value of enum.
	 * @param enumObject enum
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	enum?: {
		enumObject: Record<string, any>
		message?: string
	}
	/**
	 * Checks if is equal to value.
	 * @param value to equal
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	equals?: {
		message?: string
		value: string | string[]
	}
	/**
	 * Checks if string is hexadecimal.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	hex?: boolean | string
	/**
	 * Checks if string has `maxValue` length
	 * @param length string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	length?: {
		length: number
		message?: string
	}
	/**
	 * Checks if has a size smaller than maxValue
	 * @param maxValue max string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	max?: {
		maxValue: number
		message?: string
	}
	/**
	 * Checks if has a size bigger than minValue
	 * @param minValue min string length
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	min?: {
		message?: string
		minValue: number
	}
	/**
	 * Checks if string contains only numeric characters
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	numeric?: boolean | string
	/**
	 * Matches regular expression
	 * @param reg Regular expression
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	pattern?: {
		message?: string
		reg: RegExp
	}
	/**
	 * Checks if is a valid phoneNumber.
	 * @param phoneNumber phone number to validate or a function which we can return desired phone number
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	phoneNumber?: {
		message?: string
		phoneNumber: PhoneNumberInfo
	}
	/**
	 * Checks if is a valid postalCode.
	 * @param postalCode postal code to validate or a function which we can return desired postal code
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	postalCode?: {
		message?: string
		postalCode: PostalCodeInfo
	}
	/**
	 * Checks if string is URL accepted
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	url?: boolean | string
	/**
	 * Checks if string is format uuid.
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	uuid?: boolean | string
};

export type JsonSchemaValidationType =
	| JsonSchemaArrayValidationType
	| JsonSchemaBooleanValidationType
	| JsonSchemaDateValidationType
	| JsonSchemaNumberValidationType
	| JsonSchemaObjectValidationType
	| JsonSchemaStringValidationType;
