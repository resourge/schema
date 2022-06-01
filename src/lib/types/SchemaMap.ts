import { AnySchema } from '../schemas/AnySchema';
import { ArraySchema } from '../schemas/ArraySchema';
import { BooleanSchema } from '../schemas/BooleanSchema';
import { DateSchema } from '../schemas/DateSchema';
import { NumberSchema } from '../schemas/NumberSchema';
import { ObjectSchema } from '../schemas/ObjectSchema';
import { StringSchema } from '../schemas/StringSchema';

export type NullableType<T> = undefined | null | T

export type ObjectPropertiesSchema<T = any, Final = any> = 
	T extends NullableType<string>
		? (
			string extends T
				? StringSchema<T, Final>
				: StringSchema<NullableType<string>, Final>
		) : T extends NullableType<number>
			? (
				number extends T  
					? NumberSchema<T, Final>
					: NumberSchema<NullableType<number>, Final>
			) : T extends NullableType<boolean>
				? (
					boolean extends T  
						? BooleanSchema<T, Final>
						: BooleanSchema<NullableType<boolean>, Final>
				) : T extends NullableType<Date>
					? (
						Date extends T  
							? DateSchema<T, Final>
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
