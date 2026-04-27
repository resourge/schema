import { describe, expect, it } from 'vitest';

import { type SchemaError } from '../../types/types';
import { createDate } from '../../utils/DateUtils';
import { date, DateSchema } from '../DateSchema';
import { object } from '../ObjectSchema';

describe('date', () => {
	it('should be today', () => {
		const schema = date<Date>()
		.today()
		.compile();

		expect((schema.validate(new Date('2001-01-01')) as SchemaError[]).length === 0)
		.toBeFalsy();
		expect((schema.validate(new Date()) as SchemaError[]).length === 0)
		.toBeTruthy();
		expect((schema.validate(new Date('test')) as SchemaError[]).length === 0)
		.toBeFalsy();

		const _date = new Date();

		_date.setHours(10);

		expect((schema.validate(_date) as SchemaError[]).length === 0)
		.toBeTruthy();

		const newMessage = 'New Message';
		const schemaMessage = new DateSchema()
		.today(newMessage);

		const errors: SchemaError[] = [{
			error: newMessage,
			path: ''
		}];

		expect(
			schemaMessage.validate(new Date('2001-01-01') as Date & string)
		)
		.toEqual(errors);
	});

	it('should each schema be separated from previous', () => {
		const schema = date()
		.nullable();
		const schema1 = schema.optional()
		.today();
	
		// @ts-expect-error // To check protected values
		expect(schema.def.isNullable)
		.toBe(true);
		// @ts-expect-error // To check protected values
		expect(schema.def.isOptional)
		.toBeUndefined();
		// @ts-expect-error // To check protected values
		expect(schema1.def.isNullable)
		.toBe(true);
		// @ts-expect-error // To check protected values
		expect(schema1.def.isOptional)
		.toBe(true);

		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size)
		.toBe(0);
		// @ts-expect-error // To check protected values
		expect(schema1.def.normalRules.size)
		.toBe(1);
		// @ts-expect-error // To check protected values
		expect(schema.def.normalRules.size).not.toBe(schema1.def.normalRules.size);
	});

	it('should be optional even if is not date type', () => {
		const schema = date()
		.notRequired();

		// @ts-expect-error To test if is valid
		expect((schema.validate(undefined) as SchemaError[]).length === 0)
		.toBe(true);
		// @ts-expect-error To test if is valid
		expect((schema.validate(null) as SchemaError[]).length === 0)
		.toBe(true);
	});

	describe('should be bigger than min date', () => {
		function expectBiggerYear(schema: DateSchema<Date, any>) {
			const dateBiggerYear = createDate({
				year: 2001
			});
			expect((schema.validate(dateBiggerYear) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerMonth(schema: DateSchema<Date, any>) {
			const dateBiggerMonth = createDate({
				month: 4,
				year: 2000
			});
			expect((schema.validate(dateBiggerMonth) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerDate(schema: DateSchema<Date, any>) {
			const dateBiggerDay = createDate({
				day: 2,
				month: 3,
				year: 2000
			});
			expect((schema.validate(dateBiggerDay) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerHour(schema: DateSchema<Date, any>) {
			const dateBiggerHour = createDate({
				day: 1,
				hour: 11,
				month: 3,
				year: 2000
			});
			expect((schema.validate(dateBiggerHour) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerMinute(schema: DateSchema<Date, any>) {
			const dateBiggerMinute = createDate({
				day: 1,
				hour: 10,
				minute: 11,
				month: 3,
				year: 2000
			});
			expect((schema.validate(dateBiggerMinute) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerSecond(schema: DateSchema<Date, any>) {
			const dateBiggerSecond = createDate({
				day: 1,
				hour: 10,
				minute: 10,
				month: 3,
				second: 11,
				year: 2000
			});
			expect((schema.validate(dateBiggerSecond) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectSame(date: Date, schema: DateSchema<Date, any>) {
			expect((schema.validate(date) as SchemaError[]).length === 0)
			.toBeFalsy();
		}

		it('only on year', () => {
			const minDate = createDate({
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'year')
			.compile();

			expectBiggerYear(schema);

			expectSame(minDate, schema);

			const dateBiggerMonth = createDate({
				month: 4,
				year: 2000
			});
			expect((schema.validate(dateBiggerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 1,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on month', () => {
			const minDate = createDate({
				month: 3,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'month')
			.compile();

			expectBiggerYear(schema);

			expectBiggerMonth(schema);

			expectSame(minDate, schema);

			const dateSmallerMonth = createDate({
				month: 1,
				year: 2000
			});
			expect((schema.validate(dateSmallerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 10,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on date', () => {
			const minDate = createDate({
				day: 1,
				month: 3,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'date')
			.compile();

			expectBiggerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectSame(minDate, schema);

			const dateSmallerMonth = createDate({
				month: 1,
				year: 2000
			});
			expect((schema.validate(dateSmallerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 10,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on hour', () => {
			const minDate = createDate({
				day: 1,
				hour: 10,
				month: 3,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'hour')
			.compile();

			expectBiggerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectSame(minDate, schema);

			const dateSmallerMonth = createDate({
				month: 1,
				year: 2000
			});
			expect((schema.validate(dateSmallerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 10,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on minute', () => {
			const minDate = createDate({
				day: 1,
				hour: 10,
				minute: 10,
				month: 3,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'minute')
			.compile();

			expectBiggerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectBiggerMinute(schema);

			expectSame(minDate, schema);

			const dateSmallerMonth = createDate({
				month: 1,
				year: 2000
			});
			expect((schema.validate(dateSmallerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 10,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on seconds', () => {
			const minDate = createDate({
				day: 1,
				hour: 10,
				minute: 10,
				month: 3,
				second: 10,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'second')
			.compile();

			expectBiggerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectBiggerMinute(schema);

			expectBiggerSecond(schema);

			expectSame(minDate, schema);

			const dateSmallerMonth = createDate({
				month: 1,
				year: 2000
			});
			expect((schema.validate(dateSmallerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 10,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on date time', () => {
			const minDate = createDate({
				day: 1,
				hour: 10,
				millisecond: 10,
				minute: 10,
				month: 3,
				second: 10,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'dateTime')
			.compile();

			expectBiggerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectBiggerMinute(schema);

			expectBiggerSecond(schema);

			const dateBiggerMillisecond = createDate({
				day: 1,
				hour: 10,
				millisecond: 11,
				minute: 10,
				month: 3,
				second: 10,
				year: 2000
			});
			expect((schema.validate(dateBiggerMillisecond) as SchemaError[]).length === 0)
			.toBeTruthy();

			expectSame(minDate, schema);

			const dateSmallerMonth = createDate({
				month: 1,
				year: 2000
			});
			expect((schema.validate(dateSmallerMonth) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSmallYear = createDate({
				month: 10,
				year: 1991
			});
			expect((schema.validate(dateSmallYear) as SchemaError[]).length === 0)
			.toBeFalsy();
		});

		it('only on time', () => {
			const minDate = createDate({
				day: 1,
				hour: 10,
				millisecond: 10,
				minute: 10,
				month: 3,
				second: 10,
				year: 2000
			});

			const schema = date()
			.minDate(minDate, 'time')
			.compile();

			const dateBiggerYearSameTime = createDate({
				day: 2,
				hour: 10,
				millisecond: 10,
				minute: 10,
				month: 3,
				second: 10,
				year: 2000
			});
			expect((schema.validate(dateBiggerYearSameTime) as SchemaError[]).length === 0)
			.toBeFalsy();

			const dateSameTimeAndDate = createDate({
				day: 2,
				hour: 10,
				millisecond: 10,
				minute: 10,
				month: 3,
				second: 10,
				year: 2000
			});
			expect((schema.validate(dateSameTimeAndDate) as SchemaError[]).length === 0)
			.toBeFalsy();
		});
	});

	describe('should be smaller than max date', () => {
		function expectSmallerYear(schema: DateSchema<Date, any>) {
			const dateSmallerYear = createDate({
				year: 2001
			});
			expect((schema.validate(dateSmallerYear) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerMonth(schema: DateSchema<Date, any>) {
			const dateBiggerMonth = createDate({
				month: 4,
				year: 2002
			});
			expect((schema.validate(dateBiggerMonth) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerDate(schema: DateSchema<Date, any>) {
			const dateBiggerDay = createDate({
				day: 2,
				month: 3,
				year: 2002
			});
			expect((schema.validate(dateBiggerDay) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerHour(schema: DateSchema<Date, any>) {
			const dateBiggerHour = createDate({
				day: 1,
				hour: 11,
				month: 3,
				year: 2002
			});
			expect((schema.validate(dateBiggerHour) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerMinute(schema: DateSchema<Date, any>) {
			const dateBiggerMinute = createDate({
				day: 1,
				hour: 10,
				minute: 11,
				month: 3,
				year: 2002
			});
			expect((schema.validate(dateBiggerMinute) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectBiggerSecond(schema: DateSchema<Date, any>) {
			const dateBiggerSecond = createDate({
				day: 1,
				hour: 10,
				minute: 10,
				month: 3,
				second: 11,
				year: 2002
			});
			expect((schema.validate(dateBiggerSecond) as SchemaError[]).length === 0)
			.toBeTruthy();
		}

		function expectSame(date: Date, schema: DateSchema<Date, any>) {
			expect((schema.validate(date) as SchemaError[]).length === 0)
			.toBeFalsy();
		}

		it('test', () => {
			const schema = object({
				maxDate: date().minDate((parent) => parent.minDate),
				minDate: date().maxDate((parent) => parent.maxDate)
			}).compile();

			expect((
				schema
				.validate({ 
					maxDate: new Date(2001, 1, 2, 0, 0, 0, 0), 
					minDate: new Date(2001, 1, 1, 0, 0, 0, 0)
				}) as SchemaError[]).length === 0
			).toBeTruthy();

			expect((
				schema
				.validate({ 
					maxDate: new Date(2001, 1, 2, 0, 0, 0, 0), 
					minDate: new Date(2001, 1, 3, 0, 0, 0, 0)
				}) as SchemaError[]).length === 0
			).toBeFalsy();
		});

		it('only on year', () => {
			const maxDate = createDate({
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'year')
			.compile();

			expectSmallerYear(schema);

			expectSame(maxDate, schema);
		});

		it('only on month', () => {
			const maxDate = createDate({
				month: 5,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'month')
			.compile();

			expectSmallerYear(schema);

			expectBiggerMonth(schema);

			expectSame(maxDate, schema);
		});

		it('only on date', () => {
			const maxDate = createDate({
				day: 2,
				month: 5,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'date')
			.compile();

			expectSmallerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectSame(maxDate, schema);
		});

		it('only on hour', () => {
			const maxDate = createDate({
				day: 2,
				hour: 20,
				month: 5,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'hour')
			.compile();

			expectSmallerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectSame(maxDate, schema);
		});

		it('only on minute', () => {
			const maxDate = createDate({
				day: 2,
				hour: 20,
				minute: 20,
				month: 5,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'minute')
			.compile();

			expectSmallerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectBiggerMinute(schema);

			expectSame(maxDate, schema);
		});

		it('only on seconds', () => {
			const maxDate = createDate({
				day: 2,
				hour: 20,
				minute: 20,
				month: 5,
				second: 20,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'second')
			.compile();

			expectSmallerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectBiggerMinute(schema);

			expectBiggerSecond(schema);

			expectSame(maxDate, schema);
		});

		it('only on date time', () => {
			const maxDate = createDate({
				day: 2,
				hour: 20,
				millisecond: 20,
				minute: 20,
				month: 5,
				second: 20,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'dateTime')
			.compile();

			expectSmallerYear(schema);

			expectBiggerMonth(schema);

			expectBiggerDate(schema);

			expectBiggerHour(schema);

			expectBiggerMinute(schema);

			expectBiggerSecond(schema);

			const dateBiggerMillisecond = createDate({
				day: 1,
				hour: 10,
				millisecond: 11,
				minute: 10,
				month: 3,
				second: 10,
				year: 2002
			});
			expect((schema.validate(dateBiggerMillisecond) as SchemaError[]).length === 0)
			.toBeTruthy();

			expectSame(maxDate, schema);
		});

		it('only on time', () => {
			const maxDate = createDate({
				day: 2,
				hour: 20,
				millisecond: 20,
				minute: 20,
				month: 5,
				second: 20,
				year: 2002
			});

			const schema = date()
			.maxDate(maxDate, 'time')
			.compile();

			const dateBiggerYearSameTime = createDate({
				day: 2,
				hour: 10,
				millisecond: 10,
				minute: 10,
				month: 3,
				second: 10,
				year: 2002
			});
			expect((schema.validate(dateBiggerYearSameTime) as SchemaError[]).length === 0)
			.toBeTruthy();

			const dateSameTimeAndDate = createDate({
				day: 2,
				hour: 20,
				millisecond: 20,
				minute: 20,
				month: 5,
				second: 20,
				year: 2002
			});
			expect((schema.validate(dateSameTimeAndDate) as SchemaError[]).length === 0)
			.toBeFalsy();
		});
	});
});
