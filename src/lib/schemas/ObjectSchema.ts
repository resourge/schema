
import { shallowClone } from '@resourge/shallow-clone';

import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { NullableType, SchemaMap } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class ObjectSchema<
	Input extends NullableType<object> = object,
	Final = any
> extends ObjectTypedSchema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.OBJECT
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: any) => typeof value === 'object'

	constructor(schemas: SchemaMap<Input>, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}

	public extend<
		TInput extends Input = Input,
		TFinal extends Final = Final
	>(schemas: SchemaMap<TInput>): ObjectSchema<TInput, TFinal> {
		Object.keys(schemas)
		.forEach((key) => {
			// @ts-expect-error // this will never be undefined but typescript can't comprehend that
			this.shape.push([key, schemas[key as keyof SchemaMap<Input>]])
		})

		return shallowClone(this) as unknown as ObjectSchema<TInput, TFinal>;
	}
}

export const object = <
	Input extends object = object,
>(
	schemas: SchemaMap<Input>
) => {
	return new ObjectSchema<Input>(schemas);
}
