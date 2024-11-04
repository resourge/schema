import { IS_DEV } from './constants';

export const PARAMETERS = {
	ERRORS_KEY: IS_DEV ? 'errors' : 'e',
	PROMISE_KEY: IS_DEV ? 'promises' : 'p',
	CONTEXT_KEY: IS_DEV ? 'context' : 'c',
	ONLY_ON_TOUCH: IS_DEV ? 'onlyOnTouch' : 'o',
	OBJECT_KEY: IS_DEV ? 'form' : 'f',
	VALUE: IS_DEV ? 'value' : 'v',
	FN_CONTEXT: IS_DEV ? 'getContext' : 'gC',
	FN_GET_ERROR: IS_DEV ? 'getError' : 'gE',
	FN_TEST: IS_DEV ? 'test' : 't',
	FN_ASYNC_TEST: IS_DEV ? 'async_test' : 'at',
	ONE_OF: IS_DEV ? 'one_of' : 'oo'
} as const;

let oneOfFunctionIndex = 0;
export function createOneOfFunctionName() {
	return `${PARAMETERS.ONE_OF}${oneOfFunctionIndex++}`;
}

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
