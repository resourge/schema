import {
	array,
	type ArraySchema,
	boolean,
	type BooleanSchema,
	date,
	type DateSchema,
	number,
	type NumberSchema,
	object,
	type ObjectSchema,
	string,
	type StringSchema
} from '../schemas';
import { type SchemaMap } from '../types/SchemaMap';
import { type LiteralUnion, type ExcludeByValueType } from '../types/types';

import { type JsonSchemaToDataType } from './ConstructInitialDataJsonSchema';
import {
	type JsonSchemaValidationType,
	type JsonSchemaArrayValidationType,
	type JsonSchemaBooleanValidationType,
	type JsonSchemaDateValidationType,
	type JsonSchemaNumberValidationType,
	type JsonSchemaObjectValidationType,
	type JsonSchemaStringValidationType
} from './JsonSchemaValidationType';

export type JsonSchemaObjectType = {
	properties: Record<string, JsonSchemaType>
	type: 'object'
	validation?: JsonSchemaObjectValidationType
};
export type JsonSchemaStringType = {
	type: 'string'
	validation?: JsonSchemaStringValidationType
};
export type JsonSchemaNumberType = {
	type: 'number'
	validation?: JsonSchemaNumberValidationType
};
export type JsonSchemaBooleanType = {
	type: 'boolean'
	validation?: JsonSchemaBooleanValidationType
};
export type JsonSchemaDateType = {
	type: 'date'
	validation?: JsonSchemaDateValidationType
};
export type JsonSchemaArrayType = {
	properties: JsonSchemaType
	type: 'array'
	validation?: JsonSchemaArrayValidationType
};
/* type JsonSchemaCustomType = {
	properties: JsonSchemaType[] | Record<string, JsonSchemaType>
	type: 'custom'
	validation?: JsonSchemaValidationType
}; */

export type JsonSchemaType = JsonSchemaObjectType 
	| JsonSchemaStringType 
	| JsonSchemaNumberType 
	| JsonSchemaBooleanType
	| JsonSchemaDateType
	| JsonSchemaArrayType;
	// | JsonSchemaCustomType;

export type JsonSchemaToSchemaDataType<T extends JsonSchemaType> = T extends JsonSchemaObjectType
	? ObjectSchema<JsonSchemaToDataType<T>>
	: T extends JsonSchemaStringType
		? StringSchema<JsonSchemaToDataType<T>>
		: T extends JsonSchemaNumberType
			? NumberSchema<JsonSchemaToDataType<T>>
			: T extends JsonSchemaBooleanType
				? BooleanSchema<JsonSchemaToDataType<T>>
				: T extends JsonSchemaDateType
					? DateSchema<JsonSchemaToDataType<T>>
					: T extends JsonSchemaArrayType
						? ArraySchema<JsonSchemaToDataType<T>>
						: any;

export type AnyJsonSchema = ObjectSchema | StringSchema<any, any> | NumberSchema<any, any> | BooleanSchema<any, any> | DateSchema<any, any> | ArraySchema<any, any>;

function validation<T extends AnyJsonSchema>(
	schema: T, 
	validation?: JsonSchemaValidationType
): T {
	if ( validation ) {
		Object.keys(validation)
		.forEach((key) => {
			const schemaValidation = validation[key as keyof JsonSchemaValidationType];

			switch ( key as LiteralUnion<keyof JsonSchemaValidationType, string> ) {
				// #region Date/Number/String
				case 'equals':
					if ( (schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['equals']>).date ) {
						schema = (schema as DateSchema).equals(
							(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['equals']>).date,
							(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['equals']>).format,
							(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['equals']>).message
						) as T;
						return;
					}
					schema = (schema as NumberSchema | StringSchema).equals(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['equals']>).value as any,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['equals']>).message
					) as T;
					return;
				// #endregion Boolean/Number/String
				// #region Number/String
				case 'between':
					schema = (schema as NumberSchema).between(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['between']>).minValue, 
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['between']>).maxValue, 
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['between']>).message
					) as T;
					return;
				case 'enum':
					schema = (schema as NumberSchema).enum(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['enum']>).enumObject,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['enum']>).message
					) as T;
					return;
				case 'max':
					schema = (schema as NumberSchema).max(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['max']>).maxValue,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['max']>).message
					) as T;
					return;
				case 'min':
					schema = (schema as NumberSchema).min(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['min']>).minValue,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['min']>).message
					) as T;
					return;
				// #endregion Number/String
				// #region String
				case 'contains':
					schema = (schema as StringSchema).contains(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['contains']>).value, 
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['contains']>).message
					) as T;
					return;
				case 'email':
					if ( typeof (schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['email']>) === 'boolean' ) {
						schema = (schema as StringSchema).email() as T;
						return;
					}
					schema = (schema as StringSchema).email(
						(schemaValidation as unknown as Exclude<NonNullable<JsonSchemaStringValidationType['email']>, boolean>).mode,
						(schemaValidation as unknown as Exclude<NonNullable<JsonSchemaStringValidationType['email']>, boolean>).message
					) as T;
					return;
				case 'length':
					schema = (schema as StringSchema).length(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['length']>).length,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['length']>).message
					) as T;
					return;
				case 'pattern':
					schema = (schema as StringSchema).pattern(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['pattern']>).reg,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['pattern']>).message
					) as T;
					return;
				case 'phoneNumber':
					schema = (schema as StringSchema).phoneNumber(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['phoneNumber']>).phoneNumber,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['phoneNumber']>).message
					) as T;
					return;
				case 'postalCode':
					schema = (schema as StringSchema).postalCode(
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['postalCode']>).postalCode,
						(schemaValidation as unknown as NonNullable<JsonSchemaStringValidationType['postalCode']>).message
					) as T;
					return;
				// #endregion String
				// #region Number
				case 'decimal':
					schema = (schema as NumberSchema).decimal(
						(schemaValidation as unknown as NonNullable<JsonSchemaNumberValidationType['decimal']>).decimal,
						(schemaValidation as unknown as NonNullable<JsonSchemaNumberValidationType['decimal']>).message
					) as T;
					return;
				// #endregion Number
				// #region Boolean
				case 'mustBe':
					schema = (schema as BooleanSchema).mustBe(
						(schemaValidation as unknown as NonNullable<JsonSchemaBooleanValidationType['mustBe']>).mustBeValue,
						(schemaValidation as unknown as NonNullable<JsonSchemaBooleanValidationType['mustBe']>).message
					) as T;
					return;
				// #endregion Boolean
				// #region Date
				case 'maxDate':
					schema = (schema as DateSchema).maxDate(
						(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['maxDate']>).maxDate,
						(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['maxDate']>).format,
						(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['maxDate']>).message
					) as T;
					return;
				case 'minDate':
					schema = (schema as DateSchema).minDate(
						(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['minDate']>).minDate,
						(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['minDate']>).format,
						(schemaValidation as unknown as NonNullable<JsonSchemaDateValidationType['minDate']>).message
					) as T;
					return;
				// #endregion Date
				// #region Array
				case 'uniqueBy':
					schema = (schema as ArraySchema).uniqueBy(
						(schemaValidation as unknown as NonNullable<JsonSchemaArrayValidationType['uniqueBy']>).key,
						(schemaValidation as unknown as NonNullable<JsonSchemaArrayValidationType['uniqueBy']>).message
					) as T;
					return;
				// #endregion Array
				// #region object
				case 'oneOf':
					const properties = (schemaValidation as unknown as NonNullable<JsonSchemaObjectValidationType['oneOf']>).properties;
					schema = (schema as ObjectSchema).oneOf(
						Object.keys(properties)
						.reduce<SchemaMap<any>>((obj, key) => {
							obj[key] = ConstructJsonSchema(properties[key] as JsonSchemaType);
							return obj;
						}, {})
					) as T;
					return;
				// #endregion object
			}

			schema = (schema as any)[key as unknown as ExcludeByValueType<NonNullable<JsonSchemaStringValidationType>, boolean | string>](
				typeof schemaValidation === 'string' ? schemaValidation : undefined
			);
		});
	}

	return schema;
}

export function ConstructJsonSchema(schemaValue: JsonSchemaType): AnyJsonSchema {
	let schema: AnyJsonSchema;
	switch ( schemaValue.type ) {
		case 'string':
			schema = validation(
				string(),
				schemaValue.validation
			);
			break;
		case 'number':
			schema = validation(
				number(),
				schemaValue.validation
			);
			break;
		case 'boolean':
			schema = validation(
				boolean(),
				schemaValue.validation
			);
			break;
		case 'date':
			schema = validation(
				date(),
				schemaValue.validation
			);
			break;
		case 'array':
			schema = validation(
				array(
					ConstructJsonSchema(schemaValue.properties)
				),
				schemaValue.validation
			);
			break;
		// case 'object':
		default:
			schema = validation(
				object(
					Object.keys(schemaValue.properties)
					.reduce<SchemaMap<any>>((obj, key) => {
						obj[key] = ConstructJsonSchema(schemaValue.properties[key]);
						return obj;
					}, {})
				),
				schemaValue.validation
			);
			break;
	}

	if ( schemaValue.validation ) {
		if ( schemaValue.validation.required ) {
			schema = schema.required(
				typeof schemaValue.validation.required === 'string' ? schemaValue.validation.required : undefined
			);
		}
		else if ( schemaValue.validation.required === false ) {
			schema = schema.notRequired();
		}

		if ( schemaValue.validation.nullable ) {
			schema = schema.nullable();
		}
		else if ( schemaValue.validation.nullable === false ) {
			schema = schema.notNullable();
		}

		if ( schemaValue.validation.optional ) {
			schema = schema.optional();
		}
		else if ( schemaValue.validation.optional === false ) {
			schema = schema.notOptional();
		}
	}

	return schema;
}
