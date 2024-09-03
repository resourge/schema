export enum Parameters {
	ERRORS_KEY = 't',
	PROMISE_KEY = 'p',
	CONTEXT_KEY = 'k',
	ONLY_ON_TOUCH = 's',
	OBJECT_KEY = 'a',

	VALUE = 'e'
}

let oneOfFunctionIndex = 0;
export function createOneOfFunctionName() {
	return `${Parameters.ERRORS_KEY}_one_of_${oneOfFunctionIndex++}`;
}

export function createDate({
	year, month, day,
	hour, minute, second, millisecond
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
		year ?? 0, 
		month ?? 1, 
		day ?? 1,
		hour ?? 0, 
		minute ?? 0, 
		second ?? 0, 
		millisecond ?? 0
	);
}
