import { type ObjectPropertiesSchema } from '../types/SchemaMap';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/types';

import { type Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ArrayTypedSchema<
	Input extends any[] = any[],
	Final = any,
	S extends ObjectPropertiesSchema<Input[number], Final> = ObjectPropertiesSchema<Input[number], Final>
> extends Schema<Input, Final> {
	protected schema: PrivateSchema;

	constructor(schema: S, def?: Definitions) {
		super(def);
		this.schema = schema as unknown as PrivateSchema;
	}

	protected override compileSchema({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		const valueKey = this.getValueKey(key);

		const index = context.index = context.index + 1;

		const iKey = `i${index}`;

		const schemaRules = this.schema.compileSchema({
			context, 
			key: `${key ?? ''}[${iKey}]`, 
			path: `${path ?? ''}[\${${iKey}}]`
		});

		const arraySchemaRules = [
			`const l = ${valueKey}.length;`,
			`for (var ${iKey} = 0; ${iKey} < l; ${iKey}++) {`,
			...schemaRules,
			'}'
		];

		return super.compileSchema({
			context, 
			key, 
			srcCode: arraySchemaRules, 
			path
		});
	}
}
