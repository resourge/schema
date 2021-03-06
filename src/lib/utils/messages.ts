import { PostalCodeInfo } from '../postalCodes'

enum FormatInvalidTypeEnum {
	'enum' = 'enum',
	'numeric' = 'number',
	'alpha' = 'text',
	'alphanum' = 'alpha numeric',
	'alphadash' = 'alpha dash',
	'hexadecimal' = 'hexadecimal',
	'hex' = 'hex',
	'base64' = 'base64',
	'uuid' = 'uuid',
	'cuid' = 'cuid',
	'url' = 'url',
	'singleLine' = 'single line',
	'email' = 'email',
	'postalCode' = 'postal code', // TODO remove from this
}

const getInvalidFormatMessage = (type: keyof typeof FormatInvalidTypeEnum) => {
	return `Invalid ${FormatInvalidTypeEnum[type]} format`
}

export const defaultMessages = {
	array: {
		empty: 'Requires to be empty',
		min: (minValue: number) => minValue === 1 ? `Requires at least ${minValue} item` : `Requires at least ${minValue} items`,
		max: (maxValue: number) => maxValue === 1 ? `Requires maximum of ${maxValue} item` : `Requires maximum of ${maxValue} items`,
		length: (length: number) => length === 1 ? `Requires ${length} item` : `Requires ${length} items`,
		unique: 'Requires to be unique',
		uniqueBy: 'Requires to be unique'
	},
	boolean: {
		mustBe: (mustBeValue: boolean) => `Must be ${mustBeValue.toString()}`
	},
	date: {
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
		negative: 'Requires to be negative number'
	},
	string: {
		min: (minValue: number) => `Requires to have at least minimum size of ${minValue}`,
		max: (maxValue: number) => `Requires to have maximum size of ${maxValue}`,
		length: (equalsValue: number) => `Requires string to have size ${equalsValue}`,
		equals: (equalsValue: string | string[]) => `Needs to be the same as ${Array.isArray(equalsValue) ? equalsValue.join(' or ') : equalsValue}`,
		pattern: (_reg: RegExp) => 'Invalid format',
		empty: 'Requires string to be empty',
		contains: (value: string) => `Requires ${value}`,
		numeric: getInvalidFormatMessage('numeric'),
		alpha: getInvalidFormatMessage('alpha'),
		alphanum: getInvalidFormatMessage('alphanum'),
		alphadash: getInvalidFormatMessage('alphadash'),
		hex: getInvalidFormatMessage('hexadecimal'),
		base64: getInvalidFormatMessage('base64'),
		uuid: getInvalidFormatMessage('uuid'),
		cuid: getInvalidFormatMessage('cuid'),
		url: getInvalidFormatMessage('url'),
		singleLine: getInvalidFormatMessage('singleLine'),
		email: getInvalidFormatMessage('email'),
		enum: getInvalidFormatMessage('enum'),
		postalCode: ({ format }: PostalCodeInfo) => `Invalid format needs to be like ${format}`
	},
	notOptional: 'Not optional item',
	notNullable: 'Not optional item',
	required: 'Required item'
} as const

export type MessageType = typeof defaultMessages
