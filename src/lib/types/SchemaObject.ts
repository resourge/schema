import { Schema } from '../core/schema';
import { NumberSchema } from '../schemas/NumberSchema';
import { ObjectSchema } from '../schemas/ObjectSchema';

export type SchemaObject<T extends Record<string, any>> = {
	[K in keyof T]: T[K] extends Record<string, any> ? 
		ObjectSchema<T[K], SchemaObject<T[K]>> : 
		T[K] extends number ? 
			NumberSchema : 
			Schema
}
