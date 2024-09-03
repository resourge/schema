import { ConstructJsonSchema, type JsonSchemaToSchemaDataType, type JsonSchemaType } from './ConstructJsonSchema';

export function JsonSchema<T extends JsonSchemaType>(schema: T): JsonSchemaToSchemaDataType<T> {
	return ConstructJsonSchema(schema).compile() as JsonSchemaToSchemaDataType<T>;
}
