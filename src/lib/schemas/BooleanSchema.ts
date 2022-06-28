import { Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { NullableType } from '../types/SchemaMap';
import { SchemaTypes } from '../utils/Utils';

export class BooleanSchema<
	Input extends NullableType<boolean> = boolean,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.BOOLEAN
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Input) => typeof value === 'boolean'
	
	protected clone() {
		return new BooleanSchema<Input, Final>(this.message, this.def)
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}

	/**
	 * Checks if is true or false
	 * @param mustBeValue
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public mustBe(mustBeValue: boolean, message?: string) {
		const _mustBeValue = mustBeValue.toString();
		return this.test({
			test: (value: any) => _mustBeValue === value.toString(),
			message: message ?? ((messages) => messages.array.empty),
			name: 'mustBe'
		})
	}
}

export const boolean = <
	Input extends boolean = boolean,
	Final = any
>() => {
	return new BooleanSchema<Input, Final>();
}
