import { Schema } from '../core/schema'
import { MessageType } from '../utils/messages'

export type SchemaError = {
	path: string
	error: string
}
export type PrivateSchema = Schema<any, any> & { compileSchema: Schema<any, any>['compileSchema'] }

export type Context = {
	index: number
	onlyOnTouch?: boolean
	optional?: boolean
	nullable?: boolean
	messages: MessageType
	async?: boolean
	rules: {
		[key: string]: Function
	}
	onlyOnTouchErrors: {
		[key: string]: SchemaError[]
	}
}

export type CompileSchemaConfig = {
	context: Context
	key?: string
	srcCode?: string[]
	path?: string
}

export type CompileConfig = { 
	/**
	 * console logs the validation structure.
	 */
	debug?: boolean
	/**
	 * Makes onlyOnTouch default in the schemas.
	 */
	onlyOnTouch?: boolean
	/**
	 * Makes optional default in the schemas. @default undefined
	 */
	defaultOptional?: boolean
	/**
	 * Makes nullable default in the schemas. @default undefined
	 */
	defaultNullable?: boolean
	/**
	 * Object containing messages.
	 */
	messages?: Partial<MessageType>
}
