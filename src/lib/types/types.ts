export type DeepPartial<T> = T extends (...args: any[]) => any 
	? T
	: T extends object ? {
		[P in keyof T]?: DeepPartial<T[P]>;
	} : T;

export type ExcludeByValueType<T, ValueType> = keyof { 
	[Key in keyof T as ValueType extends T[Key] ? never : Key]: T[Key] 
};

export type LiteralUnion<
	LiteralType,
	BaseType
> = (BaseType & Record<never, never>) | LiteralType;

export type NullableType<T> = null | T | undefined;

export type SchemaError = {
	error: string
	path: string
};
