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
	Final,
	T = FilterInvalidTypes<Q>,
> = {
	[K in keyof T]?: Shape<T[K], Final>
}

type IsExactlyAny<T> = boolean extends (T extends never ? true : false) ? true : false;

export type Shape<T, Final = any> = 
IsExactlyAny<T> extends true ?
	Schema<T, Final> :
	[T] extends [any[]] ? 
		ArraySchema<T, Final> :
		[T] extends [Date] ? 
			DateSchema<T, Final> :
			[T] extends [object] ?
				ObjectSchema<T, Final> :
				[number] extends [T] ? 
					NumberSchema<T extends number ? T : number, Final> :
					[string] extends [T] ? 
						StringSchema<T extends string ? T : string, Final> : 
						[boolean] extends [T] ? 
							BooleanSchema<T, Final> : 
							Schema<T, Final>

export type ArrayShape<T extends any[], Final> = Shape<T[number], Final>
