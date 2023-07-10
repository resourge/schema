
import { type Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { SchemaTypes } from '../utils/Utils';

export class AnySchema<
	Input = any, 
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.ARRAY
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = () => true
	
	protected clone() {
		return new AnySchema(this.message, this.def)
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}
}

export const any = <
	Input = any,
	Final = any,
>(message?: string) => {
	return new AnySchema<Input, Final>(message);
}
