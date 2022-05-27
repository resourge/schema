
export const defaultMessages = {
	array: {
		empty: 'Needs to be empty',
		min: (minValue: number) => minValue === 1 ? `Requires at least ${minValue} item` : `Requires at least ${minValue} items`,
		max: (maxValue: number) => maxValue === 1 ? `Requires max ${maxValue} item` : `Requires max ${maxValue} items`,
		length: (length: number) => length === 1 ? `Requires the ${length} item` : `Requires the ${length} items`,
		unique: 'Value is not unique',
		uniqueBy: 'Value is not unique'
	},
	date: {
		today: 'Is not today\'s date'
	},
	number: {
		min: (minValue: number) => `Requires value to be at least ${minValue}`,
		max: (maxValue: number) => `Requires value to be max ${maxValue}`,
		equals: (equalsValue: number) => `Requires value to ${equalsValue}`,
		integer: 'Requires value to not have decimal',
		decimal: (equalsValue: number) => `Requires value to have ${equalsValue} decimal`,
		positive: 'Requires value to be positive',
		negative: 'Requires value to be negative'
	},
	string: {
		min: (minValue: number) => `Requires string to have at least size ${minValue}`,
		max: (maxValue: number) => `Requires string to have max size ${maxValue}`,
		length: (equalsValue: number) => `Requires string to have size ${equalsValue}`,
		pattern: (reg: RegExp) => `Requires string to match ${reg.toString()}`,
		empty: 'Requires string to be empty',
		contains: (value: string) => `Requires string to contain ${value}`,
		numeric: 'Requires string to be numeric',
		alpha: 'Requires string to be alpha',
		alphanum: 'Requires string to be alpha-numeric',
		alphadash: 'Requires string to be alpha-dash',
		hex: 'Requires string to be hexadecimal',
		base64: 'Requires string to be base64',
		uuid: 'Requires string to be format (00000000-0000-0000-0000-000000000000)',
		cuid: 'Requires string to be format cuid',
		url: 'Requires string to be format url',
		singleLine: 'Requires string to be in single line',
		email: 'Requires string to be format email'
	},
	notOptional: 'Not optional item',
	notNullable: 'Not optional item',
	required: 'Required item'
} as const

export type MessageType = typeof defaultMessages
