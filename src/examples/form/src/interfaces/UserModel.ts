import { useForm, OnlyOnTouch } from '@resourge/react-form'

import { number, object, string, array } from '../../../../lib';
import { PhoneNumbers } from '../../../../lib/phoneNumbers';
import { PostalCodes } from '../../../../lib/postalCodes';

type OptionType = {
	value: string
	label: string
}

enum HobbiesEnum {
	Games = 'Games',
	Exercise = 'Exercise',
	Read = 'Read',
	Study = 'Study'
}

export const locationCitiesOptions: OptionType[] = [
	{ label: 'Porto', value: 'porto' },
	{ label: 'Lisboa', value: 'Lisboa' }
]

export type LocationType = {
	city: string
	address: string
	postalCode: string
	country: string
}

export type UserType = {
	name: string
	age: number
	location: LocationType
	hobbies: Array<keyof typeof HobbiesEnum>
}

enum GenderEnum {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other'
}

export class UserModel {
	public name = ''
	public age = 16
	public phoneNumber = ''
	public nif = ''
	public gender: {
		type: GenderEnum,
		other?: string
	} = {
		type: GenderEnum.MALE
	}
	public location: LocationType = { address: '', city: '', postalCode: '', country: '' }
	public hobbies: Array<HobbiesEnum> = []

	constructor(model?: UserType) {
		if (model) {
			this.name = model.name
			this.age = model.age
			this.location = model.location
		}
	}
}

const schema = object<UserModel>({
	name: string().min(5).required(),
	age: number().min(18).required(),
	nif: string().onlyOnTouch(
		(schema) => schema.asyncTest({
		is: (value, parent, config) => Promise.resolve(true),
		message: 'Async error'
		})
	),
	phoneNumber: string().phoneNumber(PhoneNumbers.pt_PT).required(),
	location: object({
		city: string().required(),
		address: string().required(),
		postalCode: string().postalCode(PostalCodes.PT).required(),
		country: string().min(3).required(),
	}).required(),
	gender: object({
		type: string().enum(GenderEnum),
		other: string().when({
			is: (otherValue, parent) => parent.type === GenderEnum.OTHER,
			then: (schema) => schema.required()
		})
	}),
	hobbies: array(string().enum(HobbiesEnum)).min(1).required(),
}).compile();

export const useUserModel = (model?: UserType) => {
	return useForm<UserModel>(new UserModel(model), {
		validate: (form: UserModel, changedKeys: OnlyOnTouch<UserModel>) => {
			return schema.validate(form, changedKeys)
		},
	})
}
