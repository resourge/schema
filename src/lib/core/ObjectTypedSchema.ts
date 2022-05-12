import { SchemaObject } from '../types/SchemaObject';

import { CompileSchemaConfig, Schema } from './schema';

export type PrivateSchema = Schema & { compileSchema: (config: CompileSchemaConfig) => string[] }

export abstract class ObjectTypedSchema<
	Input extends Record<string, any>, 
	Shape extends SchemaObject<Input> = SchemaObject<Input>
> extends Schema<Input> {
	readonly _shape!: Shape;
	protected schemas: Array<[string, PrivateSchema]> = []

	constructor(schemas: Shape) {
		super();

		this.schemas = Object.keys(schemas)
		.map((key) => [key, schemas[key] as PrivateSchema])
	}

	protected override compileSchema({
		context, 
		index, 
		key, 
		path
	}: CompileSchemaConfig) {
		const schemaRules = this.schemas.flatMap(([childKey, schema]) => {
			return schema.compileSchema({
				context, 
				index: index + 1, 
				key: `${key ? `${key}.` : ''}${childKey}`, 
				path: `${path ? `${path}.` : ''}${childKey}`
			})
		})

		return super.compileSchema({
			context, 
			index, 
			key, 
			srcCode: schemaRules, 
			path
		});
	}
}
