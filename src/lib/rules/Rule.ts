import { type Schema } from '../core/schema';
import { type PrivateSchema } from '../types/SchemaTypes';
import { type SchemaError } from '../types/types';
import { defaultMessages, type MessageType } from '../utils/messages';

import {
	getError,
	type BaseRuleConfig,
	type RuleSrcCodeConfig,
	type ValidationContext
} from './BaseRule';

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

function getRuleSrcCode<Value, T = any>(
	config: Pick<
		RuleConfig<Value, T>,
		'isCustomTestThatReturnsArray' | 'message'
	>,
	{ context }: RuleSrcCodeConfig
): any {
	const isAsync = context.async;
	
	if ( config.isCustomTestThatReturnsArray ) {
		if ( isAsync ) {
			return (validationContext: ValidationContext<any>, path: string, error: SchemaError) => {
				const _path = error.path || path;
				const _error = getError(_path, error.error);
				validationContext.errors.push(_error);
				(validationContext.onlyOnTouchErrors[_path] = validationContext.onlyOnTouchErrors[_path] || []).push(_error);
			};
		}

		return (validationContext: ValidationContext<any>, path: string, error: SchemaError) => {
			validationContext.errors.push(getError(error.path || path, error.error));
		};
	}

	const _message: string = (
		typeof config.message === 'string' 
			? config.message 
			: (config.message as ((messages: MessageType) => string))(defaultMessages)
	);

	if ( isAsync ) {
		return (validationContext: ValidationContext<any>, path: string) => {
			const _error = getError(path, _message);
			validationContext.errors.push(_error);
			(validationContext.onlyOnTouchErrors[path] = validationContext.onlyOnTouchErrors[path] || []).push(_error);
		};
	}

	return (validationContext: ValidationContext<any>, path: string) => {
		validationContext.errors.push(getError(path, _message));
	};
}

export function getRule<Value, T = any>(
	config: RuleConfig<Value, T>,
	srcCodeConfig: RuleSrcCodeConfig
) {
	srcCodeConfig.context.async = config.isAsync;

	const fn = getRuleSrcCode(config, srcCodeConfig);

	if ( config.isAsync ) {
		if ( config.isCustomTestThatReturnsArray ) {
			return (value: any, parent: any, path: string, validationContext: ValidationContext<any>) => {
				validationContext.promises.push(
					(config.method(value, parent, validationContext) as Promise<SchemaError[]>)
					.then((isValid) => {
						if ( isValid.length ) {
							isValid.forEach((error: SchemaError) => {
								fn(validationContext, path, error);
							});
						}
					})
				);
			};
		}
		return (value: any, parent: any, path: string, validationContext: ValidationContext<any>) => {
			validationContext.promises.push(
				(config.method(value, parent, validationContext) as Promise<boolean>)
				.then((isValid) => {
					if ( isValid ) {
						fn(validationContext, path);
					}
				})
			);
		};
	}

	if ( config.isCustomTestThatReturnsArray ) {
		return (value: any, parent: any, path: string, validationContext: ValidationContext<any>) => {
			const isValid = config.method(value, parent, validationContext) as SchemaError[];
			if ( isValid.length ) {
				isValid.forEach((error) => {
					fn(validationContext, path, error);
				});
			}
		};
	}

	return (value: any, parent: any, path: string, validationContext: ValidationContext<any>) => {
		if ( config.method(value, parent, validationContext) ) {
			fn(validationContext, path);
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
	{ context }: RuleSrcCodeConfig
) {
	// @ts-expect-error // Because the camp that is changing is protected
	config.then.def.isOnlyOnTouch = true;
	
	return (config.then as PrivateSchema).compileSchema({
		context
	});
}
// #endregion OnlyOnTouchRule
