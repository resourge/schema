import { type BaseRule } from '../rules/BaseRule';
import { type WhenRule } from '../rules/WhenRule';
import { type FormKey } from '../types/FormKey';
import { type SchemaError } from '../types/types';

type OnlyOnTouch<Input> = Array<Input extends any[] | Record<string, any> ? FormKey<Input> : string>

export class Definitions<Input = any, Final = any> {
	public _isOnlyOnTouch?: boolean;

	public _isOptional?: boolean;
	public messageOptional?: string;

	public _isNullable?: boolean;
	public messageNullable?: string;

	public _isRequired?: boolean;
	public messageRequired?: string;

	/**
	 * Path for current value
	 */
	public path: string = '';
	public normalRules = new Map<string, BaseRule<Input, Final, (...args: any[]) => any>>();
	public whenRules: WhenRule[] = []

	public _validate: ((value: any, onlyOnTouch?: OnlyOnTouch<Input>) => Promise<SchemaError[]> | SchemaError[]) | undefined

	public clone(): Definitions<Input, Final> {
		const newDefinitions = new Definitions();

		newDefinitions._isOnlyOnTouch = this._isOnlyOnTouch;
		newDefinitions._isOptional = this._isOptional;
		newDefinitions.messageOptional = this.messageOptional;
		newDefinitions._isNullable = this._isNullable;
		newDefinitions.messageNullable = this.messageNullable;
		newDefinitions._isRequired = this._isRequired;
		newDefinitions.messageRequired = this.messageRequired;
		newDefinitions.path = this.path;
		newDefinitions.normalRules = new Map(this.normalRules);
		newDefinitions.whenRules = [...this.whenRules];

		return newDefinitions;
	}
}
