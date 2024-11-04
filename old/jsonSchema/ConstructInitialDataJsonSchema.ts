import {
	type JsonSchemaArrayType,
	type JsonSchemaBooleanType,
	type JsonSchemaDateType,
	type JsonSchemaNumberType,
	type JsonSchemaObjectType,
	type JsonSchemaStringType,
	type JsonSchemaType
} from './ConstructJsonSchema';

export type JsonSchemaToDataType<T extends JsonSchemaType> = T extends JsonSchemaObjectType
	? { [K in keyof T['properties']]: JsonSchemaToDataType<T['properties'][K]> }
	: T extends JsonSchemaStringType
		? string
		: T extends JsonSchemaNumberType
			? number
			: T extends JsonSchemaBooleanType
				? boolean
				: T extends JsonSchemaDateType
					? Date | string
					: T extends JsonSchemaArrayType
						? Array<JsonSchemaToDataType<T['properties']>>
						: any;

export function ConstructInitialData<T extends JsonSchemaType>(schemaValue: T): JsonSchemaToDataType<T> {
	switch ( schemaValue.type ) {
		case 'object':
			return Object.keys(schemaValue.properties)
			.reduce<any>((obj, key) => {
				obj[key] = ConstructInitialData(schemaValue.properties[key]);
				return obj;
			}, {});
		case 'array':
			return [] as any;
		default:
			return undefined as any;
	}
}
