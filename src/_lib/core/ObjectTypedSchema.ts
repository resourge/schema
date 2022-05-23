import { ObjectShape } from '../types/SchemaObject';

import { CompileSchemaConfig, Schema } from './schema';

export type PrivateSchema = Schema<any> & { compileSchema: Schema<any>['compileSchema'] }

export abstract class ObjectTypedSchema<
	Input extends Record<string, any>
> extends Schema<Input> {
	readonly _shape!: ObjectShape<Input>;
	protected schemas: Array<[string, PrivateSchema]> = []

	constructor(schemas: ObjectShape<Input>) {
		super();

		this.schemas = Object.keys(schemas)
		// @ts-expect-error
		.map((key) => [key, schemas[key] as unknown as PrivateSchema])
	}

	protected override compileSchema({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		const schemaRules = this.schemas.flatMap(([childKey, schema]) => {
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
