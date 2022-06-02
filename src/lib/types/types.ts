import { MessageType } from '../utils/messages'

export type SchemaError = {
	key: string
	error: string
}

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
	debug?: boolean
	onlyOnTouch?: boolean
	defaultOptional?: boolean
	defaultNullable?: boolean
	messages?: Partial<MessageType>
}
