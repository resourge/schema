import { type OneOfConfig } from '../types/OneOfTypes';
import { type SchemaMap } from '../types/SchemaMap';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/types';
import { createOneOfFunctionName } from '../utils/Utils';

import { type Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ObjectTypedSchema<
	Input = any,
	Final = any
> extends Schema<Input, Final> {
	protected schemas: SchemaMap<Input>;
	protected shape: Map<string, PrivateSchema>;

	protected oneOfRules = new Map<string, PrivateSchema>();
	protected oneOfConfig: OneOfConfig = {};

	constructor(schemas: SchemaMap<Input>, def?: Definitions) {
		super(def);

		this.schemas = {
			...schemas 
		};
		this.shape = new Map(Object.entries(schemas));
	}

	protected compileOneOfRules({
		context, 
		key, 
		path
	}: CompileSchemaConfig) {
		const srcCode = [];
		const errorParameterKey = createOneOfFunctionName();
		const errorParameterKeyCondition = createOneOfFunctionName();

		srcCode.push(
			`let ${errorParameterKey} = [];`,
			`let ${errorParameterKeyCondition} = true;`,
			this.oneOfConfig.includeAllErrors ? `let _${errorParameterKey} = [];` : ''
		);

		this.oneOfRules.forEach((schema, childKey ) => {
			// @ts-expect-error To be only accessible for the developer
			schema.errorParameterKey = errorParameterKey;

			srcCode.push(
				this.oneOfConfig.includeAllErrors 
					? `_${errorParameterKey} = Array.prototype.slice.call(${errorParameterKey});` 
					: `${errorParameterKey} = [];`,
				`if ( ${errorParameterKeyCondition} ) {`,
				...schema.compileSchema({
					context, 
					key: `${key ? `${key}.` : ''}${childKey}`, 
					path: `${path ? `${path}.` : ''}${childKey}`
				}),
				this.oneOfConfig.includeAllErrors 
					? `if ( ${errorParameterKey}.length === _${errorParameterKey}.length ) {` 
					: `if ( ${errorParameterKey}.length === 0 ) {`,
				`${errorParameterKeyCondition} = false;`,
				'}',
				'}'
			);
		});
		
		srcCode.push(
			`if ( ${errorParameterKeyCondition} ) {`,
			(
				!this.oneOfConfig.message 
					? `${errorParameterKey}.forEach((error) => { errors.push(error); })`
					: (
						typeof this.oneOfConfig.message === 'string' 
							? `${errorParameterKey}.forEach((error) => { error.error = '${this.oneOfConfig.message}'; errors.push(error); })`
							: Array.isArray(this.oneOfConfig.message)
								? `${JSON.stringify(this.oneOfConfig.message)}.forEach((error) => { errors.push(error); })`
								: `errors.push(${JSON.stringify(this.oneOfConfig.message)}); `
					)
			),
			'}'
		);

		return srcCode;
	}

	protected override compileSchema({
		context, 
		key, 
		path,
		srcCode = []
	}: CompileSchemaConfig) {
		const schemaRules: string[] = [...srcCode];
		
		this.shape.forEach((schema, childKey) => {
			schemaRules.push(
				...schema.compileSchema({
					context, 
					key: `${key ? `${key}.` : ''}${childKey}`, 
					path: `${path ? `${path}.` : ''}${childKey}`
				})
			);
		});

		if ( this.oneOfRules.size ) {
			schemaRules.push(
				...this.compileOneOfRules({
					context, 
					key, 
					path,
					srcCode
				})
			);
		}

		return super.compileSchema({
			context, 
			key, 
			srcCode: schemaRules, 
			path
		});
	}
}
