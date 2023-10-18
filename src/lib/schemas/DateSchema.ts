import { type Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { type RuleTestConfig } from '../rules/BaseRule';
import { type DateFormat } from '../types/DateFormat';
import { type NullableType } from '../types/SchemaMap';
import { SchemaTypes, createDate } from '../utils/Utils';

const isToday = (someDate: Date): boolean => {
	const today = new Date();
	return someDate.getDate() === today.getDate()
		&& someDate.getMonth() === today.getMonth()
		&& someDate.getFullYear() === today.getFullYear();
};

type MinDateMethod<Form> = (parent: any, config: RuleTestConfig<Form>) => Date | undefined

export class DateSchema<
	Input extends NullableType<Date> = Date,
	Final = any
> extends Schema<Input, Final> {
	protected type: SchemaTypes = SchemaTypes.DATE;
	protected message: string = `{{key}} is not ${this.type}`;
	protected rule = (value: Date) => (value instanceof Date) && !isNaN((value as unknown as Date).getTime());

	protected clone() {
		return new DateSchema<Input, Final>(this.message, this.def);
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
		});
	}

	private getIsFunction<Form = this['final']>(
		date: Date | MinDateMethod<Form>,
		format: DateFormat,
		cb: (x: number, y: number) => boolean
	) {
		let getTime: (date: Date) => number;

		const _cb = typeof date === 'function' 
			? (x: number | undefined, y: number) => {
				if ( x === undefined ) {
					return false;
				}
				return cb(x, y);
			} : cb;

		switch (format) {
			case 'year':
				getTime = (date: Date) => date.getFullYear();
				break;
			case 'month':
				getTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth()
				}).getTime();
				break;
			case 'date':
				getTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate()
				}).getTime();
				break;
			case 'hour': 
				getTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate(),
					hour: date.getHours()
				}).getTime();
				break;
			case 'minute': 
				getTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate(),
					hour: date.getHours(),
					minute: date.getMinutes()
				}).getTime();
				break;
			case 'second': 
				getTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate(),
					hour: date.getHours(),
					minute: date.getMinutes(),
					second: date.getSeconds()
				}).getTime();
				break;
			case 'time': 
				getTime = (date: Date) => createDate({
					hour: date.getHours(),
					minute: date.getMinutes(),
					second: date.getSeconds(),
					millisecond: date.getSeconds()
				}).getTime();
				break;
			default: 
				getTime = (date: Date) => date.getTime();
				break;
		}

		const getDate = (
			typeof date === 'function' 
				? (date: MinDateMethod<Form>, parent: any, config: RuleTestConfig<Form>) => {
					const _date = date(parent, config);

					return _date ? getTime(_date) : undefined;
				} : getTime
		) as (date: Date | MinDateMethod<Form>, parent: any, config: RuleTestConfig<Form>) => number;

		return (value: Date, parent: any, config: RuleTestConfig<Form>) => {
			return _cb(
				getDate(date, parent, config), 
				getTime(value)
			);
		};
	}
	
	/**
	 * Checks if is date is bigger than minDate
	 * @param minDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public minDate<Form = this['final']>(minDate: Date | MinDateMethod<Form>, format: DateFormat = 'date', message?: string) {
		return this.test({
			is: this.getIsFunction(
				minDate,
				format,
				(x, y) => x >= y
			),
			message: message ?? ((messages) => messages.date.minDate(minDate, format)),
			name: 'minDate'
		});
	}
	
	/**
	 * Checks if is date is smaller than maxDate
	 * @param maxDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public maxDate<Form = this['final']>(maxDate: Date | MinDateMethod<Form>, format: DateFormat = 'date', message?: string) {
		return this.test({
			is: this.getIsFunction(
				maxDate,
				format,
				(x, y) => x <= y
			),
			message: message ?? ((messages) => messages.date.maxDate(maxDate, format)),
			name: 'maxDate'
		});
	}
	
	/**
	 * Checks if is date is equal than maxDate
	 * @param date
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * {{key}} will be replace with current key
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public equals<Form = this['final']>(date: Date | MinDateMethod<Form>, format: DateFormat = 'date', message?: string) {
		return this.test({
			is: this.getIsFunction(
				date,
				format,
				(x, y) => x === y
			),
			message: message ?? ((messages) => messages.date.maxDate(date, format)),
			name: 'maxDate'
		});
	}
}

export const date = <
	Input extends Date = Date,
	Final = any
>(message?: string) => {
	return new DateSchema<Input, Final>(message);
};
