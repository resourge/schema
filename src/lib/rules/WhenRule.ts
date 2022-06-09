import { Schema } from '../core/schema'
import { CompileSchemaConfig, PrivateSchema } from '../types/types'
import { Parameters, SchemaTypes } from '../utils/Utils'
import { getOnlyOnTouchSrcCode } from '../utils/getOnlyOnTouchSrcCode'

import { BaseRule, GetRuleConfig } from './BaseRule'
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
			this.name,
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

		// This will never be undefined because when 
		// creating whenRules otherwise is inserted by default
		// Only when whenRule is a normalRule will otherwise be undefined 
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const otherwiseSrcCode = this.otherwise!.compileSchema({
			context,
			srcCode,
			key,
			path
		});

		const whenSrcCode = [
			`const ${methodName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			`if ( ${methodName}_isValid ) {`,
			...thenSrcCode,
			'}'
		]

		return [
			...whenSrcCode,
			'else {',
			...otherwiseSrcCode,
			'}'
		]
	}

	public getRule(
		{
			context, 
			path
		}: GetRuleConfig
	): string[] {
		const thenSrcCode = this.then.compileSchema({
			context,
			key: path,
			path
		});

		return getOnlyOnTouchSrcCode(
			path,
			thenSrcCode
		)
	}
}
