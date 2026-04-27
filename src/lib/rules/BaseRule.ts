import { type CompileSchemaConfig } from '../types/SchemaTypes';
import { type SchemaError } from '../types/types';
import { type MessageType } from '../utils/messages';

export type BaseRuleConfig<
	Type extends string,
	Value, 
	T = any, 
	Method extends (...args: any[]) => any = RuleMethod<Value, T>
> = {
	message?: ((messages: MessageType) => string) | string
	method: Method
	type: Type
};

export type RuleMethod<Value, Final = any> = (
	value: Value, 
	form: Final
) => false | SchemaError[];

export type RuleSrcCodeConfig = Pick<Required<CompileSchemaConfig>, 'context'>;

export type ValidationContext<T> = {
	context: {
		errors: SchemaError[]
		onlyOnTouch: string[]
		onlyOnTouchErrors: Record<string, SchemaError[]>
		promises: Array<Promise<any>>
	}

	form: T
	parent: any
	path: string
};

export function getError(path: string, error: string): SchemaError {
	return {
		error,
		path 
	}; 
}
