import { type Context, type SchemaError } from '../types/types';
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
		return `${PARAMETERS.FN_GET_ERROR}(error.path ? error.path : \`${path}\`, error.error)`;
	}

	const _message: string | ((messages: MessageType) => string) = typeof message === 'string' 
		? message 
		: (message as ((messages: MessageType) => string))(context.messages);

	return `${PARAMETERS.FN_GET_ERROR}(\`${path}\`, \`${_message.replace('{{key}}', path)}\`)`;
};

export type RuleType = 'METHOD_ERROR' | 'MESSAGE';

export type RuleConfig<Value, T = any> = {
	isAsync: boolean
	isMethodError: boolean
} & BaseRuleConfig<Value, T, RuleMethod<Value, T> | AsyncRuleMethod<Value, T>>;

export class Rule<Value, T = any> {
	public method: RuleMethod<Value, T> | AsyncRuleMethod<Value, T>;
	public message?: string | ((messages: MessageType) => string);
	public isAsync: boolean = false;
	public isMethodError: boolean;

	constructor(config: RuleConfig<Value, T>) {
		this.method = config.method;
		this.message = config.message;
		this.isMethodError = config.isMethodError;
		this.isAsync = config.isAsync;
	}

	public getRuleSrcCode({
		context,
		path,
		onlyOnTouch,
		ruleMethodName,
		valueKey
	}: RuleSrcCodeConfig) {
		const methodName = addRuleToContextRules(
			ruleMethodName,
			this.method,
			context
		);

		const isAsyncOrOnlyOnTouch = context.async && onlyOnTouch;

		const content = getContent(
			path, 
			context,
			this.isMethodError,
			this.message
		);

		return {
			methodName,
			parameters: getFnParameters(valueKey, path),
			srcCode: [
				this.isMethodError ? `${methodName}_isValid.forEach((error) => {` : '',
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
				this.isMethodError ? '})' : ''
			]
		};
	}

	public getRule(config: RuleSrcCodeConfig) {
		const { context } = config;
		context.async = this.isAsync;

		const {
			methodName,
			parameters,
			srcCode
		} = this.getRuleSrcCode(config);

		return [
			(
				this.isAsync
					? [
						`${PARAMETERS.PROMISE_KEY}.push(`,
						`${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')})`,
						`.then((${methodName}_isValid) => {`
					] : `const ${methodName}_isValid = ${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`
			),
			(this.isMethodError ? `if ( ${methodName}_isValid.length ) {` : `if ( ${methodName}_isValid ) {`),
			...srcCode,
			'}',
			(
				this.isAsync
					? [
						'})',
						');'
					] : ''
			)
		]
		.flat();
	}
}
