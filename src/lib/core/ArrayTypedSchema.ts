import { ArrayShape } from '../types/SchemaObject';

import { PrivateSchema } from './ObjectTypedSchema';
import { CompileSchemaConfig, Schema } from './schema';

export abstract class ArrayTypedSchema<
	Input extends any[],
	Final = Input
> extends Schema<Input, Final> {
	protected readonly _shape!: ArrayShape<Input, Final>;
	protected schema: PrivateSchema

	constructor(schema: ArrayShape<Input, Final>) {
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
			path: `${path ?? ''}[\${${iKey}}]`
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
