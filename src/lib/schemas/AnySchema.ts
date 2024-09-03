import { type Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';

export class AnySchema<
	Input = any, 
	Final = any
> extends Schema<Input, Final> {
	protected message: string = '{{key}} is not array';
	protected rule = () => true;
	
	protected clone() {
		return new AnySchema(this.message, this.def);
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}

	/**
	 * Checks if is a value of enum.
	 * @param enumObject enum
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	public enum<T extends { [name: string]: any }>(enumObject: T, message?: string) {
		const enumValues = Object.values(enumObject);

		return this.test({
			is: (value) => !enumValues.includes(value),
			message: message ?? ((messages) => messages.any.enum)
			// name: 'enumString'
		}) as unknown as AnySchema<T[keyof T], Final>;
	}
}

export const any = <
	Input = any,
	Final = any
>(message?: string) => {
	return new AnySchema<Input, Final>(message);
};
