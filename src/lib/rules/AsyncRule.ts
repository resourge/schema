import { DeepReadonly } from '../types/DeepReadonly'
import { Context, SchemaError } from '../types/types'
import { Parameters } from '../utils/Utils';

import { BaseRule } from './BaseRule';

export type AsyncRuleBooleanMethod<Value, T = any> = (
	value: DeepReadonly<NonNullable<Value>>, 
	obj: DeepReadonly<T>, 
	context: Context
) => Promise<boolean>

export type AsyncRuleMethodSchemaError<Value, T = any> = (
	value: DeepReadonly<NonNullable<Value>>, 
	form: DeepReadonly<T>, 
	context: Context
) => Promise<SchemaError[] | false>

export type AsyncRuleMethod<Value, T = any> = AsyncRuleBooleanMethod<Value, T> | AsyncRuleMethodSchemaError<Value, T>

export class AsyncRule<Value, T = any> extends BaseRule<Value, T, AsyncRuleMethod<Value, T>> {
	public override getRule(
		context: Context,
		type: string,
		valueKey: string,
		path: string,
		onlyOnTouch: boolean
	) {
		context.async = true;

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
			`${Parameters.PROMISE_KEY}.push(`,
			`${Parameters.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')})`,
			`.then((${methodName}_isValid) => {`,
			`if ( !${methodName}_isValid ) {`,
			...srcCode,
			'}',
			'})',
			');'
		]
	}
}
