import { type AnySchema } from '../schemas/AnySchema';
import { type ArraySchema } from '../schemas/ArraySchema';
import { type BooleanSchema } from '../schemas/BooleanSchema';
import { type DateSchema } from '../schemas/DateSchema';
import { type NumberSchema } from '../schemas/NumberSchema';
import { type ObjectSchema } from '../schemas/ObjectSchema';
import { type StringSchema } from '../schemas/StringSchema';
import { type IsEnum } from '../types/IsEnum';
import { type NullableType } from '../types/types';

export type EnumPropertiesSchema<T = any, Final = T> = [T] extends [number]
	? NumberSchema<T, Final> 
	: [T] extends [string]
		? StringSchema<T, Final> 
		: AnySchema<T, Final>; 

export type ObjectPropertiesSchema<T = any, Final = T> = 
IsEnum<T> extends true 
	? EnumPropertiesSchema<T, Final>
	: T extends NullableType<string>
		? (
			string extends T
				? StringSchema<T, Final>
				: [T] extends [string] ? 
					StringSchema<string, Final>
					: StringSchema<NullableType<string>, Final>
		) : T extends NullableType<number>
			? (
				number extends T  
					? NumberSchema<T, Final>
					: [T] extends [number] ? 
						NumberSchema<number, Final>
						: NumberSchema<NullableType<number>, Final>
			) : T extends NullableType<boolean>
				? (
					boolean extends T  
						? BooleanSchema<T, Final>
						: [T] extends [boolean] ? 
							BooleanSchema<boolean, Final>
							: BooleanSchema<NullableType<boolean>, Final>
				) : T extends NullableType<Date>
					? (
						Date extends T  
							? DateSchema<T, Final>
							: [T] extends [Date] ? 
								DateSchema<Date, Final>
								: DateSchema<NullableType<Date>, Final>
					) : T extends NullableType<any[]>
						? ArraySchema<T extends any[] ? T : any[], Final>
						: T extends NullableType<object>
							? ObjectSchema<T, Final>
							: AnySchema;  
							
type PartialSchemaMap<TSchema = any, TFinal = TSchema> = {
	[key in keyof TSchema]?: ObjectPropertiesSchema<TSchema[key], TFinal>;
}; 

type StrictSchemaMap<TSchema = any, TFinal = TSchema> = {
	[key in keyof TSchema]-?: ObjectPropertiesSchema<TSchema[key], TFinal>
};

export type SchemaMap<TSchema = any, isStrict = false, TFinal = TSchema> = isStrict extends true ? StrictSchemaMap<TSchema, TFinal> : PartialSchemaMap<TSchema, TFinal>;
