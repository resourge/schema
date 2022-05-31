export type DeepReadonly<T> =
	T extends Array<infer R> ? ReadonlyArray<DeepReadonly<R>> :
		T extends Function ? T :
			T extends object ? {
				readonly [P in keyof T]: DeepReadonly<T[P]>;
			} :
				T;
