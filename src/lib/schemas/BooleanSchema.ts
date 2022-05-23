import { Schema, SchemaTypes } from '../core/schema';

export class BooleanSchema<
	Input = boolean,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.BOOLEAN
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Input) => typeof value === 'boolean'
}

export const boolean = <
	Input extends boolean,
	Final = Input
>(
	cb?: (schema: BooleanSchema<Input, Final>) => void
) => {
	const schema = new BooleanSchema<Input, Final>();

	cb && cb(schema);

	return schema;
}
