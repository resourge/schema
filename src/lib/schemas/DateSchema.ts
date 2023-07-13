import { type Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { type DateFormat } from '../types/DateFormat';
import { type NullableType } from '../types/SchemaMap';
import { SchemaTypes, createDate } from '../utils/Utils';

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

	protected clone() {
		return new DateSchema<Input, Final>(this.message, this.def)
	}

	constructor(message?: string, def?: Definitions) {
		super(def);

		this.message = message ?? this.message;
	}
	
	/**
	 * Checks if is today
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 */
	public today(message?: string) {
		return this.test({
			is: (value: Date) => !isToday(value),
			message: message ?? ((messages) => messages.date.today),
			name: 'today'
		})
	}

	private getIsFunction(
		date: Date,
		format: DateFormat,
		cb: (x: number, y: number) => boolean
	) {
		let is: (value: Date) => boolean;

		switch (format) {
			case 'year':
				is = (value: Date) => cb(date.getFullYear(), value.getFullYear())
				break;
			case 'month':
				is = (value: Date) => {
					const _value = createDate({
						year: value.getFullYear(),
						month: value.getMonth()
					})
					return cb(
						createDate({
							year: date.getFullYear(),
							month: date.getMonth()
						}).getTime(), 
						_value.getTime()
					)
				}
				break;
			case 'date':
				is = (value: Date) => {
					const _value = createDate({
						year: value.getFullYear(),
						month: value.getMonth(),
						day: value.getDate()
					})
					return cb(
						createDate({
							year: date.getFullYear(),
							month: date.getMonth(),
							day: date.getDate()
						}).getTime(),
						_value.getTime()
					)
				}
				break;
			case 'hour': 
				is = (value: Date) => {
					const _value = createDate({
						year: value.getFullYear(),
						month: value.getMonth(),
						day: value.getDate(),
						hour: value.getHours()
					})
					return cb(
						createDate({
							year: date.getFullYear(),
							month: date.getMonth(),
							day: date.getDate(),
							hour: date.getHours()
						}).getTime(),
						_value.getTime()
					)
				}
				break;
			case 'minute': 
				is = (value: Date) => {
					const _value = createDate({
						year: value.getFullYear(),
						month: value.getMonth(),
						day: value.getDate(),
						hour: value.getHours(),
						minute: value.getMinutes()
					})
					return cb(
						createDate({
							year: date.getFullYear(),
							month: date.getMonth(),
							day: date.getDate(),
							hour: date.getHours(),
							minute: date.getMinutes()
						}).getTime(),
						_value.getTime()
					)
				}
				break;
			case 'second': 
				is = (value: Date) => {
					const _value = createDate({
						year: value.getFullYear(),
						month: value.getMonth(),
						day: value.getDate(),
						hour: value.getHours(),
						minute: value.getMinutes(),
						second: value.getSeconds()
					})
					return cb(
						createDate({
							year: date.getFullYear(),
							month: date.getMonth(),
							day: date.getDate(),
							hour: date.getHours(),
							minute: date.getMinutes(),
							second: date.getSeconds()
						}).getTime(),
						_value.getTime()
					)
				}
				break;
			case 'time': 
				is = (value: Date) => {
					const _value = createDate({
						hour: value.getHours(),
						minute: value.getMinutes(),
						second: value.getSeconds(),
						millisecond: value.getSeconds()
					})
					return cb(
						createDate({
							hour: date.getHours(),
							minute: date.getMinutes(),
							second: date.getSeconds(),
							millisecond: date.getSeconds()
						}).getTime(),
						_value.getTime()
					)
				}
				break;
			default: 
				is = (value: Date) => {
					return cb(
						date.getTime(),
						value.getTime()
					)
				}
				break;
		}

		return is
	}
	
	/**
	 * Checks if is date is bigger than minDate
	 * @param minDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public minDate(minDate: Date, format: DateFormat = 'date', message?: string) {
		return this.test({
			is: this.getIsFunction(
				minDate,
				format,
				(x, y) => x >= y
			),
			message: message ?? ((messages) => messages.date.minDate(minDate, format)),
			name: 'minDate'
		})
	}
	
	/**
	 * Checks if is date is smaller than maxDate
	 * @param maxDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public maxDate(maxDate: Date, format: DateFormat = 'date', message?: string) {
		return this.test({
			is: this.getIsFunction(
				maxDate,
				format,
				(x, y) => x <= y
			),
			message: message ?? ((messages) => messages.date.maxDate(maxDate, format)),
			name: 'maxDate'
		})
	}
	
	/**
	 * Checks if is date is equal than maxDate
	 * @param date
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public equals(date: Date, format: DateFormat = 'date', message?: string) {
		return this.test({
			is: this.getIsFunction(
				date,
				format,
				(x, y) => x === y
			),
			message: message ?? ((messages) => messages.date.maxDate(date, format)),
			name: 'maxDate'
		})
	}
}

export const date = <
	Input extends Date = Date,
	Final = any
>(message?: string) => {
	return new DateSchema<Input, Final>(message);
}
