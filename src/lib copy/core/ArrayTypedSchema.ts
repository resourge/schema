import { ArrayShape } from '../types/SchemaObject';

import { PrivateSchema } from './ObjectTypedSchema';
import { CompileSchemaConfig, RuleFn, Schema, SchemaTypes } from './schema';

export class ArrayTypedSchema<
	Input extends any[]
> extends Schema<Input> {
	readonly _shape!: ArrayShape<Input>;
	protected schema: PrivateSchema

	public type: SchemaTypes = SchemaTypes.ARRAY
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<any[], '', any[]> = (value: any[]) => Array.isArray(value)

	constructor(schema: ArrayShape<Input>) {
		super();
		this.schema = schema as unknown as PrivateSchema
	}

	protected override compileSchema({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		const valueKey = this.getValueKey(key)

		const index = context.index = context.index + 1;

		const iKey = `i${index}`;

		const schemaRules = this.schema.compileSchema({
			context, 
			key: `${key ?? ''}[${iKey}]`, 
			path: `${path ?? ''}['+ ${iKey} +']`
		});

		const arraySchemaRules = [
			`for (let ${iKey} = 0; ${iKey} < ${valueKey}.length; ${iKey}++) {`,
			...schemaRules,
			'}'
		]

		return super.compileSchema({
			context, 
			key, 
			srcCode: arraySchemaRules, 
			path
		});
	}
}
