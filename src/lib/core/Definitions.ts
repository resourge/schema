import { type NamedWhenRuleParameter } from '../rules/NamedWhenRule';
import { type OnlyOnTouchRuleConfig, type RuleConfig } from '../rules/Rule';
import { type WhenParameter } from '../rules/WhenRule';
import { type FormKey } from '../types/FormKey';
import { type SchemaError } from '../types/types';

export type OnlyOnTouch<Input> = Array<Input extends any[] | Record<string, any> ? FormKey<Input> : string>;

export class Definitions<Input = any, Final = any> {
	public isOnlyOnTouch?: boolean;

	public isOptional?: boolean;
	public messageOptional?: string;

	public isNullable?: boolean;
	public messageNullable?: string;

	public isRequired?: boolean;
	public messageRequired?: string;

	/**
	 * Path for current value
	 */
	public path: string = '';
	public normalRules = new Map<string, RuleConfig<Input, Final> | OnlyOnTouchRuleConfig>();
	public whenRules: Array<WhenParameter | NamedWhenRuleParameter> = [];

	public _validate: ((value: any, onlyOnTouch?: OnlyOnTouch<Input>) => Promise<SchemaError[]> | SchemaError[]) | undefined;

	public clone(): Definitions<Input, Final> {
		const newDefinitions = Object.assign<Definitions, this>(Object.create(Object.getPrototypeOf(this)), this);

		newDefinitions.normalRules = new Map(this.normalRules);
		newDefinitions.whenRules = [...this.whenRules];

		return newDefinitions;
	}
}
