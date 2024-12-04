import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { type OneOf, type OneOfConfigMessage } from '../types/OneOfTypes';
import { type SchemaMap } from '../types/SchemaMap';
import { type NullableType } from '../types/types';

export class ObjectSchema<
	Input extends NullableType<object> = object,
	Final = any
> extends ObjectTypedSchema<Input, Final> {
	protected message: string = 'Is not object';
	protected rule = (value: any) => typeof value === 'object';

	protected override clone() {
		const schema = new ObjectSchema<Input, Final>(
			this.schema, 
			this.message, 
			this.def
		);

		schema.oneOfRules = new Map(this.oneOfRules.entries());

		return schema;
	}

	// protected getRequiredStringCondition = (value: any) => value == null && typeof value === 'object';

	/**
	 * Extends current schema object
	 */
	public extend<
		TInput extends Input = Input,
		TFinal extends Final = Final
	>(schemas: SchemaMap<TInput, false, TFinal>): ObjectSchema<TInput, TFinal> {
		const _this = this.clone();
		
		Object.entries(schemas)
		.forEach(([key, schema]) => {
			// @ts-expect-error // this will never be undefined but typescript can't comprehend that
			const _schema = schema.clone();
			
			_this.shape.set(key, _schema);

			// @ts-expect-error // this will never be undefined but typescript can't comprehend that
			_this.schema[key] = _schema;
		});

		return _this as unknown as ObjectSchema<TInput, TFinal>;
	}

	/**
	 * OneOf makes the validation only false when all schema keys are false (have errors in them)
	 * This is exclusive to oneOf schema, all other validation still will take place,
	 */
	public oneOf(
		oneOfKey: OneOf<Input>,
		oneOfConfig?: OneOfConfigMessage
	): this;
	public oneOf<Key extends keyof Input>(
		oneOfKey: Key[],
		schema: SchemaMap<Input>[Key],
		oneOfConfig?: OneOfConfigMessage
	): this;
	public oneOf<Key extends keyof Input>(
		oneOfKey: OneOf<Input> | Key[],
		schema?: SchemaMap<Input>[Key] | OneOfConfigMessage,
		oneOfConfigMessage?: OneOfConfigMessage
	): this {
		const _this = this.clone();

		_this.oneOfConfigMessage = Array.isArray(oneOfKey) ? oneOfConfigMessage : (schema as OneOfConfigMessage);

		((
			Array.isArray(oneOfKey) 
				? oneOfKey.map((key) => [key, schema])
				: Object.entries(oneOfKey)
		) as Array<[string, SchemaMap<Input, true>[any]]>)
		.forEach(([key, schema]) => {
			// @ts-expect-error To be only accessible for the developer
			_this.oneOfRules.set(key, schema.clone());
		});

		return _this as this;
	}
}
export const object = <
	Input extends object = object
>(
	schemas: SchemaMap<Input> = {},
	message?: string
) => new ObjectSchema<Input>(schemas, message);
