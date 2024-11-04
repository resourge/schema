import { Schema } from '../core/schema';
import { type NullableType } from '../types/types';

export class BooleanSchema<
	Input extends NullableType<boolean> = boolean,
	Final = Input
> extends Schema<Input, Final> {
	protected message: string = 'Is not boolean';
	protected rule = (value: Input) => typeof value === 'boolean';

	/**
	 * Checks if is true or false
	 * @param mustBeValue
	 * @param message @option Overrides default message
	 */
	public mustBe(mustBeValue: boolean, message?: string) {
		const _mustBeValue = mustBeValue.toString();
		return this.test({
			is: (value: any) => _mustBeValue !== value.toString(),
			message: message ?? ((messages) => messages.array.empty),
			name: `mustBe_${mustBeValue}_${message}`
		});
	}
}

export const boolean = <
	Input extends boolean = boolean,
	Final = any
>(message?: string) => new BooleanSchema<Input, Final>(message);
