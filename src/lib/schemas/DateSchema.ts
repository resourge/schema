import { type Definitions } from '../core/Definitions';
import { Schema } from '../core/schema';
import { type RuleTestConfig } from '../rules/BaseRule';
import { type DateFormat } from '../types/DateFormat';
import { type NullableType } from '../types/SchemaMap';
import { createDate } from '../utils/Utils';

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
	config: RuleTestConfig<Form>
) => Date | undefined;

export class DateSchema<
	Input extends NullableType<Date | string> = Date | string,
	Final = any
> extends Schema<Input, Final> {
	protected message: string = '{{key}} is not date';
	protected rule = isDate;

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
			is: (value: Date | string) => !isToday(typeof value === 'string' ? new Date(value) : value),
			message: message ?? ((messages) => messages.date.today),
			name: `today_${message}`
		});
	}

	private getIsFunction<Form = this['final']>(
		date: Date | MinDateMethod<Form> | string,
		format: DateFormat,
		cb: (x: number, y: number) => boolean
	) {
		let getTime: (date: Date) => number;

		const _cb = typeof date === 'function'
			? (x: number | undefined, y: number) => {
				if (x === undefined) {
					return false;
				}
				return cb(x, y);
			}
			: cb;

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
				? (
					date: MinDateMethod<Form>,
					parent: any,
					config: RuleTestConfig<Form>
				) => {
					const _date = date(parent, config);

					return _date ? getTime(_date) : undefined;
				}
				: getTime
		) as (
			date: Date | MinDateMethod<Form>,
			parent: any,
			config: RuleTestConfig<Form>
		) => number;

		return (value: Date | string, parent: any, config: RuleTestConfig<Form>) => {
			return _cb(getDate(typeof date === 'string' ? new Date(date) : date, parent, config), getTime(typeof value === 'string' ? new Date(value) : value));
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
	public minDate<Form = this['final']>(
		minDate: Date | MinDateMethod<Form> | string,
		format: DateFormat = 'date',
		message?: string
	) {
		const _minDate = typeof minDate === 'string' ? new Date(minDate) : minDate;
		return this.test({
			is: this.getIsFunction(
				_minDate,
				format,
				(x, y) => x >= y
			),
			message: message ?? ((messages) => messages.date.minDate(
				typeof minDate === 'string' ? new Date(minDate) : minDate,
				format
			)),
			name: _minDate instanceof Date ? `minDate_${_minDate.toISOString()}_${format}_${message}` : undefined
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
	public maxDate<Form = this['final']>(
		maxDate: Date | MinDateMethod<Form> | string,
		format: DateFormat = 'date',
		message?: string
	) {
		const _maxDate = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;

		return this.test({
			is: this.getIsFunction(
				_maxDate,
				format,
				(x, y) => x <= y
			),
			message: message ?? ((messages) => messages.date.maxDate(
				typeof maxDate === 'string' ? new Date(maxDate) : maxDate,
				format
			)),
			name: _maxDate instanceof Date ? `maxDate_${_maxDate.toISOString()}_${format}_${message}` : undefined
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
	public equals<Form = this['final']>(
		date: Date | string | MinDateMethod<Form>,
		format: DateFormat = 'date',
		message?: string
	) {
		const _equalsDate = typeof date === 'string' ? new Date(date) : date;

		return this.test({
			is: this.getIsFunction(
				_equalsDate,
				format,
				(x, y) => x === y
			),
			message: message ?? ((messages) => messages.date.equals(
				typeof date === 'string' ? new Date(date) : date,
				format
			)),
			name: _equalsDate instanceof Date ? `equals_${_equalsDate.toISOString()}_${format}_${message}` : undefined
		});
	}
}

export const date = <Input extends Date = Date, Final = any>(message?: string) => new DateSchema<Input, Final>(message);
