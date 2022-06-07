import { Context, SchemaError } from '../types/types'
import { Parameters } from '../utils/Utils'

import { BaseRule, GetRuleConfig } from './BaseRule'

export type RuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	obj: T, 
	context: Context
) => boolean

export type RuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	obj: T, 
	context: Context
) => SchemaError[] | true

export type RuleMethod<Value, T = any> = RuleBooleanMethod<Value, T> | RuleMethodSchemaError<Value, T>

export class Rule<Value, T = any> extends BaseRule<Value, T, RuleMethod<Value, T>> {
	public getRule(
		config: GetRuleConfig,
		valueKey: string, name: string,
		type: string, onlyOnTouch: boolean
	) {
		const {
			methodName,
			parameters,
			srcCode
		} = this.getRuleSrcCode(
			config,
			name,
			type,
			valueKey,
			onlyOnTouch
		)

		// false or [...]

		return [
			`const ${methodName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			(this.isMethodError ? `if ( ${methodName}_isValid.length ) {` : `if ( !${methodName}_isValid ) {`),
			...srcCode,
			'}'
		]
	}
}
