
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { RuleFn, SchemaTypes } from '../core/schema';
import { ObjectShape } from '../types/SchemaObject';

export class ObjectSchema<
	Input extends Record<string, any>,
	Final = Input
> extends ObjectTypedSchema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.OBJECT
	protected message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Input, Final> = (value: Input) => typeof value === 'object'

	constructor(schemas: ObjectShape<Input, Final>, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}
}

export const object = <
	Input extends Record<string, any>,
	Final = Input
>(
	schemas: ObjectShape<Input, Final>, 
	cb?: (schema: ObjectSchema<Input, Final>) => void
) => {
	const schema = new ObjectSchema<Input, Final>(schemas);

	cb && cb(schema);

	return schema;
}
