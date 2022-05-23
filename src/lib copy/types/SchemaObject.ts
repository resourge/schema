import { Schema } from '../core/schema';
import { array, ArraySchema } from '../schemas/ArraySchema';
import { BooleanSchema } from '../schemas/BooleanSchema';
import { DateSchema } from '../schemas/DateSchema';
import { number, NumberSchema } from '../schemas/NumberSchema';
import { object, ObjectSchema } from '../schemas/ObjectSchema';
import { string, StringSchema } from '../schemas/StringSchema';

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
	Schema<T> :
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

export type ArrayShape<T extends any[]> = Shape<T[number]>

const arrSchema = array<
	Array<{
		test: number
		test2: Array<{
			test: number
			test1: string
		}>
	}>
>(
	object({
		test: number(),
		test2: array(
			object(
				{
					test: number(),
					test1: string()
				},
				(schema) => schema.test(
					'',
					(a, b, c) => {
						return true;
					},
					''
				)
			),
			(schema) => schema.min(1)
		)
	})
)
/*

test(
				'',
				(v, k, f) => {
					return true;
				},
				''
			)
			*/
