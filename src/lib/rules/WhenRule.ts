import { type Schema } from '../core/schema';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/SchemaTypes';

import { type ValidationContext } from './BaseRule';
import { type RuleBooleanMethod } from './Rule';

export type WhenConfig<
	T,
	Input, 
	Final = Input
> = {
	/**
	 * When "is" returns true "then", when false "otherwise"
	 */
	is: RuleBooleanMethod<Input, Final>
	then: (schema: T) => T
	otherwise?: (schema: T) => T
};

export type WhenParameter<Value = any, T = any> = {
	method: RuleBooleanMethod<Value, T>
	then: Schema<any, any>
	/**
	 * Makes when named, so uses a key from parent
	 */
	namedValueKey?: string
	otherwise?: Schema<any, any>
};

export function getWhenRule<Value = any, T = any>(
	config: WhenParameter<Value, T>,
	{
		context, 
		srcCode
	}: CompileSchemaConfig
) {
	const thenSrcCode = (config.then as unknown as PrivateSchema).compileSchema({
		context,
		srcCode
	});

	// This will never be undefined because when 
	// creating whenRules otherwise is inserted by default
	// Only when whenRule is a normalRule will otherwise be undefined 
	const otherwiseSrcCode = (config.otherwise as unknown as PrivateSchema).compileSchema({
		context,
		srcCode
	});

	if ( config.namedValueKey ) {
		return (value: any, validationContext: ValidationContext<any>) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const isValid = config.method(validationContext.parent[config.namedValueKey!], validationContext.parent, validationContext);

			(isValid ? thenSrcCode : otherwiseSrcCode)(value, validationContext);
		};
	}

	return (value: any, validationContext: ValidationContext<any>) => {
		const isValid = config.method(value, validationContext.parent, validationContext);

		(isValid ? thenSrcCode : otherwiseSrcCode)(value, validationContext);
	};
}
