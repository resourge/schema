/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getError, type ValidationContext } from '../rules/BaseRule';
import {
	type AsyncRuleBooleanMethod,
	type AsyncRuleMethodSchemaError,
	getOnlyTouchRule,
	getRule,
	type RuleBooleanMethod,
	type RuleMethodSchemaError
} from '../rules/Rule';
import { getWhenRule, type WhenConfig } from '../rules/WhenRule';
import { type OnlyOnTouch } from '../types/FormKey';
import { type ObjectPropertiesSchema } from '../types/SchemaMap';
import { type CompileSchemaConfig, type Context } from '../types/SchemaTypes';
import { type SchemaError } from '../types/types';
import { IS_DEV } from '../utils/constants';
import { defaultMessages, type MessageType } from '../utils/messages';

import { Definitions } from './Definitions';

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
	protected message: string = '';
	protected abstract rule: RuleBooleanMethod<any, any>;

	constructor(message?: string, def?: Definitions<Input, Final>) {
		this.message = message ?? this.message;
		if ( def ) {
			this.def = def.clone();
		}
	}

	protected clone(): any {
		return new (this.constructor as new(...args: any[]) => any)(this.message, this.def);
	};

	// #region Normal Rules
	protected compileNormalRules(
		context: Context
	): Function[] {
		const srcCode: Function[] = [];

		this.def.normalRules
		.forEach((rule) => {
			srcCode.push(
				rule.type === 'OnlyOnTouchRule'
					? getOnlyTouchRule(rule, context)
					: getRule(rule, context)
			);
		});

		return srcCode.flat();
	}
	// #endregion Normal Rules

	// #region When Rules
	protected compileWhenSchema(config: CompileSchemaConfig) {
		const whenCode = this.def.whenRules.map((rule) => getWhenRule(rule, config));

		const l = whenCode.length;
		return (value: any, validationContext: ValidationContext<any>) => {
			let x = 0; 
			while (x < l) {
				const fn = whenCode[x];
				fn(value, validationContext);
				x++;
			}
		};
	}
	// #endregion When Rules

	protected compileNormalSchema(
		{
			context,
			srcCode
		}: CompileSchemaConfig
	) {
		const rulesSrcCode = this.compileNormalRules(context);

		if ( srcCode ) {
			rulesSrcCode.push(srcCode);
		}

		const l = rulesSrcCode.length;

		const _message: string = (
			typeof this.message === 'string' 
				? this.message 
				: (this.message as ((messages: MessageType) => string))(defaultMessages)
		);

		return this.getMandatoryRules(
			this, 
			(value: any, validationContext: ValidationContext<Final>) => {
				if (!this.rule(value, validationContext.parent, validationContext)) {
					validationContext.context.errors.push(getError(validationContext.path, _message));
					return;
				}

				for (let x = 0; x < l; x++) {
					const fn = rulesSrcCode[x];
					fn(value, validationContext);
				}
			}
		);
	}

	protected getRequiredStringCondition = (value: any) => value == null;
	protected getNotRequiredStringCondition = (value: any) => value != null;

	private createCondition(
		fnSrcCode: Function, 
		condition: (value: any) => boolean
	) {
		return (value: any, validationContext: ValidationContext<Final>) => {
			if ( condition(value) ) {
				fnSrcCode(value, validationContext);
			}
		};
	}

	private createErrorCondition(
		fnSrcCode: (value: any, validationContext: ValidationContext<Final>) => void, 
		message: string, 
		condition: (value: any) => boolean
	) {
		return (value: any, validationContext: ValidationContext<Final>) => {
			if (condition(value)) {
				validationContext.context.errors.push(getError(validationContext.path, message));
				return;
			}
			fnSrcCode(value, validationContext);
		};
	}

	protected getMandatoryRules(schema: Schema<any>, fnSrcCode: (value: any, validationContext: ValidationContext<Final>) => void) {
		const {
			isOptional, isNullable, isRequired, isOnlyOnTouch 
		} = schema.def;

		if ( isOptional !== undefined ) {
			return !isOptional
				? this.createErrorCondition(
					fnSrcCode,
					this.def.messageOptional ?? defaultMessages.notOptional,
					(value) => value === undefined
				) : this.createCondition(
					fnSrcCode,
					(value) => value !== undefined
				);
		}

		if ( isNullable !== undefined ) {
			return !isNullable
				? this.createErrorCondition(
					fnSrcCode,
					this.def.messageNullable ?? defaultMessages.notNullable,
					(value) => value === null
				) : this.createCondition(
					fnSrcCode,
					(value) => value !== null
				);
		}

		if ( isRequired !== undefined ) {
			return isRequired
				? this.createErrorCondition(
					fnSrcCode,
					this.def.messageRequired ?? defaultMessages.required,
					this.getRequiredStringCondition
				) : this.createCondition(
					fnSrcCode,
					(value) => this.getNotRequiredStringCondition(value)
				);
		}

		if ( isOnlyOnTouch ) { 
			return (value: any, validationContext: ValidationContext<Final>) => {
				if ( validationContext.context.onlyOnTouch.some((key) => key === '*' || key.includes(validationContext.path) || validationContext.path.includes(key)) ) {
					fnSrcCode(value, validationContext);
					validationContext.context.onlyOnTouchErrors[validationContext.path] = validationContext.context.errors.filter((error) => error.path === validationContext.path);
				}
				else if ( validationContext.context.onlyOnTouchErrors[validationContext.path] ) {
					validationContext.context.onlyOnTouchErrors[validationContext.path].forEach((error) => validationContext.context.errors.push(error));
				}
			};
		}

		return fnSrcCode;
	}

	protected compileSchema(config: CompileSchemaConfig) {
		return this.def.whenRules.length
			? this.compileWhenSchema(config)
			: this.compileNormalSchema(config);
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

		_this.def.normalRules.set(
			typeof method === 'object' 
				? method.name ?? `_test_${this.def.normalRules.size}`
				: `_test_${this.def.normalRules.size}`,
			typeof method === 'object' 
				? {
					isAsync,
					isCustomTestThatReturnsArray: false,
					method: (method as TestMethodConfig<RuleBooleanMethod<Input, Form>>).is ?? ((...args) => !(method as OldTestMethodConfig<RuleBooleanMethod<Input, Form>>).test(...args)),
					message: method.message,
					type: 'Rule'
				} : {
					isAsync,
					isCustomTestThatReturnsArray: true,
					method,
					type: 'Rule'
				}
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
		const _this = this.clone();
		
		_this.def.normalRules = new Map();

		const {
			then, otherwise, is 
		} = typeof name === 'string' ? config! : name;

		const thenThis = this.clone();

		thenThis.def.whenRules = [];

		let otherwiseThis = this.clone();
		otherwiseThis.def.whenRules = [];
		
		if ( otherwise ) {
			otherwiseThis = otherwise(otherwiseThis);
		}

		_this.def.whenRules.push({
			namedValueKey: typeof name === 'string' ? name : undefined,
			method: is,
			then: then(thenThis),
			otherwise: otherwiseThis
		});

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
			_this.def.isOnlyOnTouch = true;
			return _this;
		}

		let thenClone = this.clone() as this;
		thenClone.def.isOnlyOnTouch = undefined;
		thenClone.def.isOptional = undefined;
		thenClone.def.isNullable = undefined;
		thenClone.def.isRequired = undefined;
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
			`_test_${this.def.normalRules.size}`,
			{
				then: thenClone,
				type: 'OnlyOnTouchRule'
			}
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
		_this.def.isOnlyOnTouch = false;

		return _this;
	}
	
	/**
	 * Makes schema validation required (meaning value can not be undefined and null).
	 */
	public required(message?: string): this {
		const _this = this.clone();
		_this.def.isOptional = undefined;
		_this.def.isNullable = undefined;
		_this.def.isRequired = true;
		_this.def.messageRequired = message;

		return _this;
	}

	/**
	 * Makes schema validation not required (meaning value can be undefined and null).
	 */
	public notRequired(): this {
		const _this = this.clone();
		_this.def.isOptional = undefined;
		_this.def.isNullable = undefined;
		_this.def.isRequired = false;

		return _this;
	}

	/**
	 * Makes schema validation optional (meaning value can be undefined).
	 */
	public optional(): this {
		const _this = this.clone();
		_this.def.isOptional = true;
		_this.def.isRequired = undefined;

		return _this;
	}

	/**
	 * Makes schema validation not optional (meaning value can not be undefined).
	 */
	public notOptional(message?: string): this {
		const _this = this.clone();
		_this.def.isOptional = false;
		_this.def.isRequired = undefined;
		_this.def.messageOptional = message;

		return _this;
	}

	/**
	 * Makes schema validation nullable (meaning value can be null).
	 */
	public nullable(): this {
		const _this = this.clone();
		_this.def.isNullable = true;
		_this.def.isRequired = undefined;

		return _this;
	}

	/**
	 * Makes schema validation not nullable (meaning value can not be null).
	 */
	public notNullable(message?: string): this {
		const _this = this.clone();
		_this.def.isNullable = false;
		_this.def.isRequired = undefined;
		_this.def.messageNullable = message;

		return _this;
	}

	/**
	 * Creates validation method. 
	 * @param config - {@link CompileConfig} 
	 */
	public compile(): this {
		const context: Context = {};
		
		const schemasSrcCode = this.compileSchema({
			context,
			isFirstSchema: true
		});

		this.async = context.async ?? false;

		const validate = this.async
			? (validationContext: ValidationContext<Final>) => validationContext.context.promises.length > 0 
				? Promise.all(validationContext.context.promises).then(() => validationContext.context.errors) 
				: validationContext.context.errors
			: (validationContext: ValidationContext<Final>) => validationContext.context.errors;

		const onlyOnTouchErrors = {};

		this.def._validate = (value: any, onlyOnTouch: OnlyOnTouch<Input> = []): typeof this.async extends true ? Promise<SchemaError[]> : SchemaError[] => {
			const validationContext: ValidationContext<Final> = {
				context: {
					errors: [],
					onlyOnTouch,
					promises: [],
					onlyOnTouchErrors
				},
				form: value,
				
				path: '',
				parent: value
			};
			
			schemasSrcCode(value, validationContext);

			return validate(
				validationContext
			) as typeof this.async extends true ? Promise<SchemaError[]> : SchemaError[];
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
