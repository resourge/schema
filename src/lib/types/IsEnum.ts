
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type IsEnum<E> = IsUnion<NonNullable<E>> extends true 
	? keyof E extends 'toString' | 'valueOf' 
		? true 
		: false 
	: false
