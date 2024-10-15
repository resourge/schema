import { type Schema } from '../core/schema';
import { type PrivateSchema, type Context, type SchemaError } from '../types/types';
import { PARAMETERS } from '../utils/Utils';
import { type MessageType } from '../utils/messages';

import {
	addRuleToContextRules,
	getFnParameters,
	type BaseRuleConfig,
	type RuleSrcCodeConfig,
	type RuleTestConfig
} from './BaseRule';

/**
 * When test is "false" message appears
 */
export type RuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: RuleTestConfig<T>
) => boolean;
/**
 * When test is "false" message appears
 */
export type RuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: RuleTestConfig<T>
) => SchemaError[] | true;

export type RuleMethod<Value, T = any> = RuleBooleanMethod<Value, T> | RuleMethodSchemaError<Value, T>;

/**
 * When test is "false" message appears
 */
export type AsyncRuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: RuleTestConfig<T>
) => Promise<boolean>;
/**
 * When test is "false" message appears
 */
export type AsyncRuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: RuleTestConfig<T>
) => Promise<SchemaError[] | true>;

export type AsyncRuleMethod<Value, T = any> = AsyncRuleBooleanMethod<Value, T> | AsyncRuleMethodSchemaError<Value, T>;

const getContent = (
	path: string,
	context: Context,
	isMethodError: boolean,
	message?: string | ((messages: MessageType) => string)
) => {
	if ( isMethodError ) {
		return `${PARAMETERS.FN_GET_ERROR}(error.path || \`${path}\`, error.error)`;
	}

	const _message: string | ((messages: MessageType) => string) = typeof message === 'string' 
		? message 
		: (message as ((messages: MessageType) => string))(context.messages);

	return `${PARAMETERS.FN_GET_ERROR}(\`${path}\`, \`${_message.replace('{{key}}', path)}\`)`;
};

export type RuleType = 'METHOD_ERROR' | 'MESSAGE';

export type RuleConfig<Value = any, T = any> = {
	isAsync: boolean
	isMethodError: boolean
} & BaseRuleConfig<'Rule', Value, T, RuleMethod<Value, T> | AsyncRuleMethod<Value, T>>;

export function getRuleSrcCode<Value, T = any>(
	config: Pick<
		RuleConfig<Value, T>,
		'method' | 'isMethodError' | 'message'
	>,
	{
		context,
		path,
		onlyOnTouch,
		ruleMethodName,
		valueKey
	}: RuleSrcCodeConfig
) {
	const methodName = addRuleToContextRules(
		ruleMethodName,
		config.method,
		context
	);

	const isAsyncOrOnlyOnTouch = context.async && onlyOnTouch;

	const content = getContent(
		path, 
		context,
		config.isMethodError,
		config.message
	);

	return {
		methodName,
		parameters: getFnParameters(valueKey, path),
		srcCode: [
			config.isMethodError ? `${methodName}_isValid.forEach((error) => {` : '',
			...(
				isAsyncOrOnlyOnTouch
					? [
						`const ${methodName}_error = ${content};`,
						`${PARAMETERS.ERRORS_KEY}.push(${methodName}_error);`,
						`(${PARAMETERS.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${PARAMETERS.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] || []).push(${methodName}_error);`
					] : [
						`${PARAMETERS.ERRORS_KEY}.push(${content});`
					]
			),
			config.isMethodError ? '})' : ''
		]
	};
}

export function getRule<Value, T = any>(
	config: RuleConfig<Value, T>,
	srcCodeConfig: RuleSrcCodeConfig
) {
	srcCodeConfig.context.async = config.isAsync;

	const {
		methodName,
		parameters,
		srcCode
	} = getRuleSrcCode(config, srcCodeConfig);

	return [
		(
			config.isAsync
				? [
					`${PARAMETERS.PROMISE_KEY}.push(`,
					`${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')})`,
					`.then((${methodName}_isValid) => {`
				] : `const ${methodName}_isValid = ${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`
		),
		(config.isMethodError ? `if ( ${methodName}_isValid.length ) {` : `if ( ${methodName}_isValid ) {`),
		...srcCode,
		'}',
		(
			config.isAsync
				? [
					'})',
					');'
				] : ''
		)
	]
	.flat();
}

// #region OnlyOnTouchRule
export type OnlyOnTouchRuleConfig = {
	then: Schema<any, any>
	type: 'OnlyOnTouchRule'
};

export function getOnlyTouchRule(
	config: OnlyOnTouchRuleConfig,
	{
		context, 
		path
	}: RuleSrcCodeConfig
): string[] {
	// @ts-expect-error // Because the camp that is changing is protected
	config.then.def.isOnlyOnTouch = true;
	
	return (config.then as PrivateSchema).compileSchema({
		context,
		key: path,
		path
	});
}
// #endregion OnlyOnTouchRule
