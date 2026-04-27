import { expect, it } from 'vitest';

import PostalCodes from '../index';
import * as PostalCodesRest from '../index';

const postalCodesExamples = {
	AD: {
		invalid: 'A1234',
		valid: 'AD123' 
	},
	AF: {
		invalid: '12345',
		valid: '1234' 
	},
	AI: {
		invalid: 'A2640',
		valid: 'AI2640' 
	},
	AL: {
		invalid: '12345',
		valid: '1234' 
	},
	AM: {
		invalid: '12345',
		valid: '1234' 
	},
	AQ: {
		invalid: 'BIQQ1Z',
		valid: 'BIQQ 1ZZ' 
	},
	AR: {
		invalid: '12345',
		valid: '1234' 
	},
	AS: {
		invalid: '123456',
		valid: '12345' 
	},
	AT: {
		invalid: '12345',
		valid: '1234' 
	},
	AU: {
		invalid: '12345',
		valid: '1234' 
	},
	AX: {
		invalid: 'AX123',
		valid: '12345' 
	},
	AZ: {
		invalid: 'AZ123',
		valid: 'AZ1234' 
	},
	BA: {
		invalid: '123456',
		valid: '12345' 
	},
	BB: {
		invalid: 'x1231s',
		valid: 'BB12345' 
	},
	BD: {
		invalid: '12345',
		valid: '1234' 
	},
	BE: {
		invalid: '12345',
		valid: '1234' 
	},
	BG: {
		invalid: '12345',
		valid: '1234' 
	},
	BH: {
		invalid: '12',
		valid: '123' 
	},
	BL: {
		invalid: '971330',
		valid: '97133' 
	},
	BN: {
		invalid: 'abc123',
		valid: 'AB1234' 
	},
	BO: {
		invalid: '12345',
		valid: '1234' 
	},
	BR: {
		invalid: '123345456',
		valid: '12345678' 
	},
	BT: {
		invalid: '123456',
		valid: '12345' 
	},
	BY: {
		invalid: '1233456',
		valid: '123456' 
	},
	CA: {
		invalid: '123AAA',
		valid: 'A4B5X5' 
	},
	CC: {
		invalid: '12345',
		valid: '1234' 
	},
	CH: {
		invalid: '12345',
		valid: '1234' 
	},
	CL: {
		invalid: '123345456',
		valid: '1234567' 
	},
	CN: {
		invalid: '1233456',
		valid: '123456' 
	},
	CO: {
		invalid: '1233456',
		valid: '123456' 
	},
	CR: {
		invalid: '123456',
		valid: '12345' 
	},
	CU: {
		invalid: '123456',
		valid: '12345' 
	},
	CV: {
		invalid: '12345',
		valid: '1234' 
	},
	CX: {
		invalid: '12345',
		valid: '1234' 
	},
	CY: {
		invalid: '12345',
		valid: '1234' 
	},
	CZ: {
		invalid: '123456',
		valid: '12345' 
	},
	DE: {
		invalid: '123456',
		valid: '12345' 
	},
	DK: {
		invalid: '1125DK',
		valid: '1124' 
	},
	DO: {
		invalid: '123456',
		valid: '12345' 
	},
	DZ: {
		invalid: '123456',
		valid: '12345' 
	},
	EC: {
		invalid: '1233456',
		valid: '123456' 
	},
	EE: {
		invalid: '123456',
		valid: '12345' 
	},
	EG: {
		invalid: '123456',
		valid: '12345' 
	},
	ES: {
		invalid: '123456',
		valid: '12345' 
	},
	ET: {
		invalid: '12345',
		valid: '1234' 
	},
	FI: {
		invalid: '123456',
		valid: '12345' 
	},
	FK: {
		invalid: 'FIQQ01ZZ',
		valid: 'FIQQ 1ZZ' 
	},
	FM: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	FO: {
		invalid: '1234',
		valid: '123' 
	},
	FR: {
		invalid: '123456',
		valid: '12345' 
	},
	GB: {
		invalid: 'WC2H 7LTa',
		valid: 'CW3 9SS' 
	},
	GE: {
		invalid: '12345',
		valid: '1234' 
	},
	GF: {
		invalid: '9732',
		valid: '97300' 
	},
	GG: {
		invalid: 'CW3 9SS',
		valid: 'GY1 1AA' 
	},
	GI: {
		invalid: 'GX1101AA',
		valid: 'GX111AA' 
	},
	GL: {
		invalid: '12345',
		valid: '1234' 
	},
	GN: {
		invalid: '1234',
		valid: '123' 
	},
	GP: {
		invalid: '9712',
		valid: '97100' 
	},
	GR: {
		invalid: '123456',
		valid: '12345' 
	},
	GS: {
		invalid: 'SIQQ01ZZ',
		valid: 'SIQQ 1ZZ' 
	},
	GT: {
		invalid: '123456',
		valid: '12345' 
	},
	GU: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	GW: {
		invalid: '12345',
		valid: '1234' 
	},
	HM: {
		invalid: '12345',
		valid: '1234' 
	},
	HN: {
		invalid: '123456',
		valid: 'HN12345' 
	},
	HR: {
		invalid: '123456',
		valid: '12345' 
	},
	HT: {
		invalid: '12345',
		valid: '1234' 
	},
	HU: {
		invalid: '12345',
		valid: '1234' 
	},
	IC: {
		invalid: '123456',
		valid: '12345' 
	},
	ID: {
		invalid: '123456',
		valid: '12345' 
	},
	IE: {
		invalid: 'D6Z1234',
		valid: 'D6W1234' 
	},
	IL: {
		invalid: '123345456',
		valid: '1234567' 
	},
	IM: {
		invalid: 'CW3 9SS',
		valid: 'IM1 1AA' 
	},
	IN: {
		invalid: '1233456',
		valid: '123456' 
	},
	IO: {
		invalid: 'BBND01ZZ',
		valid: 'BBND 1ZZ' 
	},
	IQ: {
		invalid: '123456',
		valid: '12345' 
	},
	IR: {
		invalid: '12334545698',
		valid: '1234567890' 
	},
	IS: {
		invalid: '1234',
		valid: '123' 
	},
	IT: {
		invalid: '123456',
		valid: '12345' 
	},
	JE: {
		invalid: 'CW3 9SS',
		valid: 'JE1 1AA' 
	},
	JM: {
		invalid: '012',
		valid: '12' 
	},
	JO: {
		invalid: '123456',
		valid: '12345' 
	},
	JP: {
		invalid: '123345456',
		valid: '1234567' 
	},
	KE: {
		invalid: '123456',
		valid: '12345' 
	},
	KG: {
		invalid: '1233456',
		valid: '123456' 
	},
	KH: {
		invalid: '123456',
		valid: '12345' 
	},
	KR: {
		invalid: '123456',
		valid: '12345' 
	},
	KW: {
		invalid: '123456',
		valid: '12345' 
	},
	KY: {
		invalid: 'KY1234',
		valid: 'KY1-1234' 
	},
	KZ: {
		invalid: '1233456',
		valid: '123456' 
	},
	LA: {
		invalid: '123456',
		valid: '12345' 
	},
	LB: {
		invalid: '123',
		valid: '1234' 
	},
	LC: {
		invalid: '12345',
		valid: 'LC12 345' 
	},
	LI: {
		invalid: '12345',
		valid: '1234' 
	},
	LK: {
		invalid: '123456',
		valid: '12345' 
	},
	LR: {
		invalid: '12345',
		valid: '1234' 
	},
	LS: {
		invalid: '1234',
		valid: '123' 
	},
	LT: {
		invalid: '1234',
		valid: '12345' 
	},
	LU: {
		invalid: '1125L',
		valid: '1124' 
	},
	LV: {
		invalid: 'LV123',
		valid: '1234' 
	},
	LY: {
		invalid: '123456',
		valid: '12345' 
	},
	MA: {
		invalid: '123456',
		valid: '12345' 
	},
	MC: {
		invalid: '98100',
		valid: '98000' 
	},
	MD: {
		invalid: 'MD123',
		valid: '1234' 
	},
	ME: {
		invalid: '123456',
		valid: '12345' 
	},
	MF: {
		invalid: '971500',
		valid: '97150' 
	},
	MG: {
		invalid: '1234',
		valid: '123' 
	},
	MH: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	MK: {
		invalid: '12345',
		valid: '1234' 
	},
	MM: {
		invalid: '123456',
		valid: '12345' 
	},
	MN: {
		invalid: '123456',
		valid: '12345' 
	},
	MP: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	MQ: {
		invalid: '123456',
		valid: '12345' 
	},
	MS: {
		invalid: 'MS1110',
		valid: 'MSR1110' 
	},
	MT: {
		invalid: 'ABCABC',
		valid: 'abc1234' 
	},
	MU: {
		invalid: '123456',
		valid: '12345' 
	},
	MV: {
		invalid: '123456',
		valid: '12345' 
	},
	MX: {
		invalid: '123456',
		valid: '12345' 
	},
	MY: {
		invalid: '123456',
		valid: '12345' 
	},
	MZ: {
		invalid: '12345',
		valid: '1234' 
	},
	NA: {
		invalid: '123456',
		valid: '12345' 
	},
	NC: {
		invalid: '9882',
		valid: '98800' 
	},
	NE: {
		invalid: '12345',
		valid: '1234' 
	},
	NF: {
		invalid: '12345',
		valid: '1234' 
	},
	NG: {
		invalid: '1233456',
		valid: '123456' 
	},
	NI: {
		invalid: '123456',
		valid: '12345' 
	},
	NL: {
		invalid: '1235D',
		valid: '1235DF' 
	},
	NO: {
		invalid: '12345',
		valid: '1234' 
	},
	NP: {
		invalid: '123456',
		valid: '12345' 
	},
	NZ: {
		invalid: '12345',
		valid: '1234' 
	},
	OM: {
		invalid: '1234',
		valid: '123' 
	},
	PA: {
		invalid: '12345',
		valid: '1234' 
	},
	PE: {
		invalid: '123456',
		valid: '12345' 
	},
	PF: {
		invalid: '9872',
		valid: '98700' 
	},
	PG: {
		invalid: '1234',
		valid: '123' 
	},
	PH: {
		invalid: '12345',
		valid: '1234' 
	},
	PK: {
		invalid: '123456',
		valid: '12345' 
	},
	PL: {
		invalid: '44100',
		valid: '44-100' 
	},
	PM: {
		invalid: '975000',
		valid: '97500' 
	},
	PN: {
		invalid: 'PCRN01ZZ',
		valid: 'PCR9 1ZZ' 
	},
	PR: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	PS: {
		invalid: '1234',
		valid: '123' 
	},
	PT: {
		invalid: '1255',
		valid: '1234-123' 
	},
	PW: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	PY: {
		invalid: '12345',
		valid: '1234' 
	},
	RE: {
		invalid: '9742',
		valid: '97400' 
	},
	RO: {
		invalid: '1233456',
		valid: '123456' 
	},
	RS: {
		invalid: '123456',
		valid: '12345' 
	},
	RU: {
		invalid: 'x1231s',
		valid: '125' 
	},
	SA: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	SD: {
		invalid: '123456',
		valid: '12345' 
	},
	SE: {
		invalid: '123456',
		valid: '12345' 
	},
	SG: {
		invalid: '1233456',
		valid: '123456' 
	},
	SH: {
		invalid: 'STHL01ZZ',
		valid: 'STHL 1ZZ' 
	},
	SI: {
		invalid: '12345',
		valid: '1234' 
	},
	SJ: {
		invalid: '12345',
		valid: '1234' 
	},
	SK: {
		invalid: '123456',
		valid: '12345' 
	},
	SM: {
		invalid: '4789',
		valid: '47890' 
	},
	SN: {
		invalid: '123456',
		valid: '12345' 
	},
	SO: {
		invalid: '12345',
		valid: 'AW12345' 
	},
	SV: {
		invalid: '12345',
		valid: '1234' 
	},
	SZ: {
		invalid: 'F1234',
		valid: 'S123' 
	},
	TC: {
		invalid: 'TKCA01ZZ',
		valid: 'TKCA1ZZ' 
	},
	TD: {
		invalid: '123456',
		valid: '12345' 
	},
	TH: {
		invalid: '123456',
		valid: '12345' 
	},
	TJ: {
		invalid: '1233456',
		valid: '123456' 
	},
	TM: {
		invalid: '1233456',
		valid: '123456' 
	},
	TN: {
		invalid: '12345',
		valid: '1234' 
	},
	TR: {
		invalid: '123456',
		valid: '12345' 
	},
	TT: {
		invalid: '1233456',
		valid: '123456' 
	},
	TW: {
		invalid: '12',
		valid: '123' 
	},
	TZ: {
		invalid: '123456',
		valid: '12345' 
	},
	UA: {
		invalid: '123456',
		valid: '12345' 
	},
	US: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	UY: {
		invalid: '123456',
		valid: '12345' 
	},
	UZ: {
		invalid: '1233456',
		valid: '123456' 
	},
	VA: {
		invalid: '0012',
		valid: '00120' 
	},
	VC: {
		invalid: 'VC123',
		valid: '1234' 
	},
	VE: {
		invalid: '123',
		valid: '1234' 
	},
	VG: {
		invalid: 'VG123',
		valid: '1234' 
	},
	VI: {
		invalid: 'x1231s',
		valid: '12345' 
	},
	VN: {
		invalid: '1233456',
		valid: '123456' 
	},
	WF: {
		invalid: '9862',
		valid: '98600' 
	},
	WS: {
		invalid: 'WS123',
		valid: '1234' 
	},
	YT: {
		invalid: '123456',
		valid: '12345' 
	},
	ZA: {
		invalid: '12345',
		valid: '1234' 
	},
	ZM: {
		invalid: '123456',
		valid: '12345' 
	}
} as const;

it('postalCodes object', () => {
	Object.entries(PostalCodes)
	.forEach(([key, data]) => {
		const postalCode = postalCodesExamples[key as keyof typeof PostalCodes];

		expect(data.regex.test(postalCode.valid))
		.toBeTruthy();
		expect(data.regex.test(postalCode.invalid))
		.toBeFalsy();
	});
});

it('postalCodes singular const\'s', () => {
	Object.entries(postalCodesExamples)
	.forEach(([key, { invalid, valid }]) => {
		const postalCode = PostalCodesRest[key as keyof typeof PostalCodes];

		expect(postalCode.regex.test(valid))
		.toBeTruthy();
		expect(postalCode.regex.test(invalid))
		.toBeFalsy();
	});
});
