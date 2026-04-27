import { type NullableType, type SchemaError } from '../types/types';

import { type SchemaMap } from './SchemaMap';

export type OneOf<Input extends NullableType<object> = object> = {
	[Key in keyof Input]?: SchemaMap<Input>[Key]
};

export type OneOfConfigMessage = SchemaError | SchemaError[] | string;
