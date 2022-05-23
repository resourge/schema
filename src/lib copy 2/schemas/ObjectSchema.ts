
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { RuleFn, Schema, SchemaTypes } from '../core/schema';
import { ObjectShape } from '../types/SchemaObject';

export class ObjectSchema<
	Input extends Record<string, any>,
	S extends ObjectShape<Input> = ObjectShape<Input>
> extends ObjectTypedSchema<Input> {
	public type: SchemaTypes = SchemaTypes.OBJECT
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Record<string, any>, '', Record<string, any>> = (value: any) => typeof value === 'object'

	constructor(schemas: S, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}
}

type B<S extends ObjectShape<any>> = {
	[K in keyof S]: S[K] extends Schema<any> ? S[K]['_input'] : never
}

export const object = <
	S extends ObjectShape<any>
>(schemas: S, message?: string): ObjectSchema<B<S>, S> => {
	return new ObjectSchema<B<S>>(schemas, message);
}
