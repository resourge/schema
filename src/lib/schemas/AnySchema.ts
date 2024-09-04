import { Schema } from '../core/schema';

export class AnySchema<
	Input = any, 
	Final = any
> extends Schema<Input, Final> {
	protected message: string = '{{key}} is not array';
	protected rule = () => true;
	
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
		}) as unknown as AnySchema<T[keyof T], Final>;
	}
}

export const any = < Input = any, Final = any>(message?: string) => new AnySchema<Input, Final>(message);
