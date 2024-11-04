import { Schema } from '../core/schema';
import { type ValidationContext } from '../rules/BaseRule';
import { type DateFormat } from '../types/DateFormat';
import { type NullableType } from '../types/types';
import { createDate } from '../utils/DateUtils';

const isToday = (someDate: Date): boolean => {
	const today = new Date();
	return (
		someDate.getDate() === today.getDate()
		&& someDate.getMonth() === today.getMonth()
		&& someDate.getFullYear() === today.getFullYear()
	);
};

function isDate(input: any) {    
	if (input instanceof Date && !isNaN(input.valueOf())) {
		return true;
	}
	if (typeof input === 'string') {
		const date = new Date(input);
		return !isNaN(date.valueOf());
	}
	return false;
}

export type MinDateMethod<Form> = (
	parent: any,
	config: ValidationContext<Form>
) => Date | undefined;

export class DateSchema<
	Input extends NullableType<Date | string> = Date | string,
	Final = any
> extends Schema<Input, Final> {
	protected message: string = 'Is not date';
	protected rule = isDate;

	/**
	 * Checks if is today
	 * @param message @option Overrides default message
	 */
	public today(message?: string) {
		return this.test({
			is: (value: Date | string) => !isToday(typeof value === 'string' ? new Date(value) : value),
			message: message ?? ((messages) => messages.date.today),
			name: `today_${message}`
		});
	}

	private getComparisonFunction<Form = this['final']>(
		date: Date | MinDateMethod<Form> | string,
		format: DateFormat,
		compareFn: (x: number, y: number) => boolean
	) {
		let extractTime: (date: Date) => number;

		switch (format) {
			case 'year':
				extractTime = (date: Date) => date.getFullYear();
				break;
			case 'month':
				extractTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth()
				}).getTime();
				break;
			case 'date':
				extractTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate()
				}).getTime();
				break;
			case 'hour':
				extractTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate(),
					hour: date.getHours()
				}).getTime();
				break;
			case 'minute':
				extractTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate(),
					hour: date.getHours(),
					minute: date.getMinutes()
				}).getTime();
				break;
			case 'second':
				extractTime = (date: Date) => createDate({
					year: date.getFullYear(),
					month: date.getMonth(),
					day: date.getDate(),
					hour: date.getHours(),
					minute: date.getMinutes(),
					second: date.getSeconds()
				}).getTime();
				break;
			case 'time':
				extractTime = (date: Date) => createDate({
					hour: date.getHours(),
					minute: date.getMinutes(),
					second: date.getSeconds(),
					millisecond: date.getSeconds()
				}).getTime();
				break;
			default:
				extractTime = (date: Date) => date.getTime();
				break;
		}

		const getDate = (
			typeof date === 'function'
				? (
					date: MinDateMethod<Form>,
					parent: any,
					config: ValidationContext<Form>
				) => {
					const _date = date(parent, config);

					return _date ? extractTime(_date) : undefined;
				}
				: extractTime
		) as (
			date: Date | MinDateMethod<Form>,
			parent: any,
			config: ValidationContext<Form>
		) => number;

		const _cb = typeof date === 'function'
			? (x: number | undefined, y: number) => {
				if (x === undefined) {
					return false;
				}
				return compareFn(x, y);
			}
			: compareFn;

		return (value: Date | string, parent: any, config: ValidationContext<Form>) => {
			return _cb(
				getDate(typeof date === 'string' ? new Date(date) : date, parent, config), 
				extractTime(typeof value === 'string' ? new Date(value) : value)
			);
		};
	}

	/**
	 * Checks if is date is bigger than minDate
	 * @param minDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public minDate<Form = this['final']>(
		minDate: Date | MinDateMethod<Form> | string,
		format: DateFormat = 'date',
		message?: string
	) {
		const minDateValue = typeof minDate === 'string' ? new Date(minDate) : minDate;
		return this.test({
			is: this.getComparisonFunction(
				minDateValue,
				format,
				(x, y) => x >= y
			),
			message: message ?? ((messages) => messages.date.minDate(
				minDateValue,
				format
			)),
			name: minDateValue instanceof Date ? `minDate_${minDateValue.toISOString()}_${format}_${message}` : undefined
		});
	}

	/**
	 * Checks if is date is smaller than maxDate
	 * @param maxDate
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public maxDate<Form = this['final']>(
		maxDate: Date | MinDateMethod<Form> | string,
		format: DateFormat = 'date',
		message?: string
	) {
		const maxDateValue = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;

		return this.test({
			is: this.getComparisonFunction(
				maxDateValue,
				format,
				(x, y) => x <= y
			),
			message: message ?? ((messages) => messages.date.maxDate(
				maxDateValue,
				format
			)),
			name: maxDateValue instanceof Date ? `maxDate_${maxDateValue.toISOString()}_${format}_${message}` : undefined
		});
	}

	/**
	 * Checks if is date is equal than maxDate
	 * @param date
	 * @param format @option @default 'date' compares date using format (ex: format = 'date' it will only compare year, month and date
	 * @param message @option Overrides default message
	 * * Note: If format = 'time' it will only compare hour, minutes, seconds and milliseconds, while format = 'dateTime' it will compare everything
	 */
	public equals<Form = this['final']>(
		date: Date | string | MinDateMethod<Form>,
		format: DateFormat = 'date',
		message?: string
	) {
		const equalsDateValue = typeof date === 'string' ? new Date(date) : date;

		return this.test({
			is: this.getComparisonFunction(
				equalsDateValue,
				format,
				(x, y) => x === y
			),
			message: message ?? ((messages) => messages.date.equals(
				equalsDateValue,
				format
			)),
			name: equalsDateValue instanceof Date ? `equals_${equalsDateValue.toISOString()}_${format}_${message}` : undefined
		});
	}
}

export const date = <Input extends Date = Date, Final = any>(message?: string) => new DateSchema<Input, Final>(message);
