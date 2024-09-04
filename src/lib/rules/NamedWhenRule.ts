import { type CompileSchemaConfig } from '../types/types';
import { PARAMETERS } from '../utils/Utils';
import { IS_DEV } from '../utils/constants';

import { getWhenRule, type WhenParameter } from './WhenRule';

export type NamedWhenRuleParameter<Value = any, T = any> = WhenParameter<Value, T, 'NamedWhenRule'> & {
	namedValueKey: string
};

export function getNamedWhenRule<Value = any, T = any>(
	config: NamedWhenRuleParameter<Value, T>,
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
			_valueKey = `${PARAMETERS.VALUE}.${_key}.${config.namedValueKey}`;
		}
		else {
			_valueKey = `${PARAMETERS.VALUE}.${config.namedValueKey}`;
		}
	}
	else if ( IS_DEV ) {
		throw new Error('Cannot use "when" at the schema root.');
	}
		
	return getWhenRule(
		config,
		_valueKey,
		{
			context, 
			key,
			path,
			srcCode
		}
	);
}
