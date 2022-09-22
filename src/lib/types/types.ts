import { Schema } from '../core/schema'
import { MessageType } from '../utils/messages'

export type SchemaError = {
	error: string
	path: string
}
export type PrivateSchema = Schema<any, any> & { compileSchema: Schema<any, any>['compileSchema'] }

export type Context = {
	index: number
	messages: MessageType
	onlyOnTouchErrors: {
		[key: string]: SchemaError[]
	}
	rules: {
		[key: string]: Function
	}
	async?: boolean
	nullable?: boolean
	onlyOnTouch?: boolean
	optional?: boolean
}

export type CompileSchemaConfig = {
	context: Context
	key?: string
	path?: string
	srcCode?: string[]
}

export type CompileConfig = { 
	/**
	 * console logs the validation structure.
	 */
	debug?: boolean
	/**
	 * Makes nullable default in the schemas. @default undefined
	 */
	defaultNullable?: boolean
	/**
	 * Makes optional default in the schemas. @default undefined
	 */
	defaultOptional?: boolean
	/**
	 * Object containing messages.
	 */
	messages?: Partial<MessageType>
	/**
	 * Makes onlyOnTouch default in the schemas.
	 */
	onlyOnTouch?: boolean
}
