/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { shallowClone } from '@resourge/shallow-clone'

import { AsyncRule, AsyncRuleBooleanMethod, AsyncRuleMethodSchemaError } from '../rules/AsyncRule'
import { BaseRule } from '../rules/BaseRule'
import { Rule, RuleBooleanMethod, RuleMethodSchemaError } from '../rules/Rule'
import { WhenConfig, WhenRule } from '../rules/WhenRule'
import { FormKey } from '../types/FormKey'
import { ObjectPropertiesSchema } from '../types/SchemaMap'
import { CompileConfig, CompileSchemaConfig, Context, SchemaError } from '../types/types'
import { Parameters, SchemaTypes } from '../utils/Utils'
import { beautifyFunction } from '../utils/beautifyFunction'
import { getOnlyOnTouchSrcCode } from '../utils/getOnlyOnTouchSrcCode'
import { defaultMessages, MessageType } from '../utils/messages'

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export const __DEV__: boolean
}

type TestMethodConfig<Method extends Function> = {
	test: Method
	message: string | ((messages: MessageType) => string)
	/**
	 * Servers to make validation unique, otherwise method cannot be changed
	 */
	name?: string
}

type OnlyOnTouch<Input> = Array<Input extends any[] | Record<string, any> ? FormKey<Input> : string>

export abstract class Schema<Input = any, Final = any> {
	public Input!: Input;
	public final!: Final;
	protected async: boolean = false;
	protected _isOnlyOnTouch?: boolean;
	public get isOnlyOnTouch(): boolean {
		return this._isOnlyOnTouch ?? false;
	}

	protected _isOptional?: boolean;
	protected messageOptional?: string;
	public get isOptional(): boolean {
		return this._isOptional ?? false;
	}

	protected _isNullable?: boolean;
	protected messageNullable?: string;
	public get isNullable(): boolean {
		return this._isNullable ?? false;
	}

	protected _isRequired?: boolean;
	protected messageRequired?: string;
	public get isRequired(): boolean {
		return this._isRequired ?? false;
	}

	protected abstract type: SchemaTypes
	protected abstract message: string
	protected abstract rule: RuleBooleanMethod<any, any>

	protected _validate: ((value: any, onlyOnTouch?: OnlyOnTouch<Input>) => Promise<SchemaError[]> | SchemaError[]) | undefined

	/**
	 * Path for current value
	 */
	protected path: string = '';
	protected normalRules: Map<string, BaseRule<Input, Final, Function>> = new Map();
	protected whenRules: WhenRule[] = []

	protected getValueKey(key?: string) {
		return `${Parameters.VALUE}${key ? `${key.indexOf('[') === 0 ? '' : '.'}${key}` : ''}`
	}

	protected getMessage(message: string): string {
		return `\`${message.replace('{{key}}', this.path)}\``
	}
	
	protected getErrorSyntax(message: string) {
		return [
			`${Parameters.ERRORS_KEY}.push({`,
			`	path: \`${this.path}\`,`,
			`	error: ${this.getMessage(message)}`,
			'});'
		]
	}

	// #region Normal Rules
	protected compileNormalRules(context: Context, valueKey: string): string[] {
		const srcCode: string[] = [];
		this.normalRules.forEach((rule, key) => {
			srcCode.push(
				...rule.getRule(
					{
						context, 
						path: this.path
					},
					valueKey,
					key,
					this.type,
					Boolean(this._isOnlyOnTouch ?? context.onlyOnTouch)
				)
			)
		})
		return srcCode
	}
	// #endregion Normal Rules

	// #region When Rules
	protected compileWhenSchema(config: CompileSchemaConfig) {
		const srcCode: string[] = [];
		this.whenRules.forEach((rule) => {
			const valueKey = this.getValueKey(config.key)

			srcCode.push(
				...rule.getWhenRule(valueKey, config)
			)
		})
		return srcCode
	}
	// #endregion When Rules

	protected compileNormalSchema(
		valueKey: string, 
		context: Context, 
		srcCode: string[]
	) {
		const rule = new Rule(
			'MESSAGE',
			this.rule,
			this.message
		)

		const {
			methodName,
			parameters,
			srcCode: errorsSyntax
		} = rule.getRuleSrcCode(
			{
				context,
				path: this.path
			},
			`is_${this.type}`,
			this.type,
			valueKey,
			false
		)

		const rulesSrcCode = this.compileNormalRules(context, valueKey);

		const fn = `${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')})`;

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

	protected getMandatoryRules(schema: Schema<any>, context: Context) {
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
					...schema.getErrorSyntax(this.messageOptional ?? context.messages.notOptional),
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
					...schema.getErrorSyntax(this.messageNullable ?? context.messages.notNullable),
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
					`if ( ${valueKey} === null || ${valueKey} === undefined ){`,
					...schema.getErrorSyntax(this.messageRequired ?? context.messages.required),
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
		if ( isOnlyOnTouch !== undefined ) { 
			if ( isOnlyOnTouch ) {
				schema.onlyOnTouch();
				mandatoryRules.push((fnSrcCode: string[]) => getOnlyOnTouchSrcCode(
					schema.path,
					fnSrcCode
				))
			}
			else {
				schema.notOnlyOnTouch();
			}
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
			return this.compileWhenSchema({
				context, 
				key, 
				srcCode,
				path
			})
		}

		return this.compileNormalSchema(valueKey, context, srcCode);
	}

	/**
	 * Method for custom validation
	 */
	public test<Form = this['final']>(
		method: RuleMethodSchemaError<Input, Form>,
	): ObjectPropertiesSchema<Input, Form>
	public test<Form = this['final']>(
		method: TestMethodConfig<RuleBooleanMethod<Input, Form>>
	): ObjectPropertiesSchema<Input, Form>
	public test<Form = this['final']>(
		method: RuleMethodSchemaError<Input, Form> | TestMethodConfig<RuleBooleanMethod<Input, Form>>
	): ObjectPropertiesSchema<Input, Form> {
		if ( typeof method === 'object' ) {
			this.normalRules.set(
				method.name ?? `test_${this.normalRules.size}`,
				new Rule(
					'MESSAGE',
					method.test,
					method.message
				)
			)

			return shallowClone(this) as any;
		}

		this.normalRules.set(
			method.name ?? `test_${this.normalRules.size}`,
			new Rule(
				'METHOD_ERROR',
				method
			)
		)

		return shallowClone(this) as any;
	}

	/**
	 * Method for async custom validation
	 */
	public asyncTest<Form = this['final']>(
		method: AsyncRuleMethodSchemaError<Input, Form>,
	): this
	public asyncTest<Form = this['final']>(
		method: TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	): this
	public asyncTest<Form = this['final']>(
		method: AsyncRuleMethodSchemaError<Input, Form> | TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	) {
		if ( typeof method === 'object' ) {
			this.normalRules.set(
				method.name ?? `asyncTest_${this.normalRules.size}`,
				new AsyncRule(
					'MESSAGE',
					method.test,
					method.message
				)
			)

			return shallowClone(this);
		}

		this.normalRules.set(
			method.name ?? `asyncTest${this.normalRules.size}`,
			new AsyncRule(
				'METHOD_ERROR',
				method
			)
		)

		return shallowClone(this);
	}

	/**
	 * Makes schema conditional. Meaning when `is` is true 
	 * it will validate with `then schema` otherwise will 
	 * validate with `otherwise schema`.
	 * @param {WhenConfig} 
	 * @example
	 * ```Typescript
	 * number()
	 * .optional() // Validation will be included in `then` and `otherwise`
	 * .when({
	 * 	is: (value, form) => value === 10,
	 *  then: (schema) => schema.required() ,
	 *  otherwise: (schema) => schema.notOptional()
	 * })
	 * ```
	 */
	public when<Form = any, S extends Schema<any> = this>({
		is,
		then,
		otherwise
	}: WhenConfig<S, Input, Form>) {
		const thenThis = shallowClone(this) as unknown as S;

		thenThis.whenRules = [];
		thenThis.normalRules = new Map(this.normalRules);

		const thenSchema = then(thenThis);

		const otherwiseThis = shallowClone(this) as unknown as S;
		otherwiseThis.whenRules = [];
		otherwiseThis.normalRules = new Map(this.normalRules);
		let otherwiseSchema: S | undefined = otherwiseThis;

		this.normalRules = new Map();
		
		if ( otherwise ) {
			otherwiseSchema = otherwise(otherwiseThis);
		}

		this.whenRules.push(
			new WhenRule(
				'custom_when',
				this.type,
				is,
				thenSchema,
				otherwiseSchema
			)
		)

		return shallowClone(this);
	} 

	/**
	 * Makes schema validation only on touch 
	 * (meaning value will only be validated if key 
	 * is present in onlyOnTouch: OnlyOnTouch<Input>).
	 */
	public onlyOnTouch(onlyOnTouch?: (schema: this) => this) {
		if ( onlyOnTouch === undefined ) {
			this._isOnlyOnTouch = true;
			return shallowClone(this);
		}

		let thenClone = shallowClone(this);
		thenClone._isOnlyOnTouch = undefined;
		thenClone._isOptional = undefined;
		thenClone._isNullable = undefined;
		thenClone._isRequired = undefined;
		thenClone.whenRules = [];
		thenClone.normalRules = new Map();

		thenClone = onlyOnTouch(thenClone);

		if ( __DEV__ ) {
			thenClone.normalRules.forEach((_, key) => {
				if ( this.normalRules.has(key) ) {
					throw new Error(`Method ${key} already exists outside of 'onlyOnTouch'. To prevent confusion decide if you want '${key}' outside or inside 'onlyOnTouch'`)
				}
			})
		}

		this.normalRules.set(
			'onlyOnTouchRule',
			new WhenRule(
				'onlyOnTouchRule',
				this.type,
				() => true,
				thenClone
			)
		)
		return shallowClone(this);
	}

	/**
	 * Makes schema validation validation regardless of "touches" 
	 * (meaning value will be validated even if key 
	 * is present in onlyOnTouch: OnlyOnTouch<Input>).
	 */
	public notOnlyOnTouch() {
		this._isOnlyOnTouch = false;

		return shallowClone(this);
	}
	
	/**
	 * Makes schema validation required (meaning value can not be undefined and null).
	 */
	public required(message?: string) {
		this._isOptional = undefined;
		this._isNullable = undefined;
		this._isRequired = true;
		this.messageRequired = message;

		return shallowClone(this);
	}

	/**
	 * Makes schema validation not required (meaning value can be undefined and null).
	 */
	public notRequired() {
		this._isOptional = undefined;
		this._isNullable = undefined;
		this._isRequired = false;

		return shallowClone(this);
	}

	/**
	 * Makes schema validation optional (meaning value can be undefined).
	 */
	public optional() {
		this._isOptional = true;
		this._isRequired = undefined;

		return shallowClone(this);
	}

	/**
	 * Makes schema validation not optional (meaning value can not be undefined).
	 */
	public notOptional(message?: string) {
		this._isOptional = false;
		this._isRequired = undefined;
		this.messageOptional = message;

		return shallowClone(this);
	}

	/**
	 * Makes schema validation nullable (meaning value can be null).
	 */
	public nullable() {
		this._isNullable = true;
		this._isRequired = undefined;

		return shallowClone(this);
	}

	/**
	 * Makes schema validation not nullable (meaning value can not be null).
	 */
	public notNullable(message?: string) {
		this._isNullable = false;
		this._isRequired = undefined;
		this.messageNullable = message;

		return shallowClone(this);
	}

	/**
	 * Creates validation method. 
	 * @param config - {@link CompileConfig} 
	 */
	public compile({ 
		debug, 
		messages = {},
		onlyOnTouch = false,
		defaultNullable,
		defaultOptional
	}: CompileConfig = {}): this {
		const context: Context = {
			index: 0,
			onlyOnTouch,
			optional: defaultOptional,
			nullable: defaultNullable,
			messages: {
				...defaultMessages,
				...messages
			},
			rules: {},
			onlyOnTouchErrors: {}
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
				/* eslint-disable no-console */
				console.log('method', beautifyFunction(srcCode))
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

		this._validate = (value: any, onlyOnTouch?: OnlyOnTouch<Input>): typeof this.async extends true ? Promise<SchemaError[]> : SchemaError[] => {
			return validate(value, context, value, onlyOnTouch)
		}

		return shallowClone(this);
	}

	/**
	 * Validates form and returns an array of errors {@link SchemaError}
	 * @param value - form input
	 * @param onlyOnTouch - array of keys that inform the schema if a value
	 * was touched. Works with only with {@link Schema#onlyOnTouch} 
	 * @returns {SchemaError}
	 */
	public validate(value: Input, onlyOnTouch: OnlyOnTouch<Input> = []): SchemaError[] | Promise<SchemaError[]> {
		if ( !this._validate ) {
			this.compile();
		}

		return this._validate!(value, onlyOnTouch)
	}

	/**
	 * Validates form and returns a boolean.
	 * @param value - form input
	 * @param onlyOnTouch - array of keys that inform the schema if a value
	 * was touched. Works with only with {@link Schema#onlyOnTouch} 
	 * @returns {boolean}
	 */
	public isValid(value: Input, onlyOnTouch: OnlyOnTouch<Input> = []): Promise<boolean> | boolean {
		if ( this.async ) {
			return (this.validate(value, onlyOnTouch) as Promise<SchemaError[]>).then((res) => res.length === 0)
		}
		return (this.validate(value, onlyOnTouch) as SchemaError[]).length === 0;
	}
}
