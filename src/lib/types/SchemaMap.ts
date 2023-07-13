import { type AnySchema } from '../schemas/AnySchema';
import { type ArraySchema } from '../schemas/ArraySchema';
import { type BooleanSchema } from '../schemas/BooleanSchema';
import { type DateSchema } from '../schemas/DateSchema';
import { type NumberSchema } from '../schemas/NumberSchema';
import { type ObjectSchema } from '../schemas/ObjectSchema';
import { type StringSchema } from '../schemas/StringSchema';

import { type IsEnum } from './IsEnum';

export type NullableType<T> = undefined | null | T

export type ObjectPropertiesSchema<T = any, Final = any> = 
IsEnum<T> extends true 
	? StringSchema<T, any> 
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
							: AnySchema  
							
type PartialSchemaMap<TSchema = any> = {
	[key in keyof TSchema]?: ObjectPropertiesSchema<TSchema[key]>;
} 

type StrictSchemaMap<TSchema = any> = {
	[key in keyof TSchema]-?: ObjectPropertiesSchema<TSchema[key]>
};

export type SchemaMap<TSchema = any, isStrict = false> = isStrict extends true ? StrictSchemaMap<TSchema> : PartialSchemaMap<TSchema>
