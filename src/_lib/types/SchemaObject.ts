import { Schema } from '../core/schema';
import { ArraySchema } from '../schemas/ArraySchema';
import { BooleanSchema } from '../schemas/BooleanSchema';
import { DateSchema } from '../schemas/DateSchema';
import { NumberSchema } from '../schemas/NumberSchema';
import { ObjectSchema } from '../schemas/ObjectSchema';
import { StringSchema } from '../schemas/StringSchema';

/**
 * TODO: Fix types in chains
 */

type FilterTypes<T, Types> = ({
	[P in keyof T]: T[P] extends Types ? P : never 
})[keyof T];  

type FilterInvalidTypes<T> = Omit<
	T, 
	FilterTypes<
		T, 
		Function | Set<any> | Map<any, any>
	>
>; 

export type ObjectShape<
	Q extends Record<string, any>, 
	T = FilterInvalidTypes<Q>
> = {
	[K in keyof T]?: Shape<T[K]>
}

type IsExactlyAny<T> = boolean extends (T extends never ? true : false) ? true : false;

export type Shape<T> = 
IsExactlyAny<T> extends true ?
	Schema<any> :
	[T] extends [any[]] ? 
		ArraySchema<T> :
		[T] extends [Date] ? 
			DateSchema<T> :
			[T] extends [object] ?
				ObjectSchema<T> :
				[number] extends [T] ? 
					NumberSchema<T> :
					[string] extends [T] ? 
						StringSchema<T> : 
						[boolean] extends [T] ? 
							BooleanSchema<T> : 
							Schema<T>

export type ArrayShape<T extends any[]> = T[number] extends Array<{
	test: number
	test1: string
}> ? Shape<T[number]> : Shape<T[number]>
