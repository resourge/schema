type AddDotToKey<TKey extends number | string> = `.${TKey}`;

type BrowserNativeObject = Blob | Date | File | FileList | Map<any, any> | Set<any> | Uint8Array | Uint16Array | Uint32Array;

type RecursiveKeyOfHandleValue<TValue, Text extends string, TraversedTypes> =
	TValue extends BrowserNativeObject | Primitive | TraversedTypes
		? Text
		: TValue extends Array<infer E>
			? `${Text}` | RecursiveKeyOfHandleValue<E, `${Text}[${number}]`, TraversedTypes>
			: TValue extends object
				? TValue extends Blob | Date | File | Map<any, any> | Set<any> | TraversedTypes | Uint8Array | Uint16Array | Uint32Array
					? Text
					: `${Text}${AddDotToKey<RecursiveKeyOf<TValue, TraversedTypes | TValue>>}` | Text
				: Text;
  
type ToString<TKey extends number | string> = `${TKey}`;

export type FormKey<T extends any[] | Record<string, any>> = LiteralUnion<
	T extends Array<infer E>
		? RecursiveKeyOfHandleValue<E, `[${number}]`, number>
		: RecursiveKeyOf<T>, 
	string
>;

export type LiteralUnion<
	LiteralType,
	BaseType extends Primitive
> = (BaseType & Record<never, never>) | LiteralType;

export type OnlyOnTouch<Input> = Array<Input extends any[] | Record<string, any> ? FormKey<Input> : string>;

export type Primitive =
	| bigint
	| boolean
	| null
	| number
	| string
	| symbol
	| undefined;

export type RecursiveKeyOf<TObj extends object, TraversedTypes = TObj> = {
	[TKey in keyof TObj & (number | string)]: RecursiveKeyOfHandleValue<TObj[TKey], ToString<TKey>, TraversedTypes>;
}[keyof TObj & (number | string)];
