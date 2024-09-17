import { type Schema } from '../core/schema';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/types';
import { PARAMETERS } from '../utils/Utils';

import { addRuleToContextRules, type BaseRuleConfig, getFnParameters } from './BaseRule';
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

export type WhenParameter<Value = any, T = any, Type extends string = 'WhenRule'> = {
	name: string
	then: Schema<any, any>
	otherwise?: Schema<any, any>
} & BaseRuleConfig<Type, Value, T, RuleBooleanMethod<Value, T>>;

export function getWhenRule<Value = any, T = any, Type extends string = 'WhenRule'>(
	config: WhenParameter<Value, T, Type>,
	valueKey: string,
	{
		context, 
		key,
		path,
		srcCode
	}: CompileSchemaConfig
): string[] {
	const methodName = addRuleToContextRules(
		`${config.name}_${context.index++}`,
		config.method,
		context
	);

	const parameters = getFnParameters(
		valueKey,
		path ?? ''
	);

	const thenSrcCode = (config.then as unknown as PrivateSchema).compileSchema({
		context,
		key,
		path,
		srcCode
	});

	// This will never be undefined because when 
	// creating whenRules otherwise is inserted by default
	// Only when whenRule is a normalRule will otherwise be undefined 
	const otherwiseSrcCode = (config.otherwise as unknown as PrivateSchema).compileSchema({
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
