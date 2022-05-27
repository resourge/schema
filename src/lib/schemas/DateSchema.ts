import { Schema, SchemaTypes } from '../core/schema';

const isToday = (someDate: Date): boolean => {
	const today = new Date()
	return someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
}

export class DateSchema<
	Input extends Date = Date,
	Final = Input
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.DATE
	protected message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Date) => (value instanceof Date) && !isNaN((value as unknown as Date).getTime())

	/**
	 * Checks if is today
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public today(message?: string) {
		return this.test(
			(value: Date) => isToday(value),
			message ?? ((messages) => messages.date.today),
			'today'
		)
	}
}

export const date = <
	Input extends Date = Date,
	Final = Input
>(
	cb?: (schema: DateSchema<Input, Final>) => void
) => {
	const schema = new DateSchema<Input, Final>();

	cb && cb(schema);

	return schema;
}
