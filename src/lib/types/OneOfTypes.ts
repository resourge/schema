import { type NullableType, type SchemaMap } from './SchemaMap'
import { type SchemaError } from './types'

export type OneOf<Input extends NullableType<object> = object> = {
	[Key in keyof Input]?: SchemaMap<Input>[Key]
}

export type OneOfConfigMessage = string | SchemaError | SchemaError[]

export type OneOfConfig = {
	/**
	 * By default it will fail at the first "error", with this option it will include all errors.
	 * @default false
	 * * Note: If message is of type object or array, this will be ignored.
	 */
	includeAllErrors?: boolean
	/**
	 * Custom message for the error.
	 * If string, it will always put the message on the first key
	 */
	message?: OneOfConfigMessage
}
