import { Schema } from '../core/schema';
import { NullableType } from '../types/_types';
import { SchemaTypes } from '../utils/Utils';

const isToday = (someDate: Date): boolean => {
	const today = new Date()
	return someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
}

export class DateSchema<
	Input extends NullableType<Date> = Date,
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.DATE
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Date) => (value instanceof Date) && !isNaN((value as unknown as Date).getTime())

	constructor(message?: string) {
		super();

		this.message = message ?? this.message;
	}
	
	/**
	 * Checks if is today
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public today(message?: string) {
		return this.test({
			test: (value: Date) => isToday(value),
			message: message ?? ((messages) => messages.date.today),
			name: 'today'
		})
	}
}

export const date = <
	Input extends Date = Date,
	Final = any
>() => {
	return new DateSchema<Input, Final>();
}
