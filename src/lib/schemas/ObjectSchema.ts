
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { SchemaMap } from '../types/_types';
import { SchemaTypes } from '../utils/Utils';

export class ObjectSchema<
	Input extends object = object,
	Final = any
> extends ObjectTypedSchema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.OBJECT
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: any) => typeof value === 'object'

	constructor(schemas: SchemaMap<Input>, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}
}

export const object = <
	Input extends object = object,
>(
	schemas: SchemaMap<Input>
) => {
	return new ObjectSchema<Input>(schemas);
}
