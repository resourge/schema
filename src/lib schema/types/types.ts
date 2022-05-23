import { Shape, ZodRawShape, ZodTypeAny } from './SchemaObject';

export declare namespace objectUtil {
	export type MergeShapes<U extends ZodRawShape, V extends ZodRawShape> = {
		[k in Exclude<keyof U, keyof V>]: U[k];
	} & V;
	type optionalKeys<T extends object> = {
		[k in keyof T]: undefined extends T[k] ? k : never;
	}[keyof T];
	type requiredKeys<T extends object> = {
		[k in keyof T]: undefined extends T[k] ? never : k;
	}[keyof T];
	export type addQuestionMarks<T extends object> = {
		[k in optionalKeys<T>]?: T[k];
	} & {
		[k in requiredKeys<T>]: T[k];
	};
	export type identity<T> = T;
	export type flatten<T extends object> = identity<{
		[k in keyof T]: T[k];
	}>;
	export type noNeverKeys<T extends ZodRawShape> = {
		[k in keyof T]: [T[k]] extends [never] ? never : k;
	}[keyof T];
	export type noNever<T extends ZodRawShape> = identity<{
		[k in noNeverKeys<T>]: k extends keyof T ? T[k] : never;
	}>;
	export const mergeShapes: <U extends ZodRawShape, T extends ZodRawShape>(first: U, second: T) => T & U;
	export {};
}

export declare type baseObjectOutputType<S extends ZodRawShape> = objectUtil.flatten<objectUtil.addQuestionMarks<{
	[k in keyof S]: S[k] extends Shape<any, any> ?S[k]['_output'] : never;
}>>;
export declare type objectOutputType<S extends ZodRawShape, Catchall extends ZodTypeAny> = ZodTypeAny extends Catchall ? baseObjectOutputType<S> : objectUtil.flatten<baseObjectOutputType<S> & {
	[k: string]: Catchall['_output']
}>;
export declare type baseObjectInputType<S extends ZodRawShape> = objectUtil.flatten<objectUtil.addQuestionMarks<{
	[k in keyof S]: S[k] extends Shape<any, any> ?S[k]['_input'] : never;
}>>;
export declare type objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny> = ZodTypeAny extends Catchall ? baseObjectInputType<Shape> : objectUtil.flatten<baseObjectInputType<Shape> & {
	[k: string]: Catchall['_input']
}>;
