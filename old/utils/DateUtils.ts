export function createDate({
	year = 0, month = 1, day = 1,
	hour = 0, minute = 0, second = 0, millisecond = 0
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
