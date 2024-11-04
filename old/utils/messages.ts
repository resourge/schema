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
		min: (minValue: number) => `Requires at least ${minValue} item${minValue === 1 ? 's' : ''}`,
		max: (maxValue: number) => `Requires maximum of ${maxValue} item${maxValue === 1 ? 's' : ''}`,
		length: (length: number) => `Requires ${length} item${length === 1 ? 's' : ''}`,
		unique: 'Requires to be unique',
		uniqueBy: 'Requires to be unique'
	},
	boolean: {
		mustBe: (mustBeValue: boolean) => `Must be ${mustBeValue.toString()}`
	},
	date: {
		equals: (date: Date | ((...args: any[]) => any), format: DateFormat) => typeof date === 'function' ? 'Date is not equal' : `Requires to be at equal to date ${date.toLocaleString()}`,
		maxDate: (maxDate: Date | ((...args: any[]) => any), format: DateFormat) => typeof maxDate === 'function' ? 'Date is not bigger than min date' : `Requires to be at smaller than date ${maxDate.toLocaleString()}`,
		minDate: (minDate: Date | ((...args: any[]) => any), format: DateFormat) => typeof minDate === 'function' ? 'Date is not smaller than max date' : `Requires to be at bigger than date ${minDate.toLocaleString()}`,
		today: 'Requires to be today\'s date'
	},
	number: {
		min: (minValue: number) => `Requires to be at least ${minValue}`,
		max: (maxValue: number) => `Requires to be maximum of ${maxValue}`,
		between: (minValue: number, maxValue: number) => `Requires to be between ${minValue} and ${maxValue}`,
		equals: (equalsValue: number | number[]) => `Needs to be the same as ${Array.isArray(equalsValue) ? equalsValue.join(' or ') : equalsValue}`,
		integer: 'Requires to be a integer number',
		decimal: (equalsValue: number) => `Requires to have ${equalsValue} decimal number`,
		positive: 'Requires to be positive number',
		negative: 'Requires to be negative number',
		enum: getInvalidFormatMessage('enum')
	},
	string: {
		min: (minValue: number) => `Requires to have at least minimum size of ${minValue}`,
		max: (maxValue: number) => `Requires to have maximum size of ${maxValue}`,
		length: (equalsValue: number) => `Requires string to have size ${equalsValue}`,
		equals: (equalsValue: string | string[]) => `Needs to be the same as ${Array.isArray(equalsValue) ? equalsValue.join(' or ') : equalsValue}`,
		pattern: (reg: RegExp) => 'Invalid format',
		empty: 'Requires string to be empty',
		contains: (value: string) => `Requires ${value}`,
		numeric: getInvalidFormatMessage('number'),
		alpha: getInvalidFormatMessage('text'),
		alphanum: getInvalidFormatMessage('alpha numeric'),
		alphadash: getInvalidFormatMessage('alpha dash'),
		hex: getInvalidFormatMessage('hexadecimal'),
		base64: getInvalidFormatMessage('base64'),
		uuid: getInvalidFormatMessage('uuid'),
		cuid: getInvalidFormatMessage('cuid'),
		url: getInvalidFormatMessage('url'),
		singleLine: getInvalidFormatMessage('single line'),
		email: getInvalidFormatMessage('email'),
		enum: getInvalidFormatMessage('enum'),
		postalCode: ({ format }: PostalCodeInfo) => `Invalid format needs to be like ${format}`,
		phoneNumber: ({ countryCode }: PhoneNumberInfo) => `Invalid phone format ${countryCode ? '(' + countryCode + ')' : ''} `
	},
	notOptional: 'Not optional item',
	notNullable: 'Not optional item',
	required: 'Required item'
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
