import { type ObjectPropertiesSchema } from '../types/SchemaMap';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/SchemaTypes';

import { type Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ArrayTypedSchema<
	Input extends any[] = any[],
	Final = any,
	S extends ObjectPropertiesSchema<Input[number], Final> = ObjectPropertiesSchema<Input[number], Final>
> extends Schema<Input, Final> {
	protected schema: PrivateSchema;

	constructor(schema: S, message?: string, def?: Definitions) {
		super(message, def);
		this.schema = schema as unknown as PrivateSchema;
	}

	protected override compileSchema({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		return super.compileSchema({
			context, 
			key, 
			srcCode: [
				`const l = ${this.getValueKey(key)}.length;`,
				'for (let i = 0; i < l; i++) {',
				...this.schema.compileSchema({
					context, 
					key: `${key ?? ''}[i]`, 
					path: `${path ?? ''}[\${i}]`
				}),
				'}'
			], 
			path
		});
	}
}
