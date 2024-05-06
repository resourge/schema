import { type CompileSchemaConfig, type Context, type SchemaError } from '../types/types';
import { Parameters } from '../utils/Utils';
import { type MessageType } from '../utils/messages';

export type RuleMethod<Value, Final = any> = (
	value: Value, 
	form: Final
) => SchemaError[] | false;

export type RuleTestConfig<T> = {
	context: Context
	form: T
};

export type RuleSrcCodeConfig = Pick<Required<CompileSchemaConfig>, 'context' | 'path'> & {
	errorParameterKey: string
	onlyOnTouch: boolean
	ruleMethodName: string
	ruleType: string
	valueKey: string
	key?: string
};

export abstract class BaseRule<Value, T = any, Method extends (...args: any[]) => any = RuleMethod<Value, T>> {
	public type: 'METHOD_ERROR' | 'MESSAGE';
	public method: Method;
	protected getErrorMessage: (methodName: string, path: string, onlyOnTouch: boolean, errorParameterKey: string, context: Context) => string[];

	public get isMethodError(): boolean {
		return this.type === 'METHOD_ERROR';  
	}

	constructor(
		type: 'METHOD_ERROR',
		method: Method
	);
	constructor(
		type: 'MESSAGE',
		method: Method,
		message: string | ((messages: MessageType) => string),
	);
	constructor(
		type: 'METHOD_ERROR' | 'MESSAGE',
		method: Method,
		message?: string | ((messages: MessageType) => string)
	) {
		this.type = type;
		this.method = method;
		this.getErrorMessage = this.isMethodError
			? (
				methodName: string, 
				path: string, 
				onlyOnTouch: boolean,
				errorParameterKey: string, 
				context: Context
			) => {
				return [
					`${methodName}_isValid.forEach((error) => {`,
					`const ${methodName}_error = {`,
					`	path: error.path ? error.path : \`${path}\`,`,
					'	error: error.error',
					'};',
					`${errorParameterKey}.push(${methodName}_error);`,
					context.async && onlyOnTouch ? `(${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] || []).push(${methodName}_error);` : '',
					'})'
				];
			} : (
				methodName: string, 
				path: string, 
				onlyOnTouch: boolean,
				errorParameterKey: string, 
				context: Context
			) => {
				const _message: string | ((messages: MessageType) => string) = typeof message === 'string' 
					? message 
					: (message as ((messages: MessageType) => string))(context.messages);
				return [
					`const ${methodName}_error = {`,
					`	path: \`${path}\`,`,
					`	error: \`${_message.replace('{{key}}', path)}\``,
					'};',
					`${errorParameterKey}.push(${methodName}_error);`,
					context.async && onlyOnTouch ? `(${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] || []).push(${methodName}_error);` : ''
				];
			};
	}

	public addRule(
		type: string,
		name: string,
		method: (...args: any[]) => any,
		context: Context
	) {
		const index = context.index = context.index + 1;
		const ruleFnName = `${type}_${name}_${index}`;
	
		context.rules[ruleFnName] = method;
	
		return ruleFnName;
	}

	public getRuleSrcCode(
		{
			context,
			path,
			onlyOnTouch,
			ruleMethodName,
			ruleType,
			valueKey,
			errorParameterKey,
			key
		}: RuleSrcCodeConfig
	) {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		// context.async = context.async || (rule.type === 'ASYNC')
		const methodName = this.addRule(
			ruleType, 
			(ruleMethodName ?? '').replace(/\s+/g, '_'),
			this.method,
			context
		);

		const lastIndex = valueKey.lastIndexOf('.');

		const parentKey = lastIndex > -1 ? valueKey.substring(0, lastIndex) : valueKey;
		
		const parameters: string[] = [
			valueKey, 
			parentKey,
			`{ 
				${Parameters.CONTEXT_KEY}: ${Parameters.CONTEXT_KEY},
				form: ${Parameters.OBJECT_KEY}
			}`
		];

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const ruleThis = this;

		return {
			methodName,
			parameters,
			get srcCode(): string[] {
				return ruleThis.getErrorMessage(
					methodName,
					path,
					onlyOnTouch,
					errorParameterKey,
					context
				);
			}
		};
	}

	public abstract getRule(config: RuleSrcCodeConfig): string[];
}
