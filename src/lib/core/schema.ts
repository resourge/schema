/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { DeepReadonly } from '../types/DeepReadonly'
import { FormKey } from '../types/FormKey'
import { beautifyFunction } from '../utils/beautifyFunction'
import { defaultMessages, MessageType } from '../utils/messages'
import { shallowClone } from '../utils/shallowClone'

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export const __DEV__: boolean
}

export enum SchemaTypes {
	STRING = 'string',
	BOOLEAN = 'boolean',
	NUMBER = 'number',
	ANY = 'any',
	ARRAY = 'array',
	OBJECT = 'object',
	DATE = 'date'
}

export type Context = {
	index: number
	onlyOnTouch?: boolean
	optional?: boolean
	nullable?: boolean
	messages: MessageType
	async?: boolean
	rules: {
		[key: string]: Function
	}
}

export type Touches<T extends Record<string, any>> = {
	/**
	 * Paths for the keys touched
	 */
	[K in FormKey<T> | string]?: boolean
}

export type AsyncRuleFn<Value = any, T = any> = (value: DeepReadonly<Value>, obj: DeepReadonly<T>) => Promise<boolean>
export type SyncRuleFn<Value = any, T = any> = (value: DeepReadonly<Value>, obj: DeepReadonly<T>) => boolean

export type RuleFn<Value = any, T = any> = AsyncRuleFn<Value, T> | SyncRuleFn<Value, T>

export type WhenRule<Value = any, T = any> = {
	name: string
	isValid: RuleFn<Value, T>
	then: Schema<any, any>
	otherwise?: Schema<any, any>
}

export type NormalRule<Value = any, T = any> = {
	type: 'NORMAL'
	name: string
	isValid: RuleFn<Value, T>
	message: string | ((messages: MessageType) => string)
}

export type AsyncRule<Value = any, T = any> = {
	type: 'ASYNC'
	name: string
	isValid: AsyncRuleFn<Value, T>
	message: string | ((messages: MessageType) => string)
}

export type Rule<Value = any, T = any> = NormalRule<Value, T> | AsyncRule<Value, T>

export type CompileSchemaConfig = {
	context: Context
	key?: string
	srcCode?: string[]
	path?: string
}

export type CompileConfig = { 
	debug?: boolean
	onlyOnTouch?: boolean
	defaultOptional?: boolean
	defaultNullable?: boolean
	messages?: MessageType
}

enum Parameters {
	ERRORS_KEY = 'errors',
	PROMISE_KEY = 'promises',
	CONTEXT_KEY = 'context',
	ONLY_ON_TOUCH = 'onlyOnTouch',
	OBJECT_KEY = 'object',

	VALUE = 'value',
	RECURSIVE_KEY = 'recursiveKey',
}

export type SchemaError = {
	key: string
	error: string
}

type WhenConfig<
	T,
	Input, 
	Final = Input,
> = {
	is: RuleFn<Input, Final>
	then: (schema: T) => T
	otherwise?: (schema: T) => T
}

type TestFunction<Input, Final> = {
	isValid: RuleFn<Input, Final>
	message: string | ((messages: MessageType) => string)
	name?: string
}

type AsyncTestFunction<Input, Final> = {
	isValid: AsyncRuleFn<Input, Final>
	message: string | ((messages: MessageType) => string)
	name?: string
}
export abstract class Schema<
	Input, 
	Final = Input
> {
	protected readonly _input!: Input;
	protected readonly _final!: Final;
	public async: boolean = false;
	protected _isOnlyOnTouch?: boolean;
	public get isOnlyOnTouch(): boolean {
		return this._isOnlyOnTouch ?? false;
	}

	protected _isOptional?: boolean;
	public get isOptional(): boolean {
		return this._isOptional ?? false;
	}

	protected _isNullable?: boolean;
	public get isNullable(): boolean {
		return this._isNullable ?? false;
	}

	protected _isRequired?: boolean;
	public get isRequired(): boolean {
		return this._isRequired ?? false;
	}

	protected abstract type: SchemaTypes
	protected abstract message: string
	protected abstract rule: RuleFn<any, any>

	private _validate: ((value: Input, onlyOnTouch?: string[]) => Promise<SchemaError[]> | SchemaError[]) | undefined

	/**
	 * Path for current value
	 */
	protected path: string = '';
	protected normalRules: Rule[] = []
	protected whenRules: WhenRule[] = []
	protected srcCode: string[] = []

	protected getValueKey(key?: string) {
		return `${Parameters.VALUE}${key ? `${key.indexOf('[') === 0 ? '' : '.'}${key}` : ''}`
	}

	protected getMessage(message: string): string {
		return `\`${message.replace('{{key}}', this.path)}\``
	}
	
	protected getErrorSyntax(message: string) {
		return [
			`${Parameters.ERRORS_KEY}.push({`,
			`	key: \`${this.path}\`,`,
			`	error: ${this.getMessage(message)}`,
			'});'
		]
	}

	protected addRule(
		name: string,
		isValid: RuleFn,
		context: Context
	) {
		const index = context.index = context.index + 1;
		const ruleFnName = `${this.type}_${name}_${index}`;

		context.rules[ruleFnName] = isValid;

		return ruleFnName;
	}

	// #region Normal Rules
	/**
	 * Transform rule into string
	 * @param rule Rule
	 * @param context 
	 * @param valueKey 
	 * @returns 
	 */
	protected transformNormalRules(
		rule: Rule, 
		context: Context, 
		valueKey: string
	): string[] {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		context.async = context.async || (rule.type === 'ASYNC')
		const ruleFnName = this.addRule(`${rule.name || 'custom_rule'}`, rule.isValid, context)

		const parameters: string[] = [
			valueKey, 
			Parameters.OBJECT_KEY
		]

		const message = typeof rule.message === 'string' ? rule.message : rule.message(context.messages)

		const validationSrcCode = [
			`if ( !${ruleFnName}_isValid ) {`,
			...this.getErrorSyntax(message),
			'}'
		]

		if ( rule.type === 'NORMAL' ) {
			return [
				`const ${ruleFnName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')});`,
				...validationSrcCode
			]
		}

		return [
			`${Parameters.PROMISE_KEY}.push(`,
			`${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')})`,
			`.then((${ruleFnName}_isValid) => {`,
			...validationSrcCode,
			'})',
			');'
		]
	}

	protected compileNormalRules(rules: Rule[], context: Context, valueKey: string): string[] {
		return rules.flatMap((rule) => this.transformNormalRules(rule, context, valueKey))
	}
	// #endregion Normal Rules

	// #region When Rules
	protected transformWhenRules(
		rule: WhenRule, 
		context: Context, 
		valueKey: string, 
		srcCode: string[]
	): string[] {
		const ruleFnName = this.addRule(`${rule.name}`, rule.isValid, context)

		const parameters: string[] = [
			valueKey, 
			Parameters.OBJECT_KEY
		]

		const thenSrcCode = rule.then.compileSchema({
			context,
			path: this.path,
			srcCode
		});

		const otherwiseSrcCode = rule.otherwise ? rule.otherwise.compileSchema({
			context,
			path: this.path,
			srcCode
		}) : undefined;

		const whenSrcCode = [
			`const ${ruleFnName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')});`,
			`if ( ${ruleFnName}_isValid ) {`,
			...thenSrcCode,
			'}'
		]

		if ( otherwiseSrcCode && otherwiseSrcCode.length ) {
			return [
				...whenSrcCode,
				'else {',
				...otherwiseSrcCode,
				'}'
			]
		}

		return whenSrcCode;
	}

	protected compileWhenSchema(
		context: Context,
		valueKey: string,
		srcCode: string[]
	) {
		return this.whenRules.flatMap((rule) => (
			this.transformWhenRules(rule, context, valueKey, srcCode)
		))
	}
	// #endregion When Rules

	protected compileNormalSchema(
		valueKey: string, 
		context: Context, 
		srcCode: string[]
	) {
		const fnName = this.addRule(`schema_is_${this.type}`, this.rule, context)

		const parameters: string[] = [
			valueKey, 
			Parameters.OBJECT_KEY
		]

		const rulesSrcCode = this.compileNormalRules(this.normalRules, context, valueKey);

		const fn = `${Parameters.CONTEXT_KEY}.rules.${fnName}(${parameters.join(',')})`;

		const errorsSyntax = this.getErrorSyntax(this.message);

		const fnSrcCode = rulesSrcCode.length > 0 || srcCode.length > 0 ? [
			`if (${fn}) {`,
			...rulesSrcCode,
			...srcCode,
			'}',
			'else {',
			...errorsSyntax,
			'}'
		] : [
			`if (!${fn}) {`,
			...errorsSyntax,
			'}'
		]

		const mandatoryRules = this.getMandatoryRules(this, context);
		return mandatoryRules
		.reduce((fnSrcCode, rule) => rule(fnSrcCode, valueKey), fnSrcCode)
	}

	protected getMandatoryRules(schema: Schema<any, any>, context: Context) {
		const mandatoryRules: Array<(fnSrcCode: string[], valueKey: string) => string[]> = []

		const isOptional = schema._isOptional ?? context.optional;
		if ( isOptional !== undefined ) {
			if ( isOptional ) {
				schema.optional();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} !== undefined ){`,
					...fnSrcCode,
					'}'
				])
			}
			else {
				schema.notOptional();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} === undefined ){`,
					...schema.getErrorSyntax(context.messages.notOptional),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				])
			}
		}

		const isNullable = schema._isNullable ?? context.nullable;
		if ( isNullable !== undefined ) {
			if ( isNullable ) {
				schema.nullable();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} !== null ){`,
					...fnSrcCode,
					'}'
				])
			}
			else {
				schema.notNullable();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} === null ){`,
					...schema.getErrorSyntax(context.messages.notNullable),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				])
			}
		}

		const _isRequired = schema._isRequired ?? context.nullable;
		if ( _isRequired !== undefined ) {
			if ( _isRequired ) {
				schema.required();
			
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} === null && ${valueKey} === undefined ){`,
					...schema.getErrorSyntax(context.messages.required),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				])
			}
			else {
				schema.notRequired();

				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} !== null && ${valueKey} !== undefined ){`,
					...fnSrcCode,
					'}'
				])
			}
		}

		const isOnlyOnTouch = schema._isOnlyOnTouch ?? context.onlyOnTouch;
		if ( isOnlyOnTouch ) {
			schema.onlyOnTouch();
			mandatoryRules.push((fnSrcCode: string[]) => [
				`if ( ${Parameters.ONLY_ON_TOUCH}.some((key) => key.includes(\`${schema.path}\`) || \`${schema.path}\`.includes(key)) ){`,
				...fnSrcCode,
				'}'
			])
		}

		return mandatoryRules
	}

	protected compileSchema({
		context, 
		key, 
		srcCode = [],
		path
	}: CompileSchemaConfig) {
		const valueKey = this.getValueKey(key)
		this.path = path ?? key ?? '';

		if ( this.whenRules && this.whenRules.length ) {
			return this.compileWhenSchema(context, valueKey, srcCode)
		}

		return this.compileNormalSchema(valueKey, context, srcCode);
	}

	public test(
		isValid: TestFunction<Input, Final>['isValid'],
		message: string | ((messages: MessageType) => string),
		name?: string
	): this
	public test(config: TestFunction<Input, Final>): this
	public test(
		config: TestFunction<Input, Final>['isValid'] | TestFunction<Input, Final>,
		message?: string | ((messages: MessageType) => string),
		name?: string
	) {
		if ( typeof config === 'object' ) {
			this.normalRules.push({
				type: 'NORMAL',
				name: (config.name ?? '').replace(/\s+/g, '_'),
				isValid: config.isValid,
				message: config.message
			})

			return this;
		}

		this.normalRules.push({
			type: 'NORMAL',
			name: (name ?? '').replace(/\s+/g, '_'),
			isValid: config,
			/* c8 ignore start */ 
			// This is satisfy the coverage 
			// but this if will never be called
			message: message ?? ''
			/* c8 ignore stop */
		})

		return this;
	}

	public asyncTest(
		isValid: AsyncTestFunction<Input, Final>['isValid'],
		message: string | ((messages: MessageType) => string),
		name?: string
	): this
	public asyncTest(config: AsyncTestFunction<Input, Final>): this
	public asyncTest(
		config: AsyncTestFunction<Input, Final>['isValid'] | AsyncTestFunction<Input, Final>,
		message?: string | ((messages: MessageType) => string),
		name?: string
	) {
		if ( typeof config === 'object' ) {
			this.normalRules.push({
				type: 'ASYNC',
				name: (config.name ?? '').replace(/\s+/g, '_'),
				isValid: config.isValid,
				message: config.message
			})

			return this;
		}
		this.normalRules.push({
			type: 'ASYNC',
			name: (name ?? '').replace(/\s+/g, '_'),
			isValid: config,
			/* c8 ignore start */ 
			// This is satisfy the coverage 
			// but this if will never be called
			message: message ?? ''
			/* c8 ignore stop */
		})

		return this;
	}

	public when<S extends Schema<any, any> = this>({
		is,
		then,
		otherwise
	}: WhenConfig<S, Input, Final>) {
		const thenThis = shallowClone(this) as unknown as S;
		thenThis.whenRules = [...thenThis.whenRules];
		thenThis.normalRules = [...thenThis.normalRules];

		const thenSchema = then(thenThis);

		let otherwiseSchema: S | undefined;
		if ( otherwise ) {
			const otherwiseThis = shallowClone(this) as unknown as S;
			otherwiseThis.whenRules = [...otherwiseThis.whenRules];
			otherwiseThis.normalRules = [...otherwiseThis.normalRules];

			otherwiseSchema = otherwise(otherwiseThis);
		}

		this.whenRules.push({
			name: 'custom_when',
			isValid: is,
			then: thenSchema,
			otherwise: otherwiseSchema
		})

		return this;
	} 

	public onlyOnTouch() {
		this._isOnlyOnTouch = true;

		return this;
	}

	public required() {
		this._isOptional = undefined;
		this._isNullable = undefined;
		this._isRequired = true;

		return this;
	}

	public notRequired(message?: string) {
		this._isOptional = undefined;
		this._isNullable = undefined;
		this._isRequired = false;

		this.message = message ?? this.message;

		return this;
	}

	public optional() {
		this._isOptional = true;
		this._isRequired = undefined;

		return this;
	}

	public notOptional() {
		this._isOptional = false;
		this._isRequired = undefined;

		return this;
	}

	public nullable() {
		this._isNullable = true;
		this._isRequired = undefined;

		return this;
	}

	public notNullable() {
		this._isNullable = false;
		this._isRequired = undefined;

		return this;
	}

	public compile({ 
		debug, 
		messages,
		onlyOnTouch = false,
		defaultNullable,
		defaultOptional
	}: CompileConfig = {}) {
		const context: Context = {
			index: 0,
			onlyOnTouch,
			optional: defaultOptional,
			nullable: defaultNullable,
			messages: messages ?? defaultMessages,
			rules: {
		
			}
		}

		const schemasSrcCode = this.compileSchema({
			context
		});

		this.async = context.async ?? false;
	
		let srcCode = [
			`const ${Parameters.ERRORS_KEY} = [];`,
			...schemasSrcCode,
			`return ${Parameters.ERRORS_KEY}`
		];

		if ( this.async ) {
			srcCode = [
				`const ${Parameters.ERRORS_KEY} = [];`,
				`const ${Parameters.PROMISE_KEY} = [];`,
				...schemasSrcCode,
				`return Promise.all(${Parameters.PROMISE_KEY})`,
				`.then(() => ${Parameters.ERRORS_KEY})`
			]
		}

		/* c8 ignore start */ // this is for better debugging no need to test coverage
		if ( __DEV__ ) {
			if ( debug ) {
				console.log('srcCode', beautifyFunction(srcCode))
			}
		}
		/* c8 ignore stop */ // this is for better debugging no need to test coverage

		const validate = new Function(
			Parameters.VALUE,
			Parameters.CONTEXT_KEY,
			Parameters.OBJECT_KEY,
			Parameters.ONLY_ON_TOUCH,
			srcCode.join('\t')
		)

		this._validate = (value: Input, onlyOnTouch?: string[]): typeof this.async extends true ? Promise<SchemaError[]> : SchemaError[] => {
			return validate(value, context, value, onlyOnTouch)
		}

		return this;
	}

	public validate(value: Input, onlyOnTouch: Touches<Input> = {}) {
		if ( !this._validate ) {
			this.compile();
		}

		const _onlyOnTouch: string[] = Object.keys(onlyOnTouch)
		.filter((key) => onlyOnTouch[key as FormKey<Input>])
		.map((key) => key);

		return this._validate!(value, _onlyOnTouch)
	}

	public isValid(value: Input, onlyOnTouch: Touches<Input> = {}): Promise<boolean> | boolean {
		if ( this.async ) {
			return (this.validate(value, onlyOnTouch) as Promise<SchemaError[]>).then((res) => res.length === 0)
		}
		return (this.validate(value, onlyOnTouch) as SchemaError[]).length === 0;
	}
}
