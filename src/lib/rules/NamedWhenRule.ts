import { type CompileSchemaConfig } from '../types/types';
import { PARAMETERS } from '../utils/Utils';
import { IS_DEV } from '../utils/constants';

import { type WhenParameter, WhenRule } from './WhenRule';

export type NamedWhenRuleParameter<Value = any, T = any> = WhenParameter<Value, T> & {
	namedValueKey: string
};

export class NamedWhenRule<Value = any, T = any> extends WhenRule<Value, T> {
	public namedValueKey: string;

	constructor(config: NamedWhenRuleParameter) {
		super(config);

		this.namedValueKey = config.namedValueKey;
	}

	public override getWhenRule(
		valueKey: string,
		{
			context, 
			key,
			path,
			srcCode
		}: CompileSchemaConfig
	): string[] {
		let _valueKey = valueKey;
		let _key = key;
		
		if ( _key ) {
			if ( _key.includes('.') ) {
				const arr = _key.split('.');
				arr.pop();

				_key = arr.join('.');
				_valueKey = `${PARAMETERS.VALUE}.${_key}.${this.namedValueKey}`;
			}
			else {
				_valueKey = `${PARAMETERS.VALUE}.${this.namedValueKey}`;
			}
		}
		else if ( IS_DEV ) {
			throw new Error('Cannot use "when" at the schema root.');
		}
		
		return super.getWhenRule(
			_valueKey,
			{
				context, 
				key,
				path,
				srcCode
			}
		);
	}
}
