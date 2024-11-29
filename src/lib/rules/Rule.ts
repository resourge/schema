import { type Schema } from '../core/schema';
import { type Context, type PrivateSchema } from '../types/SchemaTypes';
import { type SchemaError } from '../types/types';
import { defaultMessages, type MessageType } from '../utils/messages';

import { getError, type BaseRuleConfig, type ValidationContext } from './BaseRule';

/**
 * When test is "false" message appears
 */
export type RuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: ValidationContext<T>
) => boolean;
/**
 * When test is "false" message appears
 */
export type RuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: ValidationContext<T>
) => SchemaError[] | true;

export type RuleMethod<Value, T = any> = RuleBooleanMethod<Value, T> | RuleMethodSchemaError<Value, T>;

/**
 * When test is "false" message appears
 */
export type AsyncRuleBooleanMethod<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: ValidationContext<T>
) => Promise<boolean>;
/**
 * When test is "false" message appears
 */
export type AsyncRuleMethodSchemaError<Value, T = any> = (
	value: NonNullable<Value>, 
	parent: any,
	config: ValidationContext<T>
) => Promise<SchemaError[] | true>;

export type AsyncRuleMethod<Value, T = any> = AsyncRuleBooleanMethod<Value, T> | AsyncRuleMethodSchemaError<Value, T>;

export type RuleConfig<Value = any, T = any> = {
	isAsync: boolean
	isCustomTestThatReturnsArray: boolean
} & BaseRuleConfig<'Rule', Value, T, RuleMethod<Value, T> | AsyncRuleMethod<Value, T>>;

export function getMethodContext(
	path: string, 
	validationContext: ValidationContext<any>,
	parent?: any
): ValidationContext<any> {
	return {
		context: validationContext.context,
		form: validationContext.form,
		path,
		parent: parent ?? validationContext.parent
	};
}

function getRuleSrcCode<Value, T = any>(
	config: Pick<
		RuleConfig<Value, T>,
		'isCustomTestThatReturnsArray' | 'message'
	>,
	context: Context
): any {
	const isAsync = context.async;
	
	if ( config.isCustomTestThatReturnsArray ) {
		if ( isAsync ) {
			return (validationContext: ValidationContext<any>, error: SchemaError) => {
				const _path = error.path || validationContext.path;
				const _error = getError(_path, error.error);
				validationContext.context.errors.push(_error);
				(validationContext.context.onlyOnTouchErrors[_path] = validationContext.context.onlyOnTouchErrors[_path] || []).push(_error);
			};
		}

		return (validationContext: ValidationContext<any>, error: SchemaError) => {
			validationContext.context.errors.push(getError(error.path || validationContext.path, error.error));
		};
	}

	const _message: string = (
		typeof config.message === 'string' 
			? config.message 
			: (config.message as ((messages: MessageType) => string))(defaultMessages)
	);

	if ( isAsync ) {
		return (validationContext: ValidationContext<any>) => {
			const _error = getError(validationContext.path, _message);
			validationContext.context.errors.push(_error);
			(validationContext.context.onlyOnTouchErrors[validationContext.path] = validationContext.context.onlyOnTouchErrors[validationContext.path] || []).push(_error);
		};
	}

	return (validationContext: ValidationContext<any>) => {
		validationContext.context.errors.push(getError(validationContext.path, _message));
	};
}

export function getRule<Value, T = any>(
	config: RuleConfig<Value, T>,
	context: Context
) {
	context.async = config.isAsync;

	const fn = getRuleSrcCode(config, context);

	if ( config.isAsync ) {
		if ( config.isCustomTestThatReturnsArray ) {
			return (value: any, validationContext: ValidationContext<any>) => {
				validationContext.context.promises.push(
					(config.method(value, validationContext.parent, validationContext) as Promise<SchemaError[]>)
					.then((isValid) => {
						if ( isValid.length ) {
							isValid.forEach((error: SchemaError) => {
								fn(validationContext, error);
							});
						}
					})
				);
			};
		}
		return (value: any, validationContext: ValidationContext<any>) => {
			validationContext.context.promises.push(
				(config.method(value, validationContext.parent, validationContext) as Promise<boolean>)
				.then((isValid) => {
					if ( isValid ) {
						fn(validationContext);
					}
				})
			);
		};
	}

	if ( config.isCustomTestThatReturnsArray ) {
		return (value: any, validationContext: ValidationContext<any>) => {
			const isValid = config.method(value, validationContext.parent, validationContext) as SchemaError[];
			if ( isValid.length ) {
				isValid.forEach((error) => {
					fn(validationContext, error);
				});
			}
		};
	}

	return (value: any, validationContext: ValidationContext<any>) => {
		if ( config.method(value, validationContext.parent, validationContext) ) {
			fn(validationContext);
		}
	};
}

// #region OnlyOnTouchRule
export type OnlyOnTouchRuleConfig = {
	then: Schema<any, any>
	type: 'OnlyOnTouchRule'
};

export function getOnlyTouchRule(
	config: OnlyOnTouchRuleConfig,
	context: Context
) {
	// @ts-expect-error // Because the camp that is changing is protected
	config.then.def.isOnlyOnTouch = true;
	
	return (config.then as PrivateSchema).compileSchema({
		context
	});
}
// #endregion OnlyOnTouchRule
