export function createDate({
	day = 1, hour = 0, millisecond = 0,
	minute = 0, month = 1, second = 0, year = 0
}: {
	day?: number
	hour?: number
	millisecond?: number
	minute?: number
	month?: number
	second?: number
	year?: number
}) {
	return new Date(
		year,
		month,
		day,
		hour,
		minute,
		second,
		millisecond
	);
}
