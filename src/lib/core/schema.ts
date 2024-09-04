/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { NamedWhenRule } from '../rules/NamedWhenRule';
import {
	type AsyncRuleBooleanMethod,
	type AsyncRuleMethodSchemaError,
	Rule,
	type RuleBooleanMethod,
	type RuleMethodSchemaError
} from '../rules/Rule';
import { type WhenConfig, WhenRule } from '../rules/WhenRule';
import { type ObjectPropertiesSchema } from '../types/SchemaMap';
import {
	type CompileConfig,
	type CompileSchemaConfig,
	type Context,
	type SchemaError
} from '../types/types';
import { PARAMETERS } from '../utils/Utils';
import { IS_DEV } from '../utils/constants';
import { getOnlyOnTouchSrcCode } from '../utils/getOnlyOnTouchSrcCode';
import { defaultMessages, type MessageType } from '../utils/messages';
import { minifyJavaScript } from '../utils/minifyJavaScript';

import { Definitions, type OnlyOnTouch } from './Definitions';

export type OldTestMethodConfig<Method extends (...args: any[]) => any> = {
	/**
	 * When is is "true" errors shows
	 */
	message: string | ((messages: MessageType) => string)
	/**
	 * @deprecated When test is "false" errors shows
	 */
	test: Method
	/**
	 * Servers to make validation unique, otherwise method cannot be changed
	 */
	name?: string
};

export type TestMethodConfig<Method extends (...args: any[]) => any> = {
	/**
	 * When is is "true" errors shows
	 */
	is: Method
	message: string | ((messages: MessageType) => string)
	/**
	 * Servers to make validation unique, otherwise method cannot be changed
	 */
	name?: string
	/**
	 * @deprecated When test is "false" errors shows
	 */
	test?: Method
};

export abstract class Schema<Input = any, Final = any> {
	public input!: Input;
	public final!: Final;
	protected async: boolean = false;

	protected def: Definitions<Input, Final> = new Definitions<Input, Final>();

	protected abstract clone(): any;

	protected abstract message: string;
	protected abstract rule: RuleBooleanMethod<any, any>;

	constructor(def?: Definitions<Input, Final>) {
		if ( def ) {
			this.def = def.clone();
		}
	}

	protected getValueKey(key?: string) {
		return `${PARAMETERS.VALUE}${key ? `${key.indexOf('[') === 0 ? '' : '.'}${key}` : ''}`;
	}

	protected getErrorSyntax(message: string) {
		return `${PARAMETERS.ERRORS_KEY}.push(${PARAMETERS.FN_GET_ERROR}(\`${this.def.path}\`, \`${message.replace('{{key}}', this.def.path)}\`));`;
	}

	// #region Normal Rules
	protected compileNormalRules(
		context: Context, 
		valueKey: string
	): string[] {
		const srcCode: string[][] = [];
		this.def.normalRules
		.forEach((rule, key) => {
			srcCode.push(
				rule.getRule({
					context, 
					path: this.def.path,
					onlyOnTouch: Boolean(this.def._isOnlyOnTouch ?? context.onlyOnTouch),
					ruleMethodName: key.startsWith('_test_') 
						? `${(rule as Rule<Input, Final>).isAsync ? PARAMETERS.FN_ASYNC_TEST : PARAMETERS.FN_TEST}_${context.index = context.index + 1}` 
						: key,
					valueKey
				})
			);
		});

		return srcCode.flat();
	}
	// #endregion Normal Rules

	// #region When Rules
	protected compileWhenSchema(config: CompileSchemaConfig) {
		return this.def.whenRules
		.map((rule) => rule.getWhenRule(this.getValueKey(config.key), config))
		.flat();
	}
	// #endregion When Rules

	protected compileNormalSchema(
		valueKey: string,
		{
			context,
			srcCode = []
		}: CompileSchemaConfig
	) {
		const rule = new Rule({
			isAsync: false,
			isMethodError: false,
			method: this.rule,
			message: this.message
		});
		
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
			ruleMethodName: Object.getPrototypeOf(this).constructor.name,
			valueKey
		});

		const rulesSrcCode = this.compileNormalRules(context, valueKey);

		const fn = `${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')})`;

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
		];

		return mandatoryRules
		.reduce((code, rule) => rule(code, valueKey), fnSrcCode);
	}

	protected getRequiredStringCondition = (valueKey: string) => `if ( ${valueKey} === null || ${valueKey} === undefined ){`;
	protected getNotRequiredStringCondition = (valueKey: string) => `if ( ${valueKey} !== null && ${valueKey} !== undefined ){`;

	protected getMandatoryRules(schema: Schema<any>, context: Context) {
		const mandatoryRules: Array<(fnSrcCode: string[], valueKey: string) => string[]> = [];

		const isOptional = schema.def._isOptional ?? context.optional;
		if ( isOptional !== undefined ) {
			if ( isOptional ) {
				schema.optional();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} !== undefined ){`,
					...fnSrcCode,
					'}'
				]);
			}
			else {
				schema.notOptional();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} === undefined ){`,
					schema.getErrorSyntax(this.def.messageOptional ?? context.messages.notOptional),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				]);
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
				]);
			}
			else {
				schema.notNullable();
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					`if ( ${valueKey} === null ){`,
					schema.getErrorSyntax(this.def.messageNullable ?? context.messages.notNullable),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				]);
			}
		}

		const _isRequired = schema.def._isRequired ?? context.nullable;
		if ( _isRequired !== undefined ) {
			if ( _isRequired ) {
				schema.required();
			
				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					this.getRequiredStringCondition(valueKey),
					schema.getErrorSyntax(this.def.messageRequired ?? context.messages.required),
					'}',
					'else {',
					...fnSrcCode,
					'}'
				]);
			}
			else {
				schema.notRequired();

				mandatoryRules.push((fnSrcCode: string[], valueKey: string) => [
					this.getNotRequiredStringCondition(valueKey),
					...fnSrcCode,
					'}'
				]);
			}
		}

		const isOnlyOnTouch = schema.def._isOnlyOnTouch ?? context.onlyOnTouch;
		if ( isOnlyOnTouch !== undefined ) { 
			if ( isOnlyOnTouch ) {
				schema.onlyOnTouch();
				mandatoryRules.push((fnSrcCode: string[]) => getOnlyOnTouchSrcCode(
					schema.def.path,
					fnSrcCode
				));
			}
			else {
				schema.notOnlyOnTouch();
			}
		}

		return mandatoryRules;
	}

	protected compileSchema({
		context, 
		key, 
		srcCode = [],
		path
	}: CompileSchemaConfig) {
		this.def.path = path ?? key ?? '';

		if ( this.def.whenRules && this.def.whenRules.length ) {
			return this.compileWhenSchema({
				context, 
				key, 
				srcCode,
				path
			});
		}

		return this.compileNormalSchema(
			this.getValueKey(key), 
			{
				context, 
				key, 
				srcCode,
				path
			}
		);
	}

	private addTest<Form = this['final']>(
		isAsync: boolean,
		method: TestMethodConfig<RuleBooleanMethod<Input, Form>> | 
		OldTestMethodConfig<RuleBooleanMethod<Input, Form>> | 
		RuleMethodSchemaError<Input, Form> | 
		AsyncRuleMethodSchemaError<Input, Form> | 
		TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>> | 
		OldTestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	) {
		const _this = this.clone();

		if ( typeof method === 'object' ) {
			_this.def.normalRules.set(
				method.name ?? `_test_${this.def.normalRules.size}`,
				new Rule({
					isAsync,
					isMethodError: false,
					method: (method as TestMethodConfig<RuleBooleanMethod<Input, Form>>).is ?? ((...args) => !(method as OldTestMethodConfig<RuleBooleanMethod<Input, Form>>).test(...args)),
					message: method.message
				})
			);

			return _this;
		}

		_this.def.normalRules.set(
			`_test_${this.def.normalRules.size}`,
			new Rule({
				isAsync,
				isMethodError: true,
				method
			})
		);

		return _this;
	}

	/**
	 * Method for custom validation
	 */
	public test<Form = this['final']>(
		method: TestMethodConfig<RuleBooleanMethod<Input, Form>>
	): ObjectPropertiesSchema<Input, Form>;
	public test<Form = this['final']>(
		method: RuleMethodSchemaError<Input, Form>
	): ObjectPropertiesSchema<Input, Form>;
	public test<Form = this['final']>(
		method: OldTestMethodConfig<RuleBooleanMethod<Input, Form>>
	): ObjectPropertiesSchema<Input, Form>;
	public test<Form = this['final']>(
		method: TestMethodConfig<RuleBooleanMethod<Input, Form>> | 
		OldTestMethodConfig<RuleBooleanMethod<Input, Form>> | 
		RuleMethodSchemaError<Input, Form>
	): ObjectPropertiesSchema<Input, Form> {
		return this.addTest(false, method);
	}

	/**
	 * Method for async custom validation
	 */
	public asyncTest<Form = this['final']>(
		method: TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	): this;
	public asyncTest<Form = this['final']>(
		method: AsyncRuleMethodSchemaError<Input, Form>,
	): this;
	public asyncTest<Form = this['final']>(
		method: OldTestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	): this;
	public asyncTest<Form = this['final']>(
		method: AsyncRuleMethodSchemaError<Input, Form> | TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>> | OldTestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	): this {
		return this.addTest(true, method);
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
	): this;
	public when<Value = any, Form = any, S extends Schema<any> = this>(
		config: WhenConfig<S, Value, Form>
	): this;
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
				(config!).then,
				(config!).otherwise
			);

			_this.def.whenRules.push(
				new NamedWhenRule({
					namedValueKey: name,
					name: 'custom_when',
					method: (config!).is,
					onlyOnTouch: false,
					then: thenSchema,
					otherwise: otherwiseSchema
				})
			);

			return _this;
		}

		const {
			_this,
			thenSchema,
			otherwiseSchema
		} = this._when<S>(
			name.then,
			name.otherwise
		);

		_this.def.whenRules.push(
			new WhenRule({
				name: 'custom_when',
				method: name.is,
				onlyOnTouch: false,
				then: thenSchema,
				otherwise: otherwiseSchema
			})
		);

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
		if ( IS_DEV ) {
			thenClone.def.normalRules.forEach((_, key) => {
				if ( this.def.normalRules.has(key) ) {
					throw new Error(`Method ${key} already exists outside of 'onlyOnTouch'. To prevent confusion decide if you want '${key}' outside or inside 'onlyOnTouch'`);
				}
			});
		}
		/* c8 ignore end */

		_this.def.normalRules.set(
			'onlyOnTouchRule',
			new WhenRule({
				name: 'onlyOnTouchRule',
				method: () => true,
				onlyOnTouch: true,
				then: thenClone
			})
		);

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
		};
		
		const schemasSrcCode = this.compileSchema({
			context
		});

		this.async = context.async ?? false;

		const code = minifyJavaScript(
			[
				`function ${PARAMETERS.FN_GET_ERROR}(path, error) { return { error: error, path: path } };`,
				`function ${PARAMETERS.FN_CONTEXT}(path) { return { context: ${PARAMETERS.CONTEXT_KEY}, form: ${PARAMETERS.OBJECT_KEY}, path: path } };`,
				`const ${PARAMETERS.ERRORS_KEY} = [];`,
				this.async ? `const ${PARAMETERS.PROMISE_KEY} = [];` : '',
				schemasSrcCode,
				this.async ? [
					`return Promise.all(${PARAMETERS.PROMISE_KEY})`,
					`.then(() => ${PARAMETERS.ERRORS_KEY})`
				] : `return ${PARAMETERS.ERRORS_KEY}`
			]
			.flat()
			.join('')
		);

		/* c8 ignore start */ // this is for better debugging no need to test coverage
		if ( IS_DEV ) {
			if ( debug ) {
			/* eslint-disable no-console */
				console.log('code', code);
			}
		}

		/* c8 ignore stop */ // this is for better debugging no need to test coverage
		const validate = new Function(
			PARAMETERS.VALUE,
			PARAMETERS.CONTEXT_KEY,
			PARAMETERS.OBJECT_KEY,
			PARAMETERS.ONLY_ON_TOUCH,
			code
		);

		this.def._validate = (value: any, onlyOnTouch?: OnlyOnTouch<Input>): typeof this.async extends true ? Promise<SchemaError[]> : SchemaError[] => {
			return validate(value, context, value, onlyOnTouch);
		};

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

		return this.def._validate!(value, onlyOnTouch);
	}
}
