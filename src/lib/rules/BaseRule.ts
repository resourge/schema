import { DeepReadonly } from '../types/DeepReadonly'
import { Context, SchemaError } from '../types/types'
import { MessageType } from '../utils/messages'

export type RuleMethod<Value, T = any> = (
	value: DeepReadonly<Value>, 
	obj: DeepReadonly<T>
) => SchemaError[] | false

enum Parameters {
	ERRORS_KEY = 'errors',
	PROMISE_KEY = 'promises',
	CONTEXT_KEY = 'context',
	ONLY_ON_TOUCH = 'onlyOnTouch',
	OBJECT_KEY = 'object',

	VALUE = 'value',
	RECURSIVE_KEY = 'recursiveKey',
}

export function addRule(
	type: string,
	name: string,
	method: Function,
	context: Context
) {
	const index = context.index = context.index + 1;
	const ruleFnName = `${type}_${name}_${index}`;

	context.rules[ruleFnName] = method;

	return ruleFnName;
}

export abstract class BaseRule<Value, T = any, Method extends Function = RuleMethod<Value, T>> {
	public name: string
	public method: Method
	protected getErrorMessage: (methodName: string, path: string, onlyOnTouch: boolean, context: Context) => string[]

	constructor(
		type: 'METHOD_ERROR' | 'MESSAGE',
		method: Method,
		message?: string | ((messages: MessageType) => string),
		name?: string
	) {
		this.name = (name ?? '').replace(/\s+/g, '_');
		this.method = method;
		this.getErrorMessage = type === 'METHOD_ERROR' 
			? (
				methodName: string, 
				path: string, 
				onlyOnTouch: boolean,
				_context: Context
			) => {
				return [
					`${methodName}_isValid.forEach((error) => {`,
					`${Parameters.ERRORS_KEY}.push({`,
					`	key: error.key ? error.key : \`${path}\`,`,
					'	error: error.error',
					'});',
					onlyOnTouch ? `${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`].push(error);` : '',
					'})'
				]
			} : (
				_methodName: string, 
				path: string, 
				onlyOnTouch: boolean,
				context: Context
			) => {
				const _message: string | ((messages: MessageType) => string) = typeof message === 'string' ? message : (message ? message(context.messages) : '')
				return [
					`${Parameters.ERRORS_KEY}.push({`,
					`	key: \`${path}\`,`,
					`	error: \`${_message.replace('{{key}}', path)}\``,
					'});',
					onlyOnTouch ? `${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`].push(${Parameters.ERRORS_KEY}[${Parameters.ERRORS_KEY}.length - 1]);` : ''
				]
			};
	}

	public getRuleSrcCode(
		context: Context,
		type: string,
		valueKey: string,
		path: string,
		onlyOnTouch: boolean
	) {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		// context.async = context.async || (rule.type === 'ASYNC')
		const methodName = addRule(
			type, 
			this.name,
			this.method,
			context
		)

		const parameters: string[] = [
			valueKey, 
			Parameters.OBJECT_KEY, 
			Parameters.CONTEXT_KEY
		]
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
					context
				)
			}
		}
	}

	public abstract getRule(
		context: Context,
		type: string,
		valueKey: string,
		path: string,
		onlyOnTouch: boolean
	): string[]
}
