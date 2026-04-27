/* istanbul ignore next -- @preserve */
enum GenericEnum {}

type IsStringUnion<T> = `${T extends Primitive ? T : ''}` extends T ? true : false;

type Primitive = bigint | boolean | null | number | string | undefined;

export type IsEnum<E> = E extends any[] 
	? false
	: E extends typeof GenericEnum 
		? IsStringUnion<E extends Primitive ? E : E> extends true 
			? false 
			: E extends object ? false : true
		: keyof E extends 'toString' | 'valueOf' 
			? false 
			: E extends GenericEnum 
				? false
				: keyof E extends 'toExponential' | 'toFixed' | 'toLocaleString' | 'toPrecision' | 'toString' | 'valueOf'
					? true
					: false;
