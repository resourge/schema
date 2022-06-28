
import { Definitions } from '../core/Definitions';
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { NullableType, SchemaMap } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class ObjectSchema<
	Input extends NullableType<object> = object,
	Final = any
> extends ObjectTypedSchema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.OBJECT
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: any) => typeof value === 'object'

	protected clone() {
		return new ObjectSchema<Input, Final>(this.schemas, this.message, this.def)
	}

	constructor(schemas: SchemaMap<Input>, message?: string, def?: Definitions) {
		super(schemas, def);

		this.message = message ?? this.message;
	}

	/**
	 * Extends current schema object
	 */
	public extend<
		TInput extends Input = Input,
		TFinal extends Final = Final
	>(schemas: SchemaMap<TInput>): ObjectSchema<TInput, TFinal> {
		const _this = this.clone();
		
		Object.entries(schemas)
		.forEach(([key, schema]) => {
			// @ts-expect-error // this will never be undefined but typescript can't comprehend that
			const _schema = schema.clone()
			
			_this.shape.set(key, _schema)

			// @ts-expect-error // this will never be undefined but typescript can't comprehend that
			_this.schemas[key] = _schema;
		})

		return _this as unknown as ObjectSchema<TInput, TFinal>;
	}
}

export const object = <
	Input extends object = object,
>(
	schemas: SchemaMap<Input>
) => {
	return new ObjectSchema<Input>(schemas);
}
