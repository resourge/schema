import { Schema } from '../core/schema'
import { CompileSchemaConfig, PrivateSchema } from '../types/types'
import { Parameters, SchemaTypes } from '../utils/Utils'

import { BaseRule } from './BaseRule'
import { RuleBooleanMethod } from './Rule'

export type WhenConfig<
	T,
	Input, 
	Final = Input,
> = {
	is: RuleBooleanMethod<Input, Final>
	then: (schema: T) => T
	otherwise?: (schema: T) => T
}

export class WhenRule<Value = any, T = any> extends BaseRule<Value, T, RuleBooleanMethod<Value, T>> {
	public name: string
	public schemaType: SchemaTypes
	public then: PrivateSchema
	public otherwise?: PrivateSchema

	constructor(
		name: string,
		schemaType: SchemaTypes,
		method: RuleBooleanMethod<Value, T>,
		then: Schema<any, any>,
		otherwise?: Schema<any, any>
	) {
		super(
			'METHOD_ERROR',
			method
		);

		this.schemaType = schemaType;
		this.name = name;
		this.then = then as unknown as PrivateSchema;
		this.otherwise = otherwise as unknown as PrivateSchema;
	}

	public getWhenRule(
		valueKey: string,
		{
			context, 
			key,
			path,
			srcCode
		}: CompileSchemaConfig
	): string[] {
		const {
			methodName, parameters
		} = this.getRuleSrcCode(
			{
				context,
				path: path ?? ''
			},
			this.schemaType,
			valueKey,
			false
		)

		const thenSrcCode = this.then.compileSchema({
			context,
			key,
			path,
			srcCode
		});

		const otherwiseSrcCode = this.otherwise ? this.otherwise.compileSchema({
			context,
			srcCode,
			key,
			path
		}) : undefined;

		const whenSrcCode = [
			`const ${methodName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			`if ( ${methodName}_isValid ) {`,
			...thenSrcCode,
			'}'
		]

		if ( otherwiseSrcCode && otherwiseSrcCode.length ) {
			return [
				...whenSrcCode,
				'else {',
				...otherwiseSrcCode,
				'}'
			]
		}

		return whenSrcCode;
	}

	public getRule(
		{
			context, 
			key,
			path
		}: Required<CompileSchemaConfig>
	): string[] {
		const thenSrcCode = this.then.compileSchema({
			context,
			key,
			path
		});

		return [
			`if ( ${Parameters.ONLY_ON_TOUCH}.some((key) => key.includes(\`${path}\`) || \`${path}\`.includes(key)) ){`,
			...thenSrcCode,
			`context.onlyOnTouchErrors[\`${path}\`] = errors.filter((error) => error.key === \`${path}\`);`,
			'}',
			`else if ( context.onlyOnTouchErrors[\`${path}\`] ){`,
			`context.onlyOnTouchErrors[\`${path}\`].forEach((error) => errors.push(error))`,
			'}'
		]
	}
}
