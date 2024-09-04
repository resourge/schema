import { type OneOfConfigMessage } from '../types/OneOfTypes';
import { type SchemaMap } from '../types/SchemaMap';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/types';
import { createOneOfFunctionName, PARAMETERS } from '../utils/Utils';

import { type Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ObjectTypedSchema<
	Input = any,
	Final = any
> extends Schema<Input, Final> {
	protected schemas: SchemaMap<Input>;
	protected shape: Map<string, PrivateSchema>;

	protected oneOfRules = new Map<string, PrivateSchema>();
	protected oneOfConfigMessage: OneOfConfigMessage | undefined;

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
		const srcCode: Array<string | string[]> = [];
		const functionName = createOneOfFunctionName();
		const functionNameErrors = `${functionName}_${PARAMETERS.ERRORS_KEY}`;

		srcCode.push(
			`function ${functionName}() {`,
			`let ${PARAMETERS.ERRORS_KEY} = [];`,
			`let ${functionNameErrors} = [];`
		);

		this.oneOfRules.forEach((schema, childKey ) => {
			srcCode.push(
				schema.compileSchema({
					context, 
					key: `${key ? `${key}.` : ''}${childKey}`, 
					path: `${path ? `${path}.` : ''}${childKey}`
				}),
				`if ( ${PARAMETERS.ERRORS_KEY}.length === 0 ) {`,
				'return []',
				'}'
			);
			srcCode.push(
				`${functionNameErrors}.push(...${PARAMETERS.ERRORS_KEY});`,
				`${PARAMETERS.ERRORS_KEY} = [];`
			);
		});

		srcCode.push(
			`return ${functionNameErrors};`,
			'}'
		);
		
		srcCode.push(
			!this.oneOfConfigMessage
				? `${functionName}().forEach((error) => { ${PARAMETERS.ERRORS_KEY}.push(error); })`
				: (
					typeof this.oneOfConfigMessage === 'string' 
						? `${functionName}().forEach((error) => { error.error = '${this.oneOfConfigMessage}'; ${PARAMETERS.ERRORS_KEY}.push(error); })`
						: (
							[
								`if ( ${functionName}().length ) {`,
								(
									Array.isArray(this.oneOfConfigMessage)
										? `${JSON.stringify(this.oneOfConfigMessage)}.forEach((error) => { ${PARAMETERS.ERRORS_KEY}.push(error); })`
										: `${PARAMETERS.ERRORS_KEY}.push(${JSON.stringify(this.oneOfConfigMessage)});`
								),
								'}'
							]
						)
						
				)
		);

		return srcCode.flat();
	}

	protected override compileSchema({
		context, 
		key, 
		path,
		srcCode = []
	}: CompileSchemaConfig) {
		const schemaRules: string[][] = [srcCode];
		
		this.shape.forEach((schema, childKey) => {
			schemaRules.push(
				schema.compileSchema({
					context, 
					key: `${key ? `${key}.` : ''}${childKey}`, 
					path: `${path ? `${path}.` : ''}${childKey}`
				})
			);
		});

		if ( this.oneOfRules.size ) {
			schemaRules.push(
				this.compileOneOfRules({
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
			srcCode: schemaRules.flat(), 
			path
		});
	}
}
