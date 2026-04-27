/* eslint-disable @typescript-eslint/no-unused-vars */
import deepmerge from '@fastify/deepmerge';

import { type PhoneNumberInfo } from '../phoneNumbers';
import { type PostalCodeInfo } from '../postalCodes';
import { type DateFormat } from '../types/DateFormat';
import { type DeepPartial } from '../types/types';

const getInvalidFormatMessage = (type: string) => `Invalid ${type} format`;

export let defaultMessages = {
	any: {
		enum: getInvalidFormatMessage('enum')
	},
	array: {
		empty: 'Requires to be empty',
		length: (length: number) => `Requires ${length} item${length === 1
			? 's'
			: ''}`,
		max: (maxValue: number) => `Requires maximum of ${maxValue} item${maxValue === 1
			? 's'
			: ''}`,
		min: (minValue: number) => `Requires at least ${minValue} item${minValue === 1
			? 's'
			: ''}`,
		unique: 'Requires to be unique',
		uniqueBy: 'Requires to be unique'
	},
	boolean: {
		mustBe: (mustBeValue: boolean) => `Must be ${mustBeValue.toString()}`
	},
	date: {
		equals: (date: ((...args: any[]) => any) | Date, format: DateFormat) => (typeof date === 'function'
			? 'Date is not equal'
			: `Requires to be at equal to date ${date.toLocaleString()}`),
		maxDate: (maxDate: ((...args: any[]) => any) | Date, format: DateFormat) => (typeof maxDate === 'function'
			? 'Date is not bigger than min date'
			: `Requires to be at smaller than date ${maxDate.toLocaleString()}`),
		minDate: (minDate: ((...args: any[]) => any) | Date, format: DateFormat) => (typeof minDate === 'function'
			? 'Date is not smaller than max date'
			: `Requires to be at bigger than date ${minDate.toLocaleString()}`),
		today: 'Requires to be today\'s date'
	},
	notNullable: 'Not optional item',
	notOptional: 'Not optional item',
	number: {
		between: (minValue: number, maxValue: number) => `Requires to be between ${minValue} and ${maxValue}`,
		decimal: (equalsValue: number) => `Requires to have ${equalsValue} decimal number`,
		enum: getInvalidFormatMessage('enum'),
		equals: (equalsValue: number | number[]) => `Needs to be the same as ${Array.isArray(equalsValue)
			? equalsValue.join(' or ')
			: equalsValue}`,
		integer: 'Requires to be a integer number',
		max: (maxValue: number) => `Requires to be maximum of ${maxValue}`,
		min: (minValue: number) => `Requires to be at least ${minValue}`,
		negative: 'Requires to be negative number',
		positive: 'Requires to be positive number'
	},
	required: 'Required item',
	string: {
		alpha: getInvalidFormatMessage('text'),
		alphadash: getInvalidFormatMessage('alpha dash'),
		alphanum: getInvalidFormatMessage('alpha numeric'),
		base64: getInvalidFormatMessage('base64'),
		contains: (value: string) => `Requires ${value}`,
		cuid: getInvalidFormatMessage('cuid'),
		email: getInvalidFormatMessage('email'),
		empty: 'Requires string to be empty',
		enum: getInvalidFormatMessage('enum'),
		equals: (equalsValue: string | string[]) => `Needs to be the same as ${Array.isArray(equalsValue)
			? equalsValue.join(' or ')
			: equalsValue}`,
		hex: getInvalidFormatMessage('hexadecimal'),
		length: (equalsValue: number) => `Requires string to have size ${equalsValue}`,
		max: (maxValue: number) => `Requires to have maximum size of ${maxValue}`,
		min: (minValue: number) => `Requires to have at least minimum size of ${minValue}`,
		numeric: getInvalidFormatMessage('number'),
		pattern: (reg: RegExp) => 'Invalid format',
		phoneNumber: ({ countryCode }: PhoneNumberInfo) => `Invalid phone format ${countryCode
			? '(' + countryCode + ')'
			: ''} `,
		postalCode: ({ format }: PostalCodeInfo) => `Invalid format needs to be like ${format}`,
		singleLine: getInvalidFormatMessage('single line'),
		url: getInvalidFormatMessage('url'),
		uuid: getInvalidFormatMessage('uuid')
	}
} as const;

export type MessageType = typeof defaultMessages;

const deepMerge = deepmerge();

/**
 * Method to replace default messages.
 * @param newDefaultMessages 
 */
export function setupDefaultMessage(newDefaultMessages: DeepPartial<MessageType>) {
	defaultMessages = deepMerge(defaultMessages, newDefaultMessages) as MessageType;
}
