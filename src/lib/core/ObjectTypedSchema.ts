/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type ValidationContext } from '../rules/BaseRule';
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
	protected schemas: SchemaMap<Input>;
	protected shape: Map<string, PrivateSchema>;

	protected oneOfRules = new Map<string, PrivateSchema>();
	protected oneOfConfigMessage: OneOfConfigMessage | undefined;

	constructor(schemas: SchemaMap<Input>, message?: string, def?: Definitions) {
		super(message, def);

		this.schemas = {
			...schemas 
		};
		this.shape = new Map(Object.entries(schemas));
	}

	protected compileOneOfRules({ context, isFirstSchema }: CompileSchemaConfig): Function {
		const schemas: Function[] = [];
		this.oneOfRules.forEach((schema, childKey ) => {
			const fn = schema.compileSchema({
				context 
			});

			if ( isFirstSchema ) {
				schemas.push(
					(value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
						fn(value[childKey], parent, childKey, validationContext);
					}
				);
			}
			else {
				schemas.push(
					(value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
						fn(value[childKey], parent, path + '.' + childKey, validationContext);
					}
				);
			}
		});

		const l = schemas.length;
		function oneOf(value: any, parent: any, path: string, validationContext: ValidationContext<Final>) {
			let errors: SchemaError[] = [];
			const _errors = [];

			for (let i = 0; i < l; i++) {
				schemas[i](value, parent, path, {
					errors,
					form: validationContext.form,
					onlyOnTouch: validationContext.onlyOnTouch,
					promises: validationContext.promises
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
			return (value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
				const errors = oneOf(value, parent, path, validationContext);
				const length = errors.length;
				for (let i = 0; i < length; i++) {
					validationContext.errors.push(errors[i]); 
				}
			};
		}

		if ( typeof this.oneOfConfigMessage === 'string' ) {
			return (value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
				const errors = oneOf(value, parent, path, validationContext);
				const length = errors.length;
				for (let i = 0; i < length; i++) {
					const error = errors[i];
					error.error = this.oneOfConfigMessage as string; 
					validationContext.errors.push(error);
				}
			};
		}

		if ( Array.isArray(this.oneOfConfigMessage) ) {
			const errors = this.oneOfConfigMessage as SchemaError[];
			const l = errors.length;
			return (value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
				if ( oneOf(value, parent, path, validationContext).length ) {
					for (let i = 0; i < l; i++) {
						validationContext.errors.push(errors[i]); 
					}
				}
			};
		}

		return (value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
			if ( oneOf(value, parent, path, validationContext).length ) {
				validationContext.errors.push(this.oneOfConfigMessage as SchemaError);
			}
		};
	}

	protected override compileSchema({
		context, 
		srcCode,
		isFirstSchema
	}: CompileSchemaConfig) {
		const schemaRules: Function[] = srcCode ? [srcCode] : [];
		
		if ( this.shape.size ) {
			this.shape.forEach((schema, childKey) => {
				const fn = schema.compileSchema({
					context 
				});
				if ( isFirstSchema ) {
					schemaRules.push(
						(value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
							fn(value[childKey], parent, childKey, validationContext);
						}
					);
				}
				else {
					schemaRules.push(
						(value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
							fn(value[childKey], parent, path + '.' + childKey, validationContext);
						}
					);
				}
			});
		}

		if ( this.oneOfRules.size ) {
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
			srcCode: (value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
				for (let x = 0; x < l; x++) {
					schemaRules[x](value, parent, path, validationContext);
				}
			}
		});
	}
}
