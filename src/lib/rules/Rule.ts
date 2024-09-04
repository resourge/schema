import { type SchemaError } from '../types/types';
import { PARAMETERS } from '../utils/Utils';

import { BaseRule, type RuleSrcCodeConfig, type RuleTestConfig } from './BaseRule';

/**
 * When test is "false" message appears
 */
export type RuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: RuleTestConfig<T>
) => boolean;
/**
 * When test is "false" message appears
 */
export type RuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: RuleTestConfig<T>
) => SchemaError[] | true;

export type RuleMethod<Value, T = any> = RuleBooleanMethod<Value, T> | RuleMethodSchemaError<Value, T>;

export class Rule<Value, T = any> extends BaseRule<Value, T, RuleMethod<Value, T>> {
	public getRule(config: RuleSrcCodeConfig) {
		const {
			methodName,
			parameters,
			srcCode
		} = this.getRuleSrcCode(config);

		return [
			`const ${methodName}_isValid = ${PARAMETERS.CONTEXT_KEY}.rules.${methodName}(${parameters.join(',')});`,
			(this.isMethodError ? `if ( ${methodName}_isValid.length ) {` : `if ( ${methodName}_isValid ) {`),
			...srcCode,
			'}'
		];
	}
}
