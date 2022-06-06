import { SchemaMap } from '../types/SchemaMap';
import { CompileSchemaConfig, PrivateSchema } from '../types/types';

import { Schema } from './schema';

export abstract class ObjectTypedSchema<
	Input = any,
	Final = any
> extends Schema<Input, Final> {
	protected shape: Array<[string, PrivateSchema]> = []

	constructor(schemas: SchemaMap<Input>) {
		super();

		this.shape = Object.keys(schemas)
		// @ts-expect-error // this will never be undefined but typescript can't comprehend that
		.map((key) => [key, schemas[key]])
	}

	protected override compileSchema({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		const schemaRules = this.shape.flatMap(([childKey, schema]) => {
			return schema.compileSchema({
				context, 
				key: `${key ? `${key}.` : ''}${childKey}`, 
				path: `${path ? `${path}.` : ''}${childKey}`
			})
		})

		return super.compileSchema({
			context, 
			key, 
			srcCode: schemaRules, 
			path
		});
	}
}
