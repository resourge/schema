
import { ArrayTypedSchema } from '../core/ArrayTypedSchema';
import { RuleFn, Schema, SchemaTypes } from '../core/schema';

export class ArraySchema<
	Input, 
	Shape extends Schema = Schema
> extends ArrayTypedSchema<Input, Shape> {
	public type: SchemaTypes = SchemaTypes.ARRAY
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Input, '', Input> = (value: Input) => Array.isArray(value)

	constructor(schema: Shape, message?: string) {
		super(schema);

		this.message = message ?? this.message;
	}
}

export const array = <
	Input, 
	Shape extends Schema = Schema
>(schemas: Shape, message?: string) => {
	return new ArraySchema<Input, Shape>(schemas, message);
}
