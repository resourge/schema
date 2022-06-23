import { Schema } from '../core/schema'
import { CompileSchemaConfig } from '../types/types'
import { SchemaTypes } from '../utils/Utils'

import { RuleBooleanMethod } from './Rule'
import { WhenRule } from './WhenRule'

export class NamedWhenRule<Value = any, T = any> extends WhenRule<Value, T> {
	public namedValueKey: string;

	constructor(
		namedValueKey: string,
		name: string,
		schemaType: SchemaTypes,
		method: RuleBooleanMethod<Value, T>,
		onlyOnTouch: boolean,
		then: Schema<any, any>,
		otherwise?: Schema<any, any>
	) {
		super(
			name,
			schemaType,
			method,
			onlyOnTouch,
			then,
			otherwise
		);

		this.namedValueKey = namedValueKey;
	}

	public override getWhenRule(
		valueKey: string,
		{
			context, 
			key,
			path,
			srcCode
		}: CompileSchemaConfig,
		arrayKey?: string
	): string[] {
		let _valueKey = valueKey;
		let _key = key;
		
		if ( _key ) {
			if ( _key.includes('.') ) {
				const arr = _key.split('.');
				arr.pop();

				_key = arr.join('.')
				_valueKey = `value.${_key}.${this.namedValueKey}`
			}
			else {
				_valueKey = `value.${this.namedValueKey}`
			}
		}
		else if ( __DEV__ ) {
			throw new Error('Cannot use "when" at the schema root.')
		}
		
		return super.getWhenRule(
			_valueKey,
			{
				context, 
				key,
				path,
				srcCode
			},
			arrayKey
		)
	}
}
