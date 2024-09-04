import { type NullableType, type SchemaMap } from './SchemaMap';
import { type SchemaError } from './types';

export type OneOf<Input extends NullableType<object> = object> = {
	[Key in keyof Input]?: SchemaMap<Input>[Key]
};

export type OneOfConfigMessage = string | SchemaError | SchemaError[];
