
import { Schema } from '../core/schema';
import { SchemaTypes } from '../utils/Utils';

export class AnySchema<
	Input extends any = any, 
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.ARRAY
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = () => true
	
	constructor(message?: string) {
		super();

		this.message = message ?? this.message;
	}
}

export const any = <
	Input extends any = any,
	Final = any,
>(message?: string) => {
	return new AnySchema<Input, Final>(message);
}
