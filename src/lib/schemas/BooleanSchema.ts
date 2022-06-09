import { Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { NullableType } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class BooleanSchema<
	Input extends NullableType<boolean> = boolean,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.BOOLEAN
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Input) => typeof value === 'boolean'
	
	public clone() {
		return new BooleanSchema<Input, Final>(this.message, this.def)
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}
}

export const boolean = <
	Input extends boolean = boolean,
	Final = any
>() => {
	return new BooleanSchema<Input, Final>();
}
