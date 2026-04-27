import { type OnlyOnTouchRuleConfig, type RuleConfig } from '../rules/Rule';
import { type WhenParameter } from '../rules/WhenRule';
import { type OnlyOnTouch } from '../types/FormKey';
import { type SchemaError } from '../types/types';

export class Definitions<Input = any, Final = any> {
	public _validate: ((value: any, onlyOnTouch?: OnlyOnTouch<Input>) => Promise<SchemaError[]> | SchemaError[]) | undefined;

	public isNullable?: boolean;
	public isOnlyOnTouch?: boolean;

	public isOptional?: boolean;
	public isRequired?: boolean;

	public messageNullable?: string;
	public messageOptional?: string;

	public messageRequired?: string;
	public normalRules = new Map<string, OnlyOnTouchRuleConfig | RuleConfig<Input, Final>>();

	public whenRules: WhenParameter[] = [];

	public clone(): Definitions<Input, Final> {
		const newDefinitions = Object.assign<Definitions, this>(Object.create(Object.getPrototypeOf(this)), this);

		newDefinitions.normalRules = new Map(this.normalRules);
		newDefinitions.whenRules = [...this.whenRules];

		return newDefinitions;
	}
}
