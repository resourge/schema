import { type CompileSchemaConfig, type Context, type SchemaError } from '../types/types';
import { PARAMETERS } from '../utils/Utils';
import { type MessageType } from '../utils/messages';

export type RuleMethod<Value, Final = any> = (
	value: Value, 
	form: Final
) => SchemaError[] | false;

export type RuleTestConfig<T> = {
	context: Context
	form: T
	path: string
};

export type RuleSrcCodeConfig = Pick<Required<CompileSchemaConfig>, 'context' | 'path'> & {
	onlyOnTouch: boolean
	ruleMethodName: string
	valueKey: string
};

export type BaseRuleConfig<
	Type extends string,
	Value, 
	T = any, 
	Method extends (...args: any[]) => any = RuleMethod<Value, T>
> = {
	method: Method
	type: Type
	message?: string | ((messages: MessageType) => string)
};

export function addRuleToContextRules<Value, T = any, Method extends (...args: any[]) => any = RuleMethod<Value, T>>(
	name: string,
	method: Method,
	context: Context
) {
	const ruleFnName = `${name}`
	.replace(/\s+/g, '_')
	.replace(/[^a-zA-Z0-9_]/g, '_')
	.replace(/\s+/g, '_')
	.normalize('NFC')
	.toLowerCase();
	
	context.rules[ruleFnName] = method;
	
	return ruleFnName;
}

export function getFnParameters(
	valueKey: string,
	path: string
) {
	const lastIndex = valueKey.lastIndexOf('.');

	return [
		valueKey, 
		lastIndex > -1 ? valueKey.substring(0, lastIndex) : valueKey,
		`${PARAMETERS.FN_CONTEXT}(${path ? `\`${path}\`` : '\'\''})`
	];
}
