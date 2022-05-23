/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */
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
	rules: {
		[key: string]: Function
	}
}

export type RuleFn<Value = any, Key = any, T = any> = (value: Value, key: Key, obj: T) => boolean

export type Rule<Value = any, Key = any, T = any> = {
	type: SchemaTypes
	name: string
	isValid: RuleFn<Value, Key, T>
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
	OBJECT_KEY = 'object',

	VALUE = 'value',
	RECURSIVE_KEY = 'recursiveKey',
}

export type SchemaError = {
	key: string
	error: string
}

type IfEquals<T, U, Y=unknown, N=never> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? Y : N;

export abstract class Schema<
	Output = any,
	Input = Output, 
	Final = Input
> {
	readonly _output!: Output;
	readonly _input!: Input;
	readonly _final!: Final;
	public abstract type: SchemaTypes
	protected abstract message: string
	protected abstract rule: RuleFn<Input, '', Final>

	private _validate: ((value: any) => SchemaError[]) | undefined

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
		const ruleFnName = this.addRule(rule.type, rule.name, rule.isValid, context)

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
		]
	}

	protected compileRules(context: Context) {
		return this.rules.flatMap((rule, indexRule) => {
			return this.transformRules(rule, context, `${indexRule}`);
		})
	}

	protected compileSchema({
		context, 
		key, 
		srcCode = [],
		path
	}: CompileSchemaConfig) {
		this.path = path ?? key ?? '';

		const valueKey = this.getValueKey(key)

		const ruleFnName = this.addRule(this.type, `schema_${this.type}`, this.rule, context)

		const parameters: string[] = [
			valueKey, 
			`'${this.path}'`,
			Parameters.OBJECT_KEY
		]

		const rulesSrcCode = this.compileRules(context);

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
			]
		}
		else {
			return [
				`if ( !${Parameters.CONTEXT_KEY}.rules.${ruleFnName}(${parameters.join(',')}) ) {`,
				`	${Parameters.ERRORS_KEY}.push({`,
				`		key: '${this.path}',`,
				`		error: '${this.getMessage(this.message)}'`,
				'	});',
				'}'
			]
		}
	}

	public test(
		name: string,
		isValid: RuleFn<Input, any, Final>,
		message: string
	): this {
		this.rules.push({
			type: this.type,
			name,
			isValid,
			message
		})

		return this;
	} 

	public beautifyFunction(funcArr: string[]): string {
		const normalize: string[] = []
		const identTab = '\t'
		let countScope = 0
	
		funcArr
		.map((a) => a.replace(/\t/g, ''))
		.forEach((line) => {
			if (line.includes('{')) {
				normalize.push(`${identTab.repeat(countScope)}${line}`)
				countScope += 1
				return;
			} 
			else if (line.includes('}')) {
				countScope -= 1
			} 
			normalize.push(`${identTab.repeat(countScope)}${line}`)
		})
		return normalize.join('\n').replace(',', '')
	}

	public compile<T extends this['_input']>({ beautifyFunction = true }: { beautifyFunction?: boolean } = { beautifyFunction: true }) {
		const context: Context = {
			index: 0,
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
			srcCode.join('\t')
		)

		this._validate = (value: string): SchemaError[] => {
			return validate(value, context)
		}

		return this;
	}

	public validate(value: Input) {
		if ( !this._validate ) {
			this.compile();
		}

		return this._validate!(value)
	}
}
