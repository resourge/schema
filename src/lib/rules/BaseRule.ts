import { type CompileSchemaConfig, type Context, type SchemaError } from '../types/types';
import { PARAMETERS } from '../utils/Utils';
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
	onlyOnTouch: boolean
	ruleMethodName: string
	valueKey: string
};

export abstract class BaseRule<Value, T = any, Method extends (...args: any[]) => any = RuleMethod<Value, T>> {
	public type: 'METHOD_ERROR' | 'MESSAGE';
	public method: Method;
	protected getErrorMessage: (methodName: string, path: string, onlyOnTouch: boolean, context: Context) => string[];

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
		const getContent = (
			path: string,
			context: Context
		) => {
			if ( this.isMethodError ) {
				return `${PARAMETERS.FN_GET_ERROR}(error.path ? error.path : \`${path}\`, error.error)`;
			}

			const _message: string | ((messages: MessageType) => string) = typeof message === 'string' 
				? message 
				: (message as ((messages: MessageType) => string))(context.messages);

			return `${PARAMETERS.FN_GET_ERROR}(\`${path}\`, \`${_message.replace('{{key}}', path)}\`)`;
		};

		this.type = type;
		this.method = method;
		this.getErrorMessage = (
			methodName: string, 
			path: string, 
			onlyOnTouch: boolean,
			context: Context
		) => {
			const isAsyncOrOnlyOnTouch = context.async && onlyOnTouch;

			const content = getContent(path, context);

			return [
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
			];
		};
	}

	public addRule(
		name: string,
		context: Context
	) {
		const ruleFnName = `${name}`
		.replace(/\s+/g, '_')
		.replace(/[^a-zA-Z0-9_]/g, '_')
		.replace(/\s+/g, '_')
		.normalize('NFC')
		.toLowerCase();
	
		context.rules[ruleFnName] = this.method;
	
		return ruleFnName;
	}

	public getParameters(
		valueKey: string,
		path: string
	) {
		const lastIndex = valueKey.lastIndexOf('.');

		return [
			valueKey, 
			lastIndex > -1 ? valueKey.substring(0, lastIndex) : valueKey,
			`${PARAMETERS.FN_CONTEXT}(${path ? `\`${path}\`` : '\'\''})`
		];
	}

	public getRuleSrcCode({
		context,
		path,
		onlyOnTouch,
		ruleMethodName,
		valueKey
	}: RuleSrcCodeConfig) {
		const methodName = this.addRule(
			ruleMethodName,
			context
		);

		return {
			methodName,
			parameters: this.getParameters(valueKey, path),
			srcCode: this.getErrorMessage(
				methodName,
				path,
				onlyOnTouch,
				context
			)
		};
	}

	public abstract getRule(config: RuleSrcCodeConfig): string[];
}
