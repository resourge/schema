import { Schema, SchemaTypes } from '../core/schema';

const isToday = (someDate: Date): boolean => {
	const today = new Date()
	return someDate.getDate() === today.getDate() &&
		someDate.getMonth() === today.getMonth() &&
		someDate.getFullYear() === today.getFullYear()
}

export class DateSchema extends Schema<Date> {
	public type: SchemaTypes = SchemaTypes.DATE
	public message: string = `{{key}} is not ${this.type}`
	public rule = (value: Date) => (value instanceof Date) || isNaN((value as unknown as Date).getTime())

	/**
	 * Checks if is today
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public today(message?: string) {
		return this.test(
			'today',
			(value: Date) => isToday(value),
			message ?? '{{key}} is not today'
		)
	}
}

export const date = () => {
	return new DateSchema();
}
