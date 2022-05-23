import { Schema, SchemaTypes } from '../core/schema';

export class BooleanSchema<Input = boolean> extends Schema<Input> {
	public type: SchemaTypes = SchemaTypes.BOOLEAN
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: boolean) => typeof value === 'boolean'
}

export const boolean = <Input = boolean>() => {
	return new BooleanSchema<Input>();
}
