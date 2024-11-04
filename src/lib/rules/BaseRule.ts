import { type CompileSchemaConfig } from '../types/SchemaTypes';
import { type SchemaError } from '../types/types';
import { type MessageType } from '../utils/messages';

export type RuleMethod<Value, Final = any> = (
	value: Value, 
	form: Final
) => SchemaError[] | false;

export type ValidationContext<T> = {
	errors: SchemaError[]
	form: T
	onlyOnTouch: string[]
	onlyOnTouchErrors: Record<string, SchemaError[]>
	promises: Array<Promise<any>>
};

export type RuleSrcCodeConfig = Pick<Required<CompileSchemaConfig>, 'context'>;

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

export function getError(path: string, error: string): SchemaError {
	return {
		error,
		path 
	}; 
}
