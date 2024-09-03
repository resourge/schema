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
		const iKey = `i${context.index = context.index + 1}`;

		return super.compileSchema({
			context, 
			key, 
			srcCode: [
				`const l = ${this.getValueKey(key)}.length;`,
				`for (var ${iKey} = 0; ${iKey} < l; ${iKey}++) {`,
				...(
					this.schema.compileSchema({
						context, 
						key: `${key ?? ''}[${iKey}]`, 
						path: `${path ?? ''}[\${${iKey}}]`
					})
				),
				'}'
			], 
			path
		});
	}
}
