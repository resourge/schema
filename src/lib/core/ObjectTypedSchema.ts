import { SchemaMap } from '../types/SchemaMap';
import { CompileSchemaConfig, PrivateSchema } from '../types/types';

import { Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ObjectTypedSchema<
	Input = any,
	Final = any
> extends Schema<Input, Final> {
	protected schemas: SchemaMap<Input>
	protected shape: Map<string, PrivateSchema>;

	constructor(schemas: SchemaMap<Input>, def?: Definitions) {
		super(def);

		this.schemas = {
			...schemas 
		};
		this.shape = new Map(Object.entries(schemas))
	}

	protected override compileSchema({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		const schemaRules: string[] = []
		
		this.shape.forEach((schema, childKey) => {
			schemaRules.push(
				...schema.compileSchema({
					context, 
					key: `${key ? `${key}.` : ''}${childKey}`, 
					path: `${path ? `${path}.` : ''}${childKey}`
				})
			);
		})

		return super.compileSchema({
			context, 
			key, 
			srcCode: schemaRules, 
			path
		});
	}
}
