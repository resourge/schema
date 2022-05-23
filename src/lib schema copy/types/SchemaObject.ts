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
export type ObjectShape2<
	T extends Record<string, any>,
	Final
> = {
	[K in keyof T]?: Shape<T[K], Final>
}

export type ObjectShape<
	T extends Record<string, any>,
	Final
> = ObjectShape2<FilterInvalidTypes<T>, Final>

type IsExactlyAny<T> = boolean extends (T extends never ? true : false) ? true : false;

export type Shape<T, Final = T> = 
IsExactlyAny<T> extends true ?
	Schema<any, Final> :
	[T] extends [Array<infer E>] ? 
		ArraySchema<Shape<E, Final>> :
		[T] extends [Date] ? 
			DateSchema<T, Final> :
			[T] extends [object] ?
				ObjectSchema<ObjectShape<T, Final>, Final> :
				[number] extends [T] ? 
					NumberSchema<T extends number ? T : number, Final> :
					[string] extends [T] ? 
						StringSchema<T extends string ? T : string, Final> : 
						[boolean] extends [T] ? 
							BooleanSchema<T extends boolean ? T : boolean, Final> : 
							Schema<T, Final>

export type ZodTypeAny = Schema<any, any, any>

export declare type ZodRawShape = ObjectShape<any, any>;

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
					test1: string()
				})
			)
		})
	)
);

type TypeSchema = (typeof arrSchema)

type Input = TypeSchema['_input']

type Final = TypeSchema['_final']
