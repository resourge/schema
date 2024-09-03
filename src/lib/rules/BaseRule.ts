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
	path: string
};

export type RuleSrcCodeConfig = Pick<Required<CompileSchemaConfig>, 'context' | 'path'> & {
	errorParameterKey: string
	onlyOnTouch: boolean
	ruleMethodName: string
	valueKey: string
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
				const isAsyncOrOnlyOnTouch = context.async && onlyOnTouch;

				const content = [
					'{',
					`path: error.path ? error.path : \`${path}\`,`,
					'error: error.error',
					'}'
				];

				return [
					`${methodName}_isValid.forEach((error) => {`,
					...(
						isAsyncOrOnlyOnTouch
							? [
								`const ${methodName}_error = `,
								...content,
								';',
								`${errorParameterKey}.push(${methodName}_error);`,
								`(${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] || []).push(${methodName}_error);`
							] : [
								`${errorParameterKey}.push(`,
								...content,
								');'
							]
					),
					'})'
				];
			} : (
				methodName: string, 
				path: string, 
				onlyOnTouch: boolean,
				errorParameterKey: string, 
				context: Context
			) => {
				const isAsyncOrOnlyOnTouch = context.async && onlyOnTouch;

				const _message: string | ((messages: MessageType) => string) = typeof message === 'string' 
					? message 
					: (message as ((messages: MessageType) => string))(context.messages);

				const content = [
					'{',
					`path: \`${path}\`,`,
					`error: \`${_message.replace('{{key}}', path)}\``,
					'}'
				];

				return isAsyncOrOnlyOnTouch
					? [
						`const ${methodName}_error = `,
						...content,
						';',
						`${errorParameterKey}.push(${methodName}_error);`,
						`(${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] || []).push(${methodName}_error);`
					] : [
						`${errorParameterKey}.push(`,
						...content,
						');'
					];
			};
	}

	public addRule(
		name: string,
		method: (...args: any[]) => any,
		context: Context
	) {
		const ruleFnName = `${name}`
		.replace(/[^a-zA-Z0-9_]/g, '_')
		.replace(/\s+/g, '_')
		.normalize('NFC')
		.toLowerCase();
	
		context.rules[ruleFnName] = method;
	
		return ruleFnName;
	}

	public getRuleSrcCode({
		context,
		path,
		onlyOnTouch,
		ruleMethodName,
		valueKey,
		errorParameterKey
	}: RuleSrcCodeConfig) {
		const methodName = this.addRule(
			ruleMethodName,
			this.method,
			context
		);

		const lastIndex = valueKey.lastIndexOf('.');

		const parentKey = lastIndex > -1 ? valueKey.substring(0, lastIndex) : valueKey;
		
		const parameters: string[] = [
			valueKey, 
			parentKey,
			`{ 
				context: ${Parameters.CONTEXT_KEY},
				form: ${Parameters.OBJECT_KEY},
				path: \`${path}\`
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
