/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
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
	rules: {
		[key: string]: Function
	}
}

export type RuleFn<Value = any, Key = any, T = any> = (value: Value, key: Key, obj: T) => boolean

export type Rule<Value = any, Key = any, T = any> = {
	type: SchemaTypes
	name: string
	isValid: (value: Value, key: Key, obj: T) => boolean
	message: string
}

export type CompileSchemaConfig = {
	context: Context
	index: number
	key?: string
	srcCode?: string[]
	path?: string
}

export enum Parameters {
	ERRORS_KEY = 'errors',
	CONTEXT_KEY = 'context',
	OBJECT_KEY = 'object',

	VALUE = 'value',
	RECURSIVE_KEY = 'recursiveKey',
}

export abstract class Schema<Input = any> {
	readonly _input!: Input;
	public abstract type: SchemaTypes
	protected abstract message: string
	protected abstract rule: RuleFn<Input, '', Input>

	/**
	 * Path for current value
	 */
	protected path: string = '';
	protected rules: Rule[] = []
	protected srcCode: string[] = []

	protected getMessage(message: string): string {
		return message.replace('{{key}}', this.path)
	}

	protected getValueKey(key?: string) {
		return `${Parameters.VALUE}${key ? `${key.indexOf('[') === 0 ? '' : '.'}${key}` : ''}`
	}

	protected addRule(
		rule: Rule, 
		context: Context,
		index: string
	) {
		const ruleFnName = `${rule.type}_${rule.name}_${index}`;

		context.rules[ruleFnName] = rule.isValid;

		return ruleFnName;
	}

	/**
	 * Transform rule into string
	 * @param rule Rule
	 * @param context 
	 * @param index 
	 * @param valueKey 
	 * @returns 
	 */
	protected transformRules(
		rule: Rule, 
		context: Context, 
		index: string, 
		valueKey: string
	) {
		const ruleFnName = this.addRule(rule, context, index)

		const parameters: string[] = [
			valueKey, 
			`'${this.path}'`,
			Parameters.OBJECT_KEY
		]

		return [
			`const ${ruleFnName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')});`,
			`if ( !${ruleFnName}_isValid ) {`,
			`	${Parameters.ERRORS_KEY}.push({`,
			`		key: '${this.path}',`,
			`		error: '${this.getMessage(rule.message)}'`,
			'	});',
			'}'
		].map((a) => a.replace(/\t/g, ''))
	}

	protected compileRules(context: Context, index: number, key?: string) {
		const valueKey = this.getValueKey(key)

		return this.rules.flatMap((rule, indexRule) => {
			return this.transformRules(rule, context, `${index}_${indexRule}`, valueKey);
		})
	}

	protected compileSchema({
		context, 
		index,
		key, 
		srcCode = [],
		path
	}: CompileSchemaConfig) {
		this.path = path ?? key ?? '';

		const valueKey = this.getValueKey(key)

		const ruleFnName = `${this.type}_${index}`;

		context.rules[ruleFnName] = this.rule;

		const parameters: string[] = [
			valueKey, 
			`'${this.path}'`,
			Parameters.OBJECT_KEY
		]

		const rulesSrcCode = this.compileRules(context, index, key);

		if ( rulesSrcCode.length > 0 || srcCode.length > 0 ) {
			return [
				`if ( ${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')}) ) {`,
				...rulesSrcCode,
				...srcCode,
				'}',
				'else {',
				`	${Parameters.ERRORS_KEY}.push({`,
				`		key: '${this.path}',`,
				`		error: '${this.getMessage(this.message)}'`,
				'	});',
				'}'
			].map((a) => a.replace(/\t/g, ''))
		}
		else {
			return [
				`if ( !${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')}) ) {`,
				`	${Parameters.ERRORS_KEY}.push({`,
				`		key: '${this.path}',`,
				`		error: '${this.getMessage(this.message)}'`,
				'	});',
				'}'
			].map((a) => a.replace(/\t/g, ''))
		}
	}

	public compile(): Function {
		const context: Context = {
			rules: {
		
			}
		}
	
		const srcCode = [
			'const errors = [];',
			...this.compileSchema({
				context,
				index: 0
			}),
			`return ${Parameters.ERRORS_KEY}`
		]

		console.log('srcCode', srcCode)

		const validate = new Function(
			Parameters.VALUE,
			Parameters.CONTEXT_KEY,
			Parameters.OBJECT_KEY,
			srcCode.join('\t')
		)

		return (value: string) => {
			return validate(value, context)
		}
	}
}
