import { ZodTypeAny } from '../types/SchemaObject';

import { PrivateSchema } from './ObjectTypedSchema';
import { CompileSchemaConfig, Schema, SchemaTypes } from './schema';

export class ArrayTypedSchema<
	T extends ZodTypeAny,
	Final = Array<T['_input']>
> extends Schema<
	Array<T['_output']>,
	Array<T['_input']>, 
	Final
> {
	readonly _shape!: T;
	protected schema: PrivateSchema

	public type: SchemaTypes = SchemaTypes.ARRAY
	public message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Array<T['_input']>) => Array.isArray(value)

	constructor(schema: T) {
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
