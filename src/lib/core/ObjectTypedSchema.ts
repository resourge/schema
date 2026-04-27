import { type ValidationContext } from '../rules/BaseRule';
import { getMethodContext } from '../rules/Rule';
import { type OneOfConfigMessage } from '../types/OneOfTypes';
import { type SchemaMap } from '../types/SchemaMap';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/SchemaTypes';
import { type SchemaError } from '../types/types';

import { type Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ObjectTypedSchema<
	Input = any,
	Final = any
> extends Schema<Input, Final> {
	protected oneOfConfigMessage: OneOfConfigMessage | undefined;
	protected oneOfRules = new Map<string, PrivateSchema>();

	protected schema: SchemaMap<Input>;
	protected shape: Map<string, PrivateSchema>;

	constructor(schema: SchemaMap<Input>, message?: string, def?: Definitions) {
		super(message, def);

		this.schema = {
			...schema 
		};
		this.shape = new Map(Object.entries(schema));
	};

	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	protected compileOneOfRules({ context, isFirstSchema }: CompileSchemaConfig): Function {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		const schemas: Function[] = [];
		this.oneOfRules.forEach((schema, childKey ) => {
			const fn = schema.compileSchema({
				context 
			});

			if ( isFirstSchema ) {
				schemas.push(
					(value: any, validationContext: ValidationContext<Final>) => {
						fn(value[childKey], getMethodContext(childKey, validationContext));
					}
				);
			}
			else {
				schemas.push(
					(value: any, validationContext: ValidationContext<Final>) => {
						fn(value[childKey], getMethodContext(validationContext.path + '.' + childKey, validationContext, value));
					}
				);
			}
		});

		const l = schemas.length;
		function oneOf(value: any, validationContext: ValidationContext<Final>) {
			let errors: SchemaError[] = [];
			const _errors: SchemaError[] = [];

			for (let i = 0; i < l; i++) {
				schemas[i](value, {
					context: {
						errors,
						onlyOnTouch: validationContext.context.onlyOnTouch,
						onlyOnTouchErrors: validationContext.context.onlyOnTouchErrors,
						promises: validationContext.context.promises
					},
					form: validationContext.form,
					parent: validationContext.parent,
					path: validationContext.path
				});
				if ( errors.length === 0 ) {
					return [];
				}
				_errors.push(...errors);
				errors = [];
			}

			return _errors;
		}

		if ( !this.oneOfConfigMessage ) {
			return (value: any, validationContext: ValidationContext<Final>) => {
				const errors = oneOf(value, validationContext);
				const length = errors.length;
				for (let i = 0; i < length; i++) {
					validationContext.context.errors.push(errors[i]); 
				}
			};
		}

		if ( typeof this.oneOfConfigMessage === 'string' ) {
			return (value: any, validationContext: ValidationContext<Final>) => {
				const errors = oneOf(value, validationContext);
				const length = errors.length;
				for (let i = 0; i < length; i++) {
					const error = errors[i];
					error.error = this.oneOfConfigMessage as string; 
					validationContext.context.errors.push(error);
				}
			};
		}

		if ( Array.isArray(this.oneOfConfigMessage) ) {
			const errors = this.oneOfConfigMessage;
			const l = errors.length;
			return (value: any, validationContext: ValidationContext<Final>) => {
				if ( oneOf(value, validationContext).length > 0 ) {
					for (let i = 0; i < l; i++) {
						validationContext.context.errors.push(errors[i]); 
					}
				}
			};
		}

		return (value: any, validationContext: ValidationContext<Final>) => {
			if ( oneOf(value, validationContext).length > 0 ) {
				validationContext.context.errors.push(this.oneOfConfigMessage as SchemaError);
			}
		};
	}

	protected override compileSchema({
		context, 
		isFirstSchema,
		srcCode
	}: CompileSchemaConfig) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		const schemaRules: Function[] = srcCode
			? [srcCode]
			: [];
		
		if ( this.shape.size > 0 ) {
			this.shape.forEach((schema, childKey) => {
				const fn = schema.compileSchema({
					context 
				});
				if ( isFirstSchema ) {
					schemaRules.push(
						(value: any, validationContext: ValidationContext<Final>) => {
							fn(value[childKey], getMethodContext(childKey, validationContext));
						}
					);
				}
				else {
					schemaRules.push(
						(value: any, validationContext: ValidationContext<Final>) => {
							fn(value[childKey], getMethodContext(validationContext.path + '.' + childKey, validationContext, value));
						}
					);
				}
			});
		}

		if ( this.oneOfRules.size > 0 ) {
			schemaRules.push(
				this.compileOneOfRules({
					context,
					isFirstSchema
				})
			);
		}
		
		const l = schemaRules.length;
		return super.compileSchema({
			context, 
			srcCode: (value: any, validationContext: ValidationContext<Final>) => {
				for (let x = 0; x < l; x++) {
					schemaRules[x](value, validationContext);
				}
			}
		});
	}

	protected whenClone(): any {
		const clone = super.whenClone();
		
		clone.schema = {};
		clone.shape = new Map();
		clone.oneOfRules = new Map();
		clone.oneOfConfigMessage = undefined;

		return clone;
	}
}
