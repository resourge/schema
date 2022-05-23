import { Schema, SchemaTypes } from '../core/schema';

export class BooleanSchema extends Schema<boolean> {
	public type: SchemaTypes = SchemaTypes.BOOLEAN
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: boolean) => typeof value === 'boolean'
}

export const boolean = () => {
	return new BooleanSchema();
}
