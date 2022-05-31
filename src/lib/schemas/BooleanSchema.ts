import { Schema } from '../core/schema';
import { NullableType } from '../types/_types';
import { SchemaTypes } from '../utils/Utils';

export class BooleanSchema<
	Input extends NullableType<boolean> = boolean,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.BOOLEAN
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Input) => typeof value === 'boolean'
	
	constructor(message?: string) {
		super();

		this.message = message ?? this.message;
	}
}

export const boolean = <
	Input extends boolean = boolean,
	Final = any
>() => {
	return new BooleanSchema<Input, Final>();
}
