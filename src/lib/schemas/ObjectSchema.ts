
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { RuleFn, SchemaTypes } from '../core/schema';
import { SchemaObject } from '../types/SchemaObject';

export class ObjectSchema<
	Input extends Record<string, any>, 
	Shape extends SchemaObject<Input> = SchemaObject<Input>
> extends ObjectTypedSchema<Input, Shape> {
	public type: SchemaTypes = SchemaTypes.OBJECT
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Input, '', Input> = (value: Input) => typeof value === 'object'

	constructor(schemas: Shape, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}
}

export const object = <
	Input, 
	Shape extends SchemaObject<Input> = SchemaObject<Input>
>(schemas: Shape, message?: string) => {
	return new ObjectSchema<Input, Shape>(schemas, message);
}
