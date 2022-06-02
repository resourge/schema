import { DeepReadonly } from '../types/DeepReadonly'
import { Context, SchemaError } from '../types/types'
import { Parameters } from '../utils/Utils'

import { BaseRule } from './BaseRule'

export type RuleBooleanMethod<Value, T = any> = (
	value: DeepReadonly<NonNullable<Value>>, 
	obj: DeepReadonly<T>, 
	context: Context
) => boolean

export type RuleMethodSchemaError<Value, T = any> = (
	value: DeepReadonly<NonNullable<Value>>, 
	obj: DeepReadonly<T>, 
	context: Context
) => SchemaError[] | false

export type RuleMethod<Value, T = any> = RuleBooleanMethod<Value, T> | RuleMethodSchemaError<Value, T>

export class Rule<Value, T = any> extends BaseRule<Value, T, RuleMethod<Value, T>> {
	public getRule(
		context: Context,
		type: string,
		valueKey: string,
		path: string,
		onlyOnTouch: boolean
	) {
		const {
			methodName,
			parameters,
			srcCode
		} = this.getRuleSrcCode(
			context,
			type,
			valueKey,
			path,
			onlyOnTouch
		)

		return [
			`const ${methodName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			`if ( !${methodName}_isValid ) {`,
			...srcCode,
			'}'
		]
	}
}
