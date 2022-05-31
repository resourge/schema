import { useForm } from '@resourge/react-form'

import { number, object, string } from '../../../../lib';
export type UserType = {
	name: string
	age: number
}

export class UserModel {
	public name = ''
	public age = 0

	constructor(model?: UserType) {
		if (model) {
			this.name = model.name
			this.age = model.age
		}
	}
}

const schema = object<UserModel>({
	name: string().min(3).required(),
	age: number().min(3).required()
}).compile();

export const useUserModel = (model?: UserType) => {
	return useForm<UserModel>(new UserModel(model), {
		validate: (form: UserModel) => {
			schema.validate(form)
		},
		validateDefault: true 
	})
}
