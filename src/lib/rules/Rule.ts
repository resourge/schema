import { Context, SchemaError } from '../types/types'
import { Parameters } from '../utils/Utils'

import { BaseRule, RuleSrcCodeConfig } from './BaseRule'

/**
 * When test is "false" message appears
 */
export type RuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	obj: T,
	currentValue: any,
	context: Context
) => boolean
/**
 * When test is "false" message appears
 */
export type RuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	obj: T,
	currentValue: any,
	context: Context
) => SchemaError[] | true

export type RuleMethod<Value, T = any> = RuleBooleanMethod<Value, T> | RuleMethodSchemaError<Value, T>

export class Rule<Value, T = any> extends BaseRule<Value, T, RuleMethod<Value, T>> {
	public getRule(config: RuleSrcCodeConfig) {
		const {
			methodName,
			parameters,
			srcCode
		} = this.getRuleSrcCode(config)

		return [
			`const ${methodName}_isValid = ${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			(this.isMethodError ? `if ( ${methodName}_isValid.length ) {` : `if ( !${methodName}_isValid ) {`),
			...srcCode,
			'}'
		]
	}
}
