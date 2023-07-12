
import { type Definitions } from '../core/Definitions';
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { type OneOf, type OneOfConfigMessage } from '../types/OneOfTypes';
import { type NullableType, type SchemaMap } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class ObjectSchema<
	Input extends NullableType<object> = object,
	Final = any
> extends ObjectTypedSchema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.OBJECT
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: any) => typeof value === 'object'

	protected clone() {
		const schema = new ObjectSchema<Input, Final>(
			this.schemas, 
			this.message, 
			this.def
		)

		schema.oneOfRules = new Map(this.oneOfRules.entries());

		return schema
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

	public oneOf(
		oneOfKey: OneOf<Input>,
		oneOfConfig?: OneOfConfigMessage
	): this
	public oneOf<Key extends keyof Input>(
		oneOfKey: Key[],
		schema: SchemaMap<Input>[Key],
		oneOfConfig?: OneOfConfigMessage
	): this
	public oneOf<Key extends keyof Input>(
		oneOfKey: OneOf<Input> | Key[],
		schema?: SchemaMap<Input>[Key] | OneOfConfigMessage,
		oneOfConfig?: OneOfConfigMessage
	): this {
		const _this = this.clone();

		const _oneOfConfig = !Array.isArray(oneOfKey) ? (schema as OneOfConfigMessage) : oneOfConfig;

		const message = _oneOfConfig

		_this.oneOfConfig = {
			includeAllErrors: !(message && typeof message !== 'string'),
			message
		}

		const schemasEntries: Array<[string, SchemaMap<Input, true>[any]]> = Array.isArray(oneOfKey) 
			? (oneOfKey as string[]).map((key) => [key, schema])
			: (Object.entries(oneOfKey))

		schemasEntries
		.forEach(([key, schema]) => {
			// @ts-expect-error To be only accessible for the developer
			const _schema = schema.clone();
			
			_this.oneOfRules.set(key, _schema);
		})

		return _this as this;
	}
}
export const object = <
	Input extends object = object,
>(
	schemas: SchemaMap<Input> = {},
	message?: string
) => {
	return new ObjectSchema<Input>(schemas, message);
}
