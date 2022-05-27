import { ObjectShape } from '../types/SchemaObject';

import { CompileSchemaConfig, Schema } from './schema';

export type PrivateSchema = Schema<any, any> & { compileSchema: Schema<any, any>['compileSchema'] }

export abstract class ObjectTypedSchema<
	Input extends Record<string, any>,
	Final = Input
> extends Schema<Input, Final> {
	protected readonly _shape!: ObjectShape<Input, Final>;
	protected shape: Array<[string, PrivateSchema]> = []

	constructor(schemas: ObjectShape<Input, Final>) {
		super();

		this.shape = Object.keys(schemas)
		// @ts-expect-error
		.map((key) => [key, schemas[key] as unknown as PrivateSchema])
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
