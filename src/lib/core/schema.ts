/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */

import { FormKey } from '../types/FormKey'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
	rules: {
		[key: string]: Function
	}
}

export type Touches<T extends Record<string, any>> = {
	/**
	 * Paths for the keys touched
	 */
	[K in FormKey<T>]?: boolean
}

export type RuleFn<Value = any, T = any> = (value: Value, obj: T) => boolean

export type Rule<Value = any, T = any> = {
	type: SchemaTypes
	name: string
	isValid: RuleFn<Value, T>
	message: string
}

export type CompileSchemaConfig = {
	context: Context
	key?: string
	srcCode?: string[]
	path?: string
}

export enum Parameters {
	ERRORS_KEY = 'errors',
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

export abstract class Schema<
	Input, 
	Final = Input
> {
	protected readonly _input!: Input;
	protected readonly _final!: Final;
	protected _onlyOnTouch: boolean = false;
	protected abstract type: SchemaTypes
	protected abstract message: string
	protected abstract rule: RuleFn<any, any>

	private _validate: ((value: Input, onlyOnTouch?: string[]) => SchemaError[]) | undefined

	/**
	 * Path for current value
	 */
	protected path: string = '';
	protected rules: Rule[] = []
	protected srcCode: string[] = []

	protected getMessage(message: string): string {
		return `\`${message.replace('{{key}}', this.path)}\``
	}

	protected getValueKey(key?: string) {
		return `${Parameters.VALUE}${key ? `${key.indexOf('[') === 0 ? '' : '.'}${key}` : ''}`
	}

	protected addRule(
		type: SchemaTypes,
		name: string,
		isValid: RuleFn,
		context: Context
	) {
		const index = context.index = context.index + 1;
		const ruleFnName = `${type}_${name}_${index}`;

		context.rules[ruleFnName] = isValid;

		return ruleFnName;
	}

	/**
	 * Transform rule into string
	 * @param rule Rule
	 * @param context 
	 * @param valueKey 
	 * @returns 
	 */
	protected transformRules(
		rule: Rule, 
		context: Context, 
		valueKey: string
	) {
		const ruleFnName = this.addRule(rule.type, `${rule.name || 'custom_rule'}`, rule.isValid, context)

		const parameters: string[] = [
			valueKey, 
			Parameters.OBJECT_KEY
		]

		return [
			`const ${ruleFnName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')});`,
			`if ( !${ruleFnName}_isValid ) {`,
			...this.getErrorSyntax(),
			'}'
		]
	}

	protected compileRules(context: Context, valueKey: string) {
		return this.rules.flatMap((rule) => {
			return this.transformRules(rule, context, valueKey);
		})
	}

	protected getErrorSyntax() {
		return [
			`${Parameters.ERRORS_KEY}.push({`,
			`	key: \`${this.path}\`,`,
			`	error: ${this.getMessage(this.message)}`,
			'});'
		]
	}

	protected compileSchema({
		context, 
		key, 
		srcCode = [],
		path
	}: CompileSchemaConfig) {
		const onlyOnTouch = context.onlyOnTouch ?? this._onlyOnTouch;
		this.path = path ?? key ?? '';

		const valueKey = this.getValueKey(key)

		const ruleFnName = this.addRule(this.type, `schema_is_${this.type}`, this.rule, context)

		const parameters: string[] = [
			valueKey, 
			Parameters.OBJECT_KEY
		]

		const rulesSrcCode = this.compileRules(context, valueKey);

		const fnName = `${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')})`;

		const errorsSyntax = this.getErrorSyntax();

		const _fnSrcCode = rulesSrcCode.length > 0 || srcCode.length > 0 ? [
			`if ( ${fnName} ) {`,
			...rulesSrcCode,
			...srcCode,
			'}',
			'else {',
			...errorsSyntax,
			'}'
		] : [
			`if ( !${fnName} ) {`,
			...errorsSyntax,
			'}'
		]

		if ( onlyOnTouch && this.path ) {
			return [
				`if ( ${Parameters.ONLY_ON_TOUCH}.some((key) => key.includes(\`${this.path}\`) || \`${this.path}\`.includes(key)) ){`,
				..._fnSrcCode,
				'}'
			]
		}

		return _fnSrcCode
	}

	public test(
		name: string,
		isValid: RuleFn<Input, Final>,
		message: string
	) {
		this.rules.push({
			type: this.type,
			name: name.replace(/\s+/g, '_'),
			isValid,
			message
		})

		return this;
	} 

	protected beautifyFunction(funcArr: string[]): string {
		const normalize: string[] = []
		const identTab = '\t'
		let countScope = 0
	
		funcArr
		.map((a) => a.replace(/\t/g, ''))
		.forEach((line) => {
			if ( line.includes(' {') ) {
				normalize.push(`${identTab.repeat(countScope)}${line}`)
				countScope += 1
				return;
			} 
			else if ( line.includes(' }') ) {
				countScope -= 1
			} 
			normalize.push(`${identTab.repeat(countScope)}${line}`)
		})
		return normalize.join('\n')
	}

	public onlyOnTouch() {
		this._onlyOnTouch = true;
	}

	public compile({ beautifyFunction = true, onlyOnTouch = false }: { beautifyFunction?: boolean, onlyOnTouch?: boolean } = { beautifyFunction: true }) {
		const context: Context = {
			index: 0,
			onlyOnTouch,
			rules: {
		
			}
		}
	
		const srcCode = [
			'const errors = [];',
			...this.compileSchema({
				context
			}),
			`return ${Parameters.ERRORS_KEY}`
		]

		if ( beautifyFunction ) {
			console.log('srcCode', this.beautifyFunction(srcCode))
		}

		const validate = new Function(
			Parameters.VALUE,
			Parameters.CONTEXT_KEY,
			Parameters.OBJECT_KEY,
			Parameters.ONLY_ON_TOUCH,
			srcCode.join('\t')
		)

		this._validate = (value: Input, onlyOnTouch?: string[]): SchemaError[] => {
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
		.map(([key]) => key);

		return this._validate!(value, _onlyOnTouch)
	}
}
