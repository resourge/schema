import { SchemaMap } from '../types/_types';
import { CompileSchemaConfig } from '../types/types';

import { Schema } from './schema';

export type PrivateSchema = Schema<any> & { compileSchema: Schema<any>['compileSchema'] }

export abstract class ObjectTypedSchema<
	Input = any,
	Final = any
> extends Schema<Input, Final> {
	protected shape: Array<[string, PrivateSchema]> = []

	constructor(schemas: SchemaMap<Input>) {
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
