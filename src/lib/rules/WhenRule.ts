import { type Schema } from '../core/schema';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/types';
import { PARAMETERS } from '../utils/Utils';

import { BaseRule, type RuleSrcCodeConfig } from './BaseRule';
import { type RuleBooleanMethod } from './Rule';

export type WhenConfig<
	T,
	Input, 
	Final = Input
> = {
	/**
	 * When "is" returns true "then", when false "otherwise"
	 */
	is: RuleBooleanMethod<Input, Final>
	then: (schema: T) => T
	otherwise?: (schema: T) => T
};

export type WhenParameter<Value = any, T = any> = {
	method: RuleBooleanMethod<Value, T>
	name: string
	onlyOnTouch: boolean
	then: Schema<any, any>
	otherwise?: Schema<any, any>
};

export class WhenRule<Value = any, T = any> extends BaseRule<Value, T, RuleBooleanMethod<Value, T>> {
	public name: string;
	public then: PrivateSchema;
	public otherwise?: PrivateSchema;
	public onlyOnTouch: boolean;

	constructor(
		config: WhenParameter<Value, T>
	) {
		super(
			'METHOD_ERROR',
			config.method
		);

		this.name = config.name;
		this.onlyOnTouch = config.onlyOnTouch;
		this.then = config.then as unknown as PrivateSchema;
		this.otherwise = config.otherwise as unknown as PrivateSchema;
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
		const methodName = this.addRule(
			`${this.name}_${context.index = context.index + 1}`,
			context
		);

		const parameters = this.getParameters(
			valueKey,
			path ?? ''
		);

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

		return [
			`const ${methodName}_isValid = ${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			`if ( ${methodName}_isValid ) {`,
			...thenSrcCode,
			'}',
			'else {',
			...otherwiseSrcCode,
			'}'
		];
	}

	public getRule({
		context, 
		path
	}: RuleSrcCodeConfig): string[] {
		// @ts-expect-error // Because the camp that is changing is protected
		this.then.def._isOnlyOnTouch = this.onlyOnTouch;
		
		return this.then.compileSchema({
			context,
			key: path,
			path
		});
	}
}
