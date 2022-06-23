/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AsyncRule, AsyncRuleBooleanMethod, AsyncRuleMethodSchemaError } from '../rules/AsyncRule'
import { NamedWhenRule } from '../rules/NamedWhenRule'
import { Rule, RuleBooleanMethod, RuleMethodSchemaError } from '../rules/Rule'
import { WhenConfig, WhenRule } from '../rules/WhenRule'
import { FormKey } from '../types/FormKey'
import { ObjectPropertiesSchema } from '../types/SchemaMap'
import { CompileConfig, CompileSchemaConfig, Context, SchemaError } from '../types/types'
import { Parameters, SchemaTypes } from '../utils/Utils'
import { beautifyFunction } from '../utils/beautifyFunction'
import { getOnlyOnTouchSrcCode } from '../utils/getOnlyOnTouchSrcCode'
import { defaultMessages, MessageType } from '../utils/messages'

import { Definitions } from './Definitions'

type TestMethodConfig<Method extends Function> = {
	/**
	 * When test is "false" errors shows
	 */
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

	protected def: Definitions<Input, Final> = new Definitions<Input, Final>();
	public get isOnlyOnTouch(): boolean {
		return this.def._isOnlyOnTouch ?? false;
	}

	public get isOptional(): boolean {
		return this.def._isOptional ?? false;
	}

	public get isNullable(): boolean {
		return this.def._isNullable ?? false;
	}

	public get isRequired(): boolean {
		return this.def._isRequired ?? false;
	}
	protected abstract clone(): any

	protected abstract type: SchemaTypes
	protected abstract message: string
	protected abstract rule: RuleBooleanMethod<any, any>

	constructor(def?: Definitions<Input, Final>) {
		if ( def ) {
			this.def = def.clone();
		}
	}

	protected getValueKey(key?: string) {
		return `${Parameters.VALUE}${key ? `${key.indexOf('[') === 0 ? '' : '.'}${key}` : ''}`
	}

	protected getMessage(message: string): string {
		return `\`${message.replace('{{key}}', this.def.path)}\``
	}
	
	protected getErrorSyntax(message: string) {
		return [
			`${Parameters.ERRORS_KEY}.push({`,
			`	path: \`${this.def.path}\`,`,
			`	error: ${this.getMessage(message)}`,
			'});'
		]
	}

	// #region Normal Rules
	protected compileNormalRules(
		context: Context, 
		valueKey: string, 
		arrayKey?: string
	): string[] {
		const srcCode: string[] = [];
		this.def.normalRules.forEach((rule, key) => {
			srcCode.push(
				...rule.getRule({
					context, 
					path: this.def.path,
					onlyOnTouch: Boolean(this.def._isOnlyOnTouch ?? context.onlyOnTouch),
					ruleMethodName: key,
					ruleType: this.type,
					valueKey,
					arrayKey
				})
			)
		})
		return srcCode
	}
	// #endregion Normal Rules

	// #region When Rules
	protected compileWhenSchema(
		config: CompileSchemaConfig,
		arrayKey?: string
	) {
		const srcCode: string[] = [];
		this.def.whenRules.forEach((rule) => {
			const valueKey = this.getValueKey(config.key)

			srcCode.push(
				...rule.getWhenRule(valueKey, config, arrayKey)
			)
		})
		return srcCode
	}
	// #endregion When Rules

	protected compileNormalSchema(
		valueKey: string, 
		context: Context, 
		srcCode: string[],
		arrayKey: string | undefined
	) {
		const rule = new Rule(
			'MESSAGE',
			this.rule,
			this.message
		)
		
		// Order is important for mandatoryRules
		const mandatoryRules = this.getMandatoryRules(this, context);

		const {
			methodName,
			parameters,
			srcCode: errorsSyntax
		} = rule.getRuleSrcCode({
			context,
			path: this.def.path,
			onlyOnTouch: Boolean(this.def._isOnlyOnTouch ?? context.onlyOnTouch),
			ruleMethodName: `is_${this.type}`,
			ruleType: this.type,
			valueKey,
			arrayKey
		})

		const rulesSrcCode = this.compileNormalRules(context, valueKey, arrayKey);

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

		return mandatoryRules
		.reduce((fnSrcCode, rule) => rule(fnSrcCode, valueKey), fnSrcCode)
	}

	protected getMandatoryRules(schema: Schema<any>, context: Context) {
		const mandatoryRules: Array<(fnSrcCode: string[], valueKey: string) => string[]> = []

		const isOptional = schema.def._isOptional ?? context.optional;
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
					...schema.getErrorSyntax(this.def.messageOptional ?? context.messages.notOptional),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				])
			}
		}

		const isNullable = schema.def._isNullable ?? context.nullable;
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
					...schema.getErrorSyntax(this.def.messageNullable ?? context.messages.notNullable),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				])
			}
		}

		const _isRequired = schema.def._isRequired ?? context.nullable;
		if ( _isRequired !== undefined ) {
			if ( _isRequired ) {
				schema.required();
			
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} === null || ${valueKey} === undefined ){`,
					...schema.getErrorSyntax(this.def.messageRequired ?? context.messages.required),
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

		const isOnlyOnTouch = schema.def._isOnlyOnTouch ?? context.onlyOnTouch;
		if ( isOnlyOnTouch !== undefined ) { 
			if ( isOnlyOnTouch ) {
				schema.onlyOnTouch();
				mandatoryRules.push((fnSrcCode: string[]) => getOnlyOnTouchSrcCode(
					schema.def.path,
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
		path,
		arrayKey
	}: CompileSchemaConfig) {
		const valueKey = this.getValueKey(key)
		this.def.path = path ?? key ?? '';

		if ( this.def.whenRules && this.def.whenRules.length ) {
			return this.compileWhenSchema(
				{
					context, 
					key, 
					srcCode,
					path
				}, 
				arrayKey
			)
		}

		return this.compileNormalSchema(valueKey, context, srcCode, arrayKey);
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
		const _this = this.clone();

		if ( typeof method === 'object' ) {
			_this.def.normalRules.set(
				method.name ?? `test_${this.def.normalRules.size}`,
				new Rule(
					'MESSAGE',
					method.test,
					method.message
				)
			)

			return _this;
		}

		_this.def.normalRules.set(
			method.name ?? `test_${this.def.normalRules.size}`,
			new Rule(
				'METHOD_ERROR',
				method
			)
		)

		return _this;
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
	): this {
		const _this = this.clone();

		if ( typeof method === 'object' ) {
			_this.def.normalRules.set(
				method.name ?? `asyncTest_${this.def.normalRules.size}`,
				new AsyncRule(
					'MESSAGE',
					method.test,
					method.message
				)
			)

			return _this;
		}

		_this.def.normalRules.set(
			method.name ?? `asyncTest${this.def.normalRules.size}`,
			new AsyncRule(
				'METHOD_ERROR',
				method
			)
		)

		return _this;
	}

	private _when<S extends Schema<any> = this>(
		then: (schema: S) => S,
		otherwise?: ((schema: S) => S)
	) {
		const _this = this.clone();

		const thenThis = this.clone();

		thenThis.def.whenRules = [];
		thenThis.def.normalRules = new Map(this.def.normalRules);

		const thenSchema = then(thenThis);

		const otherwiseThis = this.clone();
		otherwiseThis.def.whenRules = [];
		otherwiseThis.def.normalRules = new Map(this.def.normalRules);
		let otherwiseSchema: S | undefined = otherwiseThis;

		_this.def.normalRules = new Map();
		
		if ( otherwise ) {
			otherwiseSchema = otherwise(otherwiseThis);
		}

		return {
			_this,
			thenSchema,
			otherwiseSchema
		};
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
	public when<Value = any, Form = any, S extends Schema<any> = this>(
		name: string,
		config: WhenConfig<S, Value, Form>
	): this
	public when<Value = any, Form = any, S extends Schema<any> = this>(
		config: WhenConfig<S, Value, Form>
	): this
	public when<Value = any, Form = any, S extends Schema<any> = this>(
		name: WhenConfig<S, Value, Form> | string,
		config?: WhenConfig<S, Value, Form>
	): this {
		if ( typeof name === 'string' ) {
			const {
				_this,
				thenSchema,
				otherwiseSchema
			} = this._when<S>(
				(config as WhenConfig<S, Value, Form>).then,
				(config as WhenConfig<S, Value, Form>).otherwise
			)

			_this.def.whenRules.push(
				new NamedWhenRule(
					name,
					'custom_when',
					this.type,
					(config as WhenConfig<S, Value, Form>).is,
					false,
					thenSchema,
					otherwiseSchema
				)
			)

			return _this;
		}

		const {
			_this,
			thenSchema,
			otherwiseSchema
		} = this._when<S>(
			name.then,
			name.otherwise
		)

		_this.def.whenRules.push(
			new WhenRule(
				'custom_when',
				this.type,
				name.is,
				false,
				thenSchema,
				otherwiseSchema
			)
		)

		return _this;
	} 

	/**
	 * Makes schema validation only on touch 
	 * (meaning value will only be validated if key 
	 * is present in onlyOnTouch: OnlyOnTouch<Input>).
	 */
	public onlyOnTouch(onlyOnTouch?: (schema: this) => this): this {
		const _this = this.clone() as this;
		if ( onlyOnTouch === undefined ) {
			_this.def._isOnlyOnTouch = true;
			return _this;
		}

		let thenClone = this.clone() as this;
		thenClone.def._isOnlyOnTouch = undefined;
		thenClone.def._isOptional = undefined;
		thenClone.def._isNullable = undefined;
		thenClone.def._isRequired = undefined;
		thenClone.def.whenRules = [];
		thenClone.def.normalRules = new Map();

		thenClone = onlyOnTouch(thenClone);

		/* c8 ignore start */
		if ( __DEV__ ) {
			thenClone.def.normalRules.forEach((_, key) => {
				if ( this.def.normalRules.has(key) ) {
					throw new Error(`Method ${key} already exists outside of 'onlyOnTouch'. To prevent confusion decide if you want '${key}' outside or inside 'onlyOnTouch'`)
				}
			})
		}
		/* c8 ignore end */

		_this.def.normalRules.set(
			'onlyOnTouchRule',
			new WhenRule(
				'onlyOnTouchRule',
				this.type,
				() => true,
				true,
				thenClone
			)
		)

		return _this;
	}

	/**
	 * Makes schema validation validation regardless of "touches" 
	 * (meaning value will be validated even if key 
	 * is present in onlyOnTouch: OnlyOnTouch<Input>).
	 */
	public notOnlyOnTouch(): this {
		const _this = this.clone();
		_this.def._isOnlyOnTouch = false;

		return _this;
	}
	
	/**
	 * Makes schema validation required (meaning value can not be undefined and null).
	 */
	public required(message?: string): this {
		const _this = this.clone();
		_this.def._isOptional = undefined;
		_this.def._isNullable = undefined;
		_this.def._isRequired = true;
		_this.def.messageRequired = message;

		return _this;
	}

	/**
	 * Makes schema validation not required (meaning value can be undefined and null).
	 */
	public notRequired(): this {
		const _this = this.clone();
		_this.def._isOptional = undefined;
		_this.def._isNullable = undefined;
		_this.def._isRequired = false;

		return _this;
	}

	/**
	 * Makes schema validation optional (meaning value can be undefined).
	 */
	public optional(): this {
		const _this = this.clone();
		_this.def._isOptional = true;
		_this.def._isRequired = undefined;

		return _this;
	}

	/**
	 * Makes schema validation not optional (meaning value can not be undefined).
	 */
	public notOptional(message?: string): this {
		const _this = this.clone();
		_this.def._isOptional = false;
		_this.def._isRequired = undefined;
		_this.def.messageOptional = message;

		return _this;
	}

	/**
	 * Makes schema validation nullable (meaning value can be null).
	 */
	public nullable(): this {
		const _this = this.clone();
		_this.def._isNullable = true;
		_this.def._isRequired = undefined;

		return _this;
	}

	/**
	 * Makes schema validation not nullable (meaning value can not be null).
	 */
	public notNullable(message?: string): this {
		const _this = this.clone();
		_this.def._isNullable = false;
		_this.def._isRequired = undefined;
		_this.def.messageNullable = message;

		return _this;
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

		this.def._validate = (value: any, onlyOnTouch?: OnlyOnTouch<Input>): typeof this.async extends true ? Promise<SchemaError[]> : SchemaError[] => {
			return validate(value, context, value, onlyOnTouch)
		}

		return this;
	}

	/**
	 * Validates form and returns an array of errors {@link SchemaError}
	 * @param value - form input
	 * @param onlyOnTouch - array of keys that inform the schema if a value
	 * was touched. Works with only with {@link Schema#onlyOnTouch} 
	 * @returns {SchemaError}
	 */
	public validate(value: Input, onlyOnTouch: OnlyOnTouch<Input> = []): SchemaError[] | Promise<SchemaError[]> {
		if ( !this.def._validate ) {
			this.compile();
		}

		return this.def._validate!(value, onlyOnTouch)
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
