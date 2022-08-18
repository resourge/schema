import { useForm } from '@resourge/react-form'

import { number, object, PostalCodes, string } from '../../../../lib';
import { PhoneNumbers } from '../../../../lib/phoneNumbers';

type OptionType = {
	value: string
	label: string
}

enum HobbiesEnum {
	'Games',
	'Exercise',
	'Read',
	'Study'
}

export const locationCitiesOptions: OptionType[] = [
	{ label: 'Porto', value: 'porto' },
	{ label: 'Lisboa', value: 'Lisboa' }
]

export type LocationType = {
	city: string
	address: string
	postalCode: string
	phoneNumber: string

}

export type UserType = {
	name: string
	age: number
	location: LocationType
	hobbies: Array<keyof typeof HobbiesEnum>
}

export class UserModel {
	public name = ''
	public age = 16
	public location: LocationType = { address: '', city: '', postalCode: '', phoneNumber: '' }
	public hobbies: Array<keyof typeof HobbiesEnum> = []

	constructor(model?: UserType) {
		if (model) {
			this.name = model.name
			this.age = model.age
			this.location = model.location
		}
	}
}

const schema = object<UserModel>({
	name: string().min(10).required(),
	age: number().min(16).required(),
	location: object({
		city: string().required(),
		address: string().required(),
		postalCode: string().postalCode(PostalCodes.PT).required(),
		phoneNumber: string().phoneNumber(PhoneNumbers.am_AM).required()
	})
}).compile();

export const useUserModel = (model?: UserType) => {
	return useForm<UserModel>(new UserModel(model), {
		validate: (form: UserModel, changedKeys) => {
			return schema.validate(form, changedKeys)
		},
	})
}
