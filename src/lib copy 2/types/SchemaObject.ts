import { Schema } from '../core/schema';
import { array, ArraySchema } from '../schemas/ArraySchema';
import { boolean, BooleanSchema } from '../schemas/BooleanSchema';
import { date, DateSchema } from '../schemas/DateSchema';
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
	Schema<any> :
	[T] extends [any[]] ? 
		ArraySchema<T, ArrayShape<T>> :
		[T] extends [Date] ? 
			DateSchema :
			[T] extends [object] ?
				ObjectSchema<T, ObjectShape<T>> :
				[number] extends [T] ? 
					NumberSchema :
					[string] extends [T] ? 
						StringSchema : 
						[boolean] extends [T] ? 
							BooleanSchema : 
							Schema<T>

export type ArrayShape<T extends any[]> = T[number] extends Array<{
	test: number
	test1: string
}> ? Shape<T[number]> : Shape<T[number]>

type A = Array<{
	test: number
	test2: Array<{
		test: number
		test1: string
	}>
}>

const compile = <T = any>(
	i: Shape<T>
) => {

}

const arrSchema = compile<A>(
	array(
		object({
			test: number(),
			test2: array(
				object({
					test: number(),
					test2: string()
				})
			)
			.min(1)
		})
	)
);
