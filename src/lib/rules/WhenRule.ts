import { type Schema } from '../core/schema';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/types';
import { Parameters, type SchemaTypes } from '../utils/Utils';

import { BaseRule, type RuleSrcCodeConfig } from './BaseRule';
import { type RuleBooleanMethod } from './Rule';

export type WhenConfig<
	T,
	Input, 
	Final = Input,
> = {
	/**
	 * When "is" returns true "then", when false "otherwise"
	 */
	is: RuleBooleanMethod<Input, Final>
	then: (schema: T) => T
	otherwise?: (schema: T) => T
}

export class WhenRule<Value = any, T = any> extends BaseRule<Value, T, RuleBooleanMethod<Value, T>> {
	public name: string;
	public schemaType: SchemaTypes;
	public then: PrivateSchema;
	public otherwise?: PrivateSchema;
	public onlyOnTouch: boolean;

	constructor(
		name: string,
		schemaType: SchemaTypes,
		method: RuleBooleanMethod<Value, T>,
		onlyOnTouch: boolean,
		then: Schema<any, any>,
		otherwise?: Schema<any, any>
	) {
		super(
			'METHOD_ERROR',
			method
		);

		this.schemaType = schemaType;
		this.name = name;
		this.onlyOnTouch = onlyOnTouch;
		this.then = then as unknown as PrivateSchema;
		this.otherwise = otherwise as unknown as PrivateSchema;
	}

	public getWhenRule(
		valueKey: string,
		errorParameterKey: string,
		{
			context, 
			key,
			path,
			srcCode
		}: CompileSchemaConfig
	): string[] {
		const { methodName, parameters } = this.getRuleSrcCode({
			context,
			path: path ?? '',
			onlyOnTouch: false,
			valueKey,
			ruleType: this.schemaType,
			ruleMethodName: this.name,
			errorParameterKey,
			key
		});

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
		];

		return [
			...whenSrcCode,
			'else {',
			...otherwiseSrcCode,
			'}'
		];
	}

	public getRule(
		{
			context, 
			path
		}: RuleSrcCodeConfig
	): string[] {
		// @ts-expect-error // Because the camp that is changing is protected
		this.then.def._isOnlyOnTouch = this.onlyOnTouch;
		
		return this.then.compileSchema({
			context,
			key: path,
			path
		});
	}
}
