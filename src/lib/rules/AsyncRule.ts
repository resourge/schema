import { Context, SchemaError } from '../types/types'
import { Parameters } from '../utils/Utils';

import { BaseRule, RuleSrcCodeConfig } from './BaseRule';

export type AsyncRuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	obj: T,
	currentValue: any,
	context: Context
) => Promise<boolean>

export type AsyncRuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	form: T,
	currentValue: any,
	context: Context
) => Promise<SchemaError[] | true>

export type AsyncRuleMethod<Value, T = any> = AsyncRuleBooleanMethod<Value, T> | AsyncRuleMethodSchemaError<Value, T>

export class AsyncRule<Value, T = any> extends BaseRule<Value, T, AsyncRuleMethod<Value, T>> {
	public override getRule(config: RuleSrcCodeConfig) {
		const {
			context
		} = config;
		context.async = true;

		const {
			methodName,
			parameters,
			srcCode
		} = this.getRuleSrcCode(config)

		return [
			`${Parameters.PROMISE_KEY}.push(`,
			`${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')})`,
			`.then((${methodName}_isValid) => {`,
			(this.isMethodError ? `if ( ${methodName}_isValid.length ) {` : `if ( !${methodName}_isValid ) {`),
			...srcCode,
			'}',
			'})',
			');'
		]
	}
}
