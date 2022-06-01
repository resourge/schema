import { useForm } from '@resourge/react-form'

import { array, number, object, string } from '../../../../lib';

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
	public location: LocationType = { address: '', city: '', postalCode: '' }
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
		// eslint-disable-next-line prefer-regex-literals
		postalCode: string().pattern(RegExp('\d{4}([\-]\d{3})?')).required()
	})
}).compile();

export const useUserModel = (model?: UserType) => {
	return useForm<UserModel>(new UserModel(model), {
		validate: async (form: UserModel) => {
			const errors = await schema.validate(form)
			if (errors.length > 0) {
				return await Promise.reject(errors)
			}
		},
		onErrors: (errors) => {
			/// This method changes the native `isValid`
			return errors.map((error: any) => ({ path: error.key, errors: [error.error] }))
		},
		validateDefault: true 
	})
}
