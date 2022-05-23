import { ObjectShape, ZodRawShape, ZodTypeAny } from '../types/SchemaObject';
import { objectInputType, objectOutputType } from '../types/types';

import { CompileSchemaConfig, Schema } from './schema';

export type PrivateSchema = Schema<any> & { compileSchema: Schema<any>['compileSchema'] }

export abstract class ObjectTypedSchema<
	T extends ZodRawShape, 
	Output = objectOutputType<T, ZodTypeAny>, 
	Input = objectInputType<T, ZodTypeAny>,
	Final = Input
> extends Schema<Output, Input, Final> {
	readonly _shape!: ObjectShape<Input, Final>;
	protected schemas: Array<[string, PrivateSchema]> = []

	constructor(schemas: ObjectShape<Input, Final>) {
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
