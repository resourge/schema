type Primitive = string | number | bigint | boolean | null | undefined

type IsStringUnion<T> = `${T extends Primitive ? T : ''}` extends T ? true : false

enum GenericEnum {}

export type IsEnum<E> = E extends any[] 
	? false
	: E extends typeof GenericEnum 
		? IsStringUnion<E extends Primitive ? E : E> extends true 
			? false 
			: E extends object ? false : true
		: false
