/* eslint-disable @typescript-eslint/no-unsafe-function-type */
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
	message: ((messages: MessageType) => string) | string
	/**
	 * Servers to make validation unique, otherwise method cannot be changed
	 */
	name?: string
	/**
	 * @deprecated When test is "false" errors shows
	 */
	test: Method
};

export type TestMethodConfig<Method extends (...args: any[]) => any> = {
	/**
	 * When is is "true" errors shows
	 */
	is: Method
	message: ((messages: MessageType) => string) | string
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
	public final!: Final;
	public input!: Input;
	protected def: Definitions<Input, Final> = new Definitions<Input, Final>();
	protected isAsync: boolean = false;
	protected message: string = '';
	protected abstract rule: RuleBooleanMethod<any, any>;

	constructor(message?: string, def?: Definitions<Input, Final>) {
		this.message = message ?? this.message;
		if ( def ) {
			this.def = def.clone();
		}
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
	// #endregion Normal Rules
	public asyncTest<Form = this['final']>(
		method: AsyncRuleMethodSchemaError<Input, Form> | OldTestMethodConfig<AsyncRuleBooleanMethod<Input, Form>> | TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>
	): this {
		return this.addTest(true, method);
	}
	// #endregion When Rules

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

		this.isAsync = context.isAsync ?? false;

		const validate = this.isAsync
			? (validationContext: ValidationContext<Final>) => (validationContext.context.promises.length > 0 
				? Promise.all(validationContext.context.promises).then(() => validationContext.context.errors) 
				: validationContext.context.errors)
			: (validationContext: ValidationContext<Final>) => validationContext.context.errors;

		const onlyOnTouchErrors = {};

		this.def._validate = (value: any, onlyOnTouch: OnlyOnTouch<Input> = []): typeof this.isAsync extends true ? Promise<SchemaError[]> : SchemaError[] => {
			const validationContext: ValidationContext<Final> = {
				context: {
					errors: [],
					onlyOnTouch,
					onlyOnTouchErrors,
					promises: []
				},
				form: value,
				
				parent: value,
				path: ''
			};
			
			schemasSrcCode(value, validationContext);

			return validate(
				validationContext
			) as typeof this.isAsync extends true ? Promise<SchemaError[]> : SchemaError[];
		};

		return this;
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
	 * Makes schema validation nullable (meaning value can be null).
	 */
	public nullable(): this {
		const _this = this.clone();
		_this.def.isNullable = true;
		_this.def.isRequired = undefined;

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

		let clone = this.whenClone() as this;
		clone.def.isOnlyOnTouch = undefined;
		clone.def.isOptional = undefined;
		clone.def.isNullable = undefined;
		clone.def.isRequired = undefined;
		clone.def.whenRules = [];
		clone.def.normalRules = new Map();

		clone = onlyOnTouch(clone);

		/* c8 ignore start */
		if ( IS_DEV ) {
			clone.def.normalRules.forEach((_, key) => {
				if ( this.def.normalRules.has(key) ) {
					throw new Error(`Method ${key} already exists outside of 'onlyOnTouch'. To prevent confusion decide if you want '${key}' outside or inside 'onlyOnTouch'`);
				}
			});
		}
		/* c8 ignore end */

		_this.def.normalRules.set(
			`_test_${this.def.normalRules.size}`,
			{
				then: clone,
				type: 'OnlyOnTouchRule'
			}
		);

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
		method: OldTestMethodConfig<RuleBooleanMethod<Input, Form>> 
			| RuleMethodSchemaError<Input, Form> 
			| TestMethodConfig<RuleBooleanMethod<Input, Form>>
	): ObjectPropertiesSchema<Input, Form> {
		return this.addTest(false, method);
	}

	/**
	 * Validates form and returns an array of errors {@link SchemaError}
	 * @param value - form input
	 * @param onlyOnTouch - array of keys that inform the schema if a value
	 * was touched. Works with only with {@link Schema#onlyOnTouch} 
	 * @returns {SchemaError}
	 */
	public validate(value: Input, onlyOnTouch: OnlyOnTouch<Input> = []): Promise<SchemaError[]> | SchemaError[] {
		if ( !this.def._validate ) {
			this.compile();
		}

		return this.def._validate!(value, onlyOnTouch);
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
		name: string | WhenConfig<S, Value, Form>,
		config?: WhenConfig<S, Value, Form>
	): this {
		const _this = this.clone();

		const {
			is, otherwise, then 
		} = typeof name === 'string'
			? config!
			: name;

		const otherwiseThis = this.whenClone();

		_this.def.whenRules.push({
			method: is,
			namedValueKey: typeof name === 'string'
				? name
				: undefined,
			otherwise: otherwise
				? otherwise(otherwiseThis)
				: otherwiseThis,
			then: then(this.whenClone())
		});

		return _this;
	}

	protected clone(): any {
		return new (this.constructor as new(...args: any[]) => any)(this.message, this.def);
	}

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

	protected compileSchema(config: CompileSchemaConfig) {
		const normalFunction = this.compileNormalSchema(config);

		if ( this.def.whenRules.length > 0 ) {
			const whenFunction = this.compileWhenSchema(config.context);
			return (value: any, validationContext: ValidationContext<any>) => {
				normalFunction(value, validationContext);
				whenFunction(value, validationContext);
			};
		}

		return normalFunction;
	}
	
	// #region When Rules
	protected compileWhenSchema(context: Context) {
		const whenCode = this.def.whenRules.map((rule) => getWhenRule(rule, context));

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

	protected getMandatoryRules(schema: Schema<any>, fnSrcCode: (value: any, validationContext: ValidationContext<Final>) => void) {
		const {
			isNullable, isOnlyOnTouch, isOptional, isRequired 
		} = schema.def;

		if ( isOptional !== undefined ) {
			return isOptional
				? this.createCondition(
					fnSrcCode,
					(value) => value !== undefined
				)
				: this.createErrorCondition(
					fnSrcCode,
					this.def.messageOptional ?? defaultMessages.notOptional,
					(value) => value === undefined
				);
		}

		if ( isNullable !== undefined ) {
			return isNullable
				? this.createCondition(
					fnSrcCode,
					(value) => value !== null
				)
				: this.createErrorCondition(
					fnSrcCode,
					this.def.messageNullable ?? defaultMessages.notNullable,
					(value) => value === null
				);
		}

		if ( isRequired !== undefined ) {
			return isRequired
				? this.createErrorCondition(
					fnSrcCode,
					this.def.messageRequired ?? defaultMessages.required,
					this.getRequiredStringCondition
				)
				: this.createCondition(
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

	protected getNotRequiredStringCondition = (value: any) => value != null;

	protected getRequiredStringCondition = (value: any) => value == null;

	protected whenClone(): any {
		const clone = new (this.constructor as new(...args: any[]) => any)(this.message, this.def);
		
		clone.def.normalRules = new Map();
		clone.def.whenRules = [];
		clone.rule = () => true;

		return clone;
	}

	private addTest<Form = this['final']>(
		isAsync: boolean,
		method: AsyncRuleMethodSchemaError<Input, Form> 
			| OldTestMethodConfig<AsyncRuleBooleanMethod<Input, Form>> 
			| OldTestMethodConfig<RuleBooleanMethod<Input, Form>> 
			| RuleMethodSchemaError<Input, Form> 
			| TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>> 
			| TestMethodConfig<RuleBooleanMethod<Input, Form>>
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
					message: method.message,
					method: (method as TestMethodConfig<RuleBooleanMethod<Input, Form>>).is ?? ((...args) => !(method as OldTestMethodConfig<RuleBooleanMethod<Input, Form>>).test(...args)),
					type: 'Rule'
				}
				: {
					isAsync,
					isCustomTestThatReturnsArray: true,
					method,
					type: 'Rule'
				}
		);

		return _this;
	}

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
}
