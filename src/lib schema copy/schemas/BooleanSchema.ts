import { Schema, SchemaTypes } from '../core/schema';

export class BooleanSchema<
	Input extends boolean = boolean,
	Final = Input
> extends Schema<Input, Input, Final> {
	public type: SchemaTypes = SchemaTypes.BOOLEAN
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: Input) => typeof value === 'boolean'
}

export const boolean = <
	Input extends boolean = boolean,
	Final = Input
>() => {
	return new BooleanSchema<Input, Final>();
}
