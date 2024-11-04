export type ExcludeByValueType<T, ValueType> = keyof { 
	[Key in keyof T as ValueType extends T[Key] ? never : Key]: T[Key] 
};

export type LiteralUnion<
	LiteralType,
	BaseType
> = LiteralType | (BaseType & Record<never, never>);

export type DeepPartial<T> = T extends (...args: any[]) => any 
	? T
	: T extends object ? {
		[P in keyof T]?: DeepPartial<T[P]>;
	} : T;

export type NullableType<T> = undefined | null | T;

export type SchemaError = {
	error: string
	path: string
};
