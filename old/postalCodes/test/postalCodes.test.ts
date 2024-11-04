import PostalCodes from '../index';
import * as PostalCodesRest from '../index';

const postalCodesExamples = {
	AF: {
		valid: '1234',
		invalid: '12345' 
	},
	AX: {
		valid: '12345',
		invalid: 'AX123' 
	},
	AL: {
		valid: '1234',
		invalid: '12345' 
	},
	DZ: {
		valid: '12345',
		invalid: '123456' 
	},
	AS: {
		valid: '12345',
		invalid: '123456' 
	},
	AD: {
		valid: 'AD123',
		invalid: 'A1234' 
	},
	AI: {
		valid: 'AI2640',
		invalid: 'A2640' 
	},
	AQ: {
		valid: 'BIQQ 1ZZ',
		invalid: 'BIQQ1Z' 
	},
	AR: {
		valid: '1234',
		invalid: '12345' 
	},
	AM: {
		valid: '1234',
		invalid: '12345' 
	},
	AU: {
		valid: '1234',
		invalid: '12345' 
	},
	AT: {
		valid: '1234',
		invalid: '12345' 
	},
	AZ: {
		valid: 'AZ1234',
		invalid: 'AZ123' 
	},
	BH: {
		valid: '123',
		invalid: '12' 
	},
	BD: {
		valid: '1234',
		invalid: '12345' 
	},
	BB: {
		valid: 'BB12345',
		invalid: 'x1231s' 
	},
	BY: {
		valid: '123456',
		invalid: '1233456' 
	},
	BE: {
		valid: '1234',
		invalid: '12345' 
	},
	BT: {
		valid: '12345',
		invalid: '123456' 
	},
	BO: {
		valid: '1234',
		invalid: '12345' 
	},
	BA: {
		valid: '12345',
		invalid: '123456' 
	},
	BR: {
		valid: '12345678',
		invalid: '123345456' 
	},
	VG: {
		valid: '1234',
		invalid: 'VG123' 
	},
	IO: {
		valid: 'BBND 1ZZ',
		invalid: 'BBND01ZZ' 
	},
	BN: {
		valid: 'AB1234',
		invalid: 'abc123' 
	},
	BG: {
		valid: '1234',
		invalid: '12345' 
	},
	KH: {
		valid: '12345',
		invalid: '123456' 
	},
	CA: {
		valid: 'A4B5X5',
		invalid: '123AAA' 
	},
	CV: {
		valid: '1234',
		invalid: '12345' 
	},
	KY: {
		valid: 'KY1-1234',
		invalid: 'KY1234' 
	},
	TD: {
		valid: '12345',
		invalid: '123456' 
	},
	CL: {
		valid: '1234567',
		invalid: '123345456' 
	},
	CN: {
		valid: '123456',
		invalid: '1233456' 
	},
	CX: {
		valid: '1234',
		invalid: '12345' 
	},
	CC: {
		valid: '1234',
		invalid: '12345' 
	},
	CO: {
		valid: '123456',
		invalid: '1233456' 
	},
	CR: {
		valid: '12345',
		invalid: '123456' 
	},
	HR: {
		valid: '12345',
		invalid: '123456' 
	},
	CU: {
		valid: '12345',
		invalid: '123456' 
	},
	CY: {
		valid: '1234',
		invalid: '12345' 
	},
	CZ: {
		valid: '12345',
		invalid: '123456' 
	},
	DK: {
		valid: '1124',
		invalid: '1125DK' 
	},
	DO: {
		valid: '12345',
		invalid: '123456' 
	},
	EC: {
		valid: '123456',
		invalid: '1233456' 
	},
	EG: {
		valid: '12345',
		invalid: '123456' 
	},
	SV: {
		valid: '1234',
		invalid: '12345' 
	},
	EE: {
		valid: '12345',
		invalid: '123456' 
	},
	ET: {
		valid: '1234',
		invalid: '12345' 
	},
	FK: {
		valid: 'FIQQ 1ZZ',
		invalid: 'FIQQ01ZZ' 
	},
	FO: {
		valid: '123',
		invalid: '1234' 
	},
	FI: {
		valid: '12345',
		invalid: '123456' 
	},
	FR: {
		valid: '12345',
		invalid: '123456' 
	},
	GF: {
		valid: '97300',
		invalid: '9732' 
	},
	PF: {
		valid: '98700',
		invalid: '9872' 
	},
	GE: {
		valid: '1234',
		invalid: '12345' 
	},
	DE: {
		valid: '12345',
		invalid: '123456' 
	},
	GI: {
		valid: 'GX111AA',
		invalid: 'GX1101AA' 
	},
	GR: {
		valid: '12345',
		invalid: '123456' 
	},
	GL: {
		valid: '1234',
		invalid: '12345' 
	},
	GP: {
		valid: '97100',
		invalid: '9712' 
	},
	GU: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	GT: {
		valid: '12345',
		invalid: '123456' 
	},
	GG: {
		valid: 'GY1 1AA',
		invalid: 'CW3 9SS' 
	},
	GN: {
		valid: '123',
		invalid: '1234' 
	},
	GW: {
		valid: '1234',
		invalid: '12345' 
	},
	HT: {
		valid: '1234',
		invalid: '12345' 
	},
	HM: {
		valid: '1234',
		invalid: '12345' 
	},
	VA: {
		valid: '00120',
		invalid: '0012' 
	},
	HN: {
		valid: 'HN12345',
		invalid: '123456' 
	},
	HU: {
		valid: '1234',
		invalid: '12345' 
	},
	IS: {
		valid: '123',
		invalid: '1234' 
	},
	IN: {
		valid: '123456',
		invalid: '1233456' 
	},
	IC: {
		valid: '12345',
		invalid: '123456' 
	},
	ID: {
		valid: '12345',
		invalid: '123456' 
	},
	IR: {
		valid: '1234567890',
		invalid: '12334545698' 
	},
	IQ: {
		valid: '12345',
		invalid: '123456' 
	},
	IE: {
		valid: 'D6W1234',
		invalid: 'D6Z1234' 
	},
	IM: {
		valid: 'IM1 1AA',
		invalid: 'CW3 9SS' 
	},
	IL: {
		valid: '1234567',
		invalid: '123345456' 
	},
	IT: {
		valid: '12345',
		invalid: '123456' 
	},
	JM: {
		valid: '12',
		invalid: '012' 
	},
	JP: {
		valid: '1234567',
		invalid: '123345456' 
	},
	JE: {
		valid: 'JE1 1AA',
		invalid: 'CW3 9SS' 
	},
	JO: {
		valid: '12345',
		invalid: '123456' 
	},
	KZ: {
		valid: '123456',
		invalid: '1233456' 
	},
	KE: {
		valid: '12345',
		invalid: '123456' 
	},
	KR: {
		valid: '12345',
		invalid: '123456' 
	},
	KW: {
		valid: '12345',
		invalid: '123456' 
	},
	KG: {
		valid: '123456',
		invalid: '1233456' 
	},
	LA: {
		valid: '12345',
		invalid: '123456' 
	},
	LV: {
		valid: '1234',
		invalid: 'LV123' 
	},
	LB: {
		valid: '1234',
		invalid: '123' 
	},
	LS: {
		valid: '123',
		invalid: '1234' 
	},
	LR: {
		valid: '1234',
		invalid: '12345' 
	},
	LY: {
		valid: '12345',
		invalid: '123456' 
	},
	LI: {
		valid: '1234',
		invalid: '12345' 
	},
	LT: {
		valid: '12345',
		invalid: '1234' 
	},
	LU: {
		valid: '1124',
		invalid: '1125L' 
	},
	MK: {
		valid: '1234',
		invalid: '12345' 
	},
	MG: {
		valid: '123',
		invalid: '1234' 
	},
	MY: {
		valid: '12345',
		invalid: '123456' 
	},
	MV: {
		valid: '12345',
		invalid: '123456' 
	},
	MT: {
		valid: 'abc1234',
		invalid: 'ABCABC' 
	},
	MH: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	MQ: {
		valid: '12345',
		invalid: '123456' 
	},
	MU: {
		valid: '12345',
		invalid: '123456' 
	},
	YT: {
		valid: '12345',
		invalid: '123456' 
	},
	MX: {
		valid: '12345',
		invalid: '123456' 
	},
	FM: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	MD: {
		valid: '1234',
		invalid: 'MD123' 
	},
	MC: {
		valid: '98000',
		invalid: '98100' 
	},
	MN: {
		valid: '12345',
		invalid: '123456' 
	},
	ME: {
		valid: '12345',
		invalid: '123456' 
	},
	MS: {
		valid: 'MSR1110',
		invalid: 'MS1110' 
	},
	MA: {
		valid: '12345',
		invalid: '123456' 
	},
	MZ: {
		valid: '1234',
		invalid: '12345' 
	},
	MM: {
		valid: '12345',
		invalid: '123456' 
	},
	NA: {
		valid: '12345',
		invalid: '123456' 
	},
	NP: {
		valid: '12345',
		invalid: '123456' 
	},
	NL: {
		valid: '1235DF',
		invalid: '1235D' 
	},
	NC: {
		valid: '98800',
		invalid: '9882' 
	},
	NZ: {
		valid: '1234',
		invalid: '12345' 
	},
	NI: {
		valid: '12345',
		invalid: '123456' 
	},
	NE: {
		valid: '1234',
		invalid: '12345' 
	},
	NG: {
		valid: '123456',
		invalid: '1233456' 
	},
	NF: {
		valid: '1234',
		invalid: '12345' 
	},
	MP: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	NO: {
		valid: '1234',
		invalid: '12345' 
	},
	OM: {
		valid: '123',
		invalid: '1234' 
	},
	PK: {
		valid: '12345',
		invalid: '123456' 
	},
	PW: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	PS: {
		valid: '123',
		invalid: '1234' 
	},
	PA: {
		valid: '1234',
		invalid: '12345' 
	},
	PG: {
		valid: '123',
		invalid: '1234' 
	},
	PY: {
		valid: '1234',
		invalid: '12345' 
	},
	PE: {
		valid: '12345',
		invalid: '123456' 
	},
	PH: {
		valid: '1234',
		invalid: '12345' 
	},
	PN: {
		valid: 'PCR9 1ZZ',
		invalid: 'PCRN01ZZ' 
	},
	PL: {
		valid: '44-100',
		invalid: '44100' 
	},
	PT: {
		valid: '1234-123',
		invalid: '1255' 
	},
	PR: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	RE: {
		valid: '97400',
		invalid: '9742' 
	},
	RO: {
		valid: '123456',
		invalid: '1233456' 
	},
	RU: {
		valid: '125',
		invalid: 'x1231s' 
	},
	BL: {
		valid: '97133',
		invalid: '971330' 
	},
	SH: {
		valid: 'STHL 1ZZ',
		invalid: 'STHL01ZZ' 
	},
	LC: {
		valid: 'LC12 345',
		invalid: '12345' 
	},
	MF: {
		valid: '97150',
		invalid: '971500' 
	},
	PM: {
		valid: '97500',
		invalid: '975000' 
	},
	VC: {
		valid: '1234',
		invalid: 'VC123' 
	},
	WS: {
		valid: '1234',
		invalid: 'WS123' 
	},
	SM: {
		valid: '47890',
		invalid: '4789' 
	},
	SA: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	SN: {
		valid: '12345',
		invalid: '123456' 
	},
	RS: {
		valid: '12345',
		invalid: '123456' 
	},
	SG: {
		valid: '123456',
		invalid: '1233456' 
	},
	SK: {
		valid: '12345',
		invalid: '123456' 
	},
	SI: {
		valid: '1234',
		invalid: '12345' 
	},
	SO: {
		valid: 'AW12345',
		invalid: '12345' 
	},
	ZA: {
		valid: '1234',
		invalid: '12345' 
	},
	GS: {
		valid: 'SIQQ 1ZZ',
		invalid: 'SIQQ01ZZ' 
	},
	ES: {
		valid: '12345',
		invalid: '123456' 
	},
	LK: {
		valid: '12345',
		invalid: '123456' 
	},
	SD: {
		valid: '12345',
		invalid: '123456' 
	},
	SJ: {
		valid: '1234',
		invalid: '12345' 
	},
	SZ: {
		valid: 'S123',
		invalid: 'F1234' 
	},
	SE: {
		valid: '12345',
		invalid: '123456' 
	},
	CH: {
		valid: '1234',
		invalid: '12345' 
	},
	TW: {
		valid: '123',
		invalid: '12' 
	},
	TJ: {
		valid: '123456',
		invalid: '1233456' 
	},
	TZ: {
		valid: '12345',
		invalid: '123456' 
	},
	TH: {
		valid: '12345',
		invalid: '123456' 
	},
	TT: {
		valid: '123456',
		invalid: '1233456' 
	},
	TN: {
		valid: '1234',
		invalid: '12345' 
	},
	TR: {
		valid: '12345',
		invalid: '123456' 
	},
	TM: {
		valid: '123456',
		invalid: '1233456' 
	},
	TC: {
		valid: 'TKCA1ZZ',
		invalid: 'TKCA01ZZ' 
	},
	UA: {
		valid: '12345',
		invalid: '123456' 
	},
	GB: {
		valid: 'CW3 9SS',
		invalid: 'WC2H 7LTa' 
	},
	US: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	UY: {
		valid: '12345',
		invalid: '123456' 
	},
	UZ: {
		valid: '123456',
		invalid: '1233456' 
	},
	VE: {
		valid: '1234',
		invalid: '123' 
	},
	VN: {
		valid: '123456',
		invalid: '1233456' 
	},
	VI: {
		valid: '12345',
		invalid: 'x1231s' 
	},
	WF: {
		valid: '98600',
		invalid: '9862' 
	},
	ZM: {
		valid: '12345',
		invalid: '123456' 
	}
} as const;

test('postalCodes object', () => {
	Object.entries(PostalCodes)
	.forEach(([key, data]) => {
		const postalCode = postalCodesExamples[key as keyof typeof PostalCodes];

		expect(data.regex.test(postalCode.valid))
		.toBeTruthy();
		expect(data.regex.test(postalCode.invalid))
		.toBeFalsy();
	});
});

test('postalCodes singular const\'s', () => {
	Object.entries(postalCodesExamples)
	.forEach(([key, { valid, invalid }]) => {
		const postalCode = PostalCodesRest[key as keyof typeof PostalCodes];

		expect(postalCode.regex.test(valid))
		.toBeTruthy();
		expect(postalCode.regex.test(invalid))
		.toBeFalsy();
	});
});
