
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { RuleFn, SchemaTypes } from '../core/schema';
import { ObjectShape } from '../types/SchemaObject';

export class ObjectSchema<
	Input extends Record<string, any>
> extends ObjectTypedSchema<Input> {
	public type: SchemaTypes = SchemaTypes.OBJECT
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Record<string, any>, '', Record<string, any>> = (value: any) => typeof value === 'object'

	constructor(schemas: ObjectShape<Input>, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}
}

export const object = <
	Input extends Record<string, any>
>(
	schemas: ObjectShape<Input>, 
	cb?: (schema: ObjectSchema<Input>) => void
): ObjectSchema<Input> => {
	const schema = new ObjectSchema<Input>(schemas, '');

	cb && cb(schema);

	return schema;
}
