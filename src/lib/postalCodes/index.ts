export type PostalCodeInfo = {
	format: string
	regex: RegExp
};
export const AD: PostalCodeInfo = {
	format: 'AD###',
	regex: /^(?:AD)*(\d{3})$/i
};
export const AL: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const AM: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const AR: PostalCodeInfo = {
	format: '@####@@@',
	regex: /^[A-Z]?\d{4}[A-Z]{0,3}$/i
};
export const AS: PostalCodeInfo = {
	format: '#####-####',
	regex: /96799/i
};
export const AT: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const AU: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const AX: PostalCodeInfo = {
	format: '#####',
	regex: /^(?:FI)*(\d{5})$/i
};
export const AZ: PostalCodeInfo = {
	format: 'AZ ####',
	regex: /^(?:AZ)*(\d{4})$/i
};
export const BA: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const BB: PostalCodeInfo = {
	format: 'BB#####',
	regex: /^(?:BB)*(\d{5})$/i
};
export const BD: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const BE: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const BG: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const BH: PostalCodeInfo = {
	format: '####|###',
	regex: /^(\d{3}\d?)$/i
};
export const BL: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const BM: PostalCodeInfo = {
	format: '@@ ##',
	regex: /^([A-Z]{2}\d{2})$/i
};
export const BN: PostalCodeInfo = {
	format: '@@####',
	regex: /^([A-Z]{2}\d{4})$/i
};
export const BR: PostalCodeInfo = {
	format: '#####-###',
	regex: /^\d{5}-\d{3}$/i
};
export const BY: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const CA: PostalCodeInfo = {
	format: '@#@ #@#',
	regex: /^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]) ?(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/i
};
export const CH: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const CL: PostalCodeInfo = {
	format: '#######',
	regex: /^(\d{7})$/i
};
export const CN: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const CO: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const CR: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const CS: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const CU: PostalCodeInfo = {
	format: 'CP #####',
	regex: /^(?:CP)*(\d{5})$/i
};
export const CV: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const CX: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const CY: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const CZ: PostalCodeInfo = {
	format: '### ##',
	regex: /^\d{3}\s?\d{2}$/i
};
export const DE: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const DK: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const DO: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const DZ: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const EC: PostalCodeInfo = {
	format: '@####@',
	regex: /^([a-zA-Z]\d{4}[a-zA-Z])$/i
};
export const EE: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const EG: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const ES: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const ET: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const FI: PostalCodeInfo = {
	format: '#####',
	regex: /^(?:FI)*(\d{5})$/i
};
export const FM: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const FO: PostalCodeInfo = {
	format: '###',
	regex: /^(?:FO)*(\d{3})$/i
};
export const FR: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const GB: PostalCodeInfo = {
	format: '@# #@@|@## #@@|@@# #@@|@@## #@@|@#@ #@@|@@#@ #@@|GIR0AA',
	regex: /^([Gg][Ii][Rr]\\s?0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\\s?[0-9][A-Za-z]{2})$/i
};
export const GE: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const GF: PostalCodeInfo = {
	format: '#####',
	regex: /^((97|98)3\d{2})$/i
};
export const GG: PostalCodeInfo = {
	format: '@# #@@|@## #@@|@@# #@@|@@## #@@|@#@ #@@|@@#@ #@@|GIR0AA',
	regex: /^((?:(?:[A-PR-UWYZ][A-HK-Y]\\d[ABEHMNPRV-Y0-9]|[A-PR-UWYZ]\\d[A-HJKPS-UW0-9])\\s\\d[ABD-HJLNP-UW-Z]{2})|GIR\\s?0AA)$/i
};
export const GL: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const GP: PostalCodeInfo = {
	format: '#####',
	regex: /^((97|98)\d{3})$/i
};
export const GR: PostalCodeInfo = {
	format: '### ##',
	regex: /^(\d{5})$/i
};
export const GT: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const GU: PostalCodeInfo = {
	format: '969##',
	regex: /^(969\d{2})$/i
};
export const GW: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const HN: PostalCodeInfo = {
	format: '@@####',
	regex: /^([A-Z]{2}\d{4})$/i
};
export const HR: PostalCodeInfo = {
	format: '#####',
	regex: /^(?:HR)*(\d{5})$/i
};
export const HT: PostalCodeInfo = {
	format: 'HT####',
	regex: /^(?:HT)*(\d{4})$/i
};
export const HU: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const ID: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const IE: PostalCodeInfo = {
	format: '@@@ @@@@',
	regex: /^(D6W|[AC-FHKNPRTV-Y][0-9]{2})\s?([AC-FHKNPRTV-Y0-9]{4})/i
};
export const IL: PostalCodeInfo = {
	format: '#######',
	regex: /^(\d{7}|\d{5})$/i
};
export const IM: PostalCodeInfo = {
	format: '@# #@@|@## #@@|@@# #@@|@@## #@@|@#@ #@@|@@#@ #@@|GIR0AA',
	regex: /^((?:(?:[A-PR-UWYZ][A-HK-Y]\\d[ABEHMNPRV-Y0-9]|[A-PR-UWYZ]\\d[A-HJKPS-UW0-9])\\s\\d[ABD-HJLNP-UW-Z]{2})|GIR\\s?0AA)$/i
};
export const IN: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const IQ: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const IR: PostalCodeInfo = {
	format: '##########',
	regex: /^(\d{10})$/i
};
export const IS: PostalCodeInfo = {
	format: '###',
	regex: /^(\d{3})$/i
};
export const IT: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const JE: PostalCodeInfo = {
	format: '@# #@@|@## #@@|@@# #@@|@@## #@@|@#@ #@@|@@#@ #@@|GIR0AA',
	regex: /^((?:(?:[A-PR-UWYZ][A-HK-Y]\\d[ABEHMNPRV-Y0-9]|[A-PR-UWYZ]\\d[A-HJKPS-UW0-9])\\s\\d[ABD-HJLNP-UW-Z]{2})|GIR\\s?0AA)$/i
};
export const JO: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const JP: PostalCodeInfo = {
	format: '###-####',
	regex: /^\d{3}-\d{4}$/i
};
export const KE: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const KG: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const KH: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const KP: PostalCodeInfo = {
	format: '###-###',
	regex: /^(\d{6})$/i
};
export const KR: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const KW: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const KZ: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const LA: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const LB: PostalCodeInfo = {
	format: '#### ####|####',
	regex: /^(\d{4}(\d{4})?)$/i
};
export const LI: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const LK: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const LR: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const LS: PostalCodeInfo = {
	format: '###',
	regex: /^(\d{3})$/i
};
export const LT: PostalCodeInfo = {
	format: 'LT-#####',
	regex: /^(?:LT)*(\d{5})$/i
};
export const LU: PostalCodeInfo = {
	format: 'L-####',
	regex: /^(?:L-)?\d{4}$/i
};
export const LV: PostalCodeInfo = {
	format: 'LV-####',
	regex: /^(?:LV)*(\d{4})$/i
};
export const MA: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MC: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MD: PostalCodeInfo = {
	format: 'MD-####',
	regex: /^MD-\d{4}$/i
};
export const ME: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MF: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MG: PostalCodeInfo = {
	format: '###',
	regex: /^(\d{3})$/i
};
export const MH: PostalCodeInfo = {
	format: '#####-####',
	regex: /^969\d{2}(-\d{4})$/i
};
export const MK: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const MM: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MN: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const MP: PostalCodeInfo = {
	format: '#####',
	regex: /^9695\d{1}$/i
};
export const MQ: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MT: PostalCodeInfo = {
	format: '@@@ ####',
	regex: /^[A-Z]{3}\s?\d{4}$/i
};
export const MV: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MW: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const MX: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MY: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const MZ: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const NC: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const NE: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const NF: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const NG: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const NI: PostalCodeInfo = {
	format: '###-###-#',
	regex: /^(\d{7})$/i
};
export const NL: PostalCodeInfo = {
	format: '#### @@',
	regex: /^(\d{4}\s?[a-zA-Z]{2})$/i
};
export const NO: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const NP: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const NZ: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const OM: PostalCodeInfo = {
	format: '###',
	regex: /^(\d{3})$/i
};
export const PF: PostalCodeInfo = {
	format: '#####',
	regex: /^((97|98)7\d{2})$/i
};
export const PG: PostalCodeInfo = {
	format: '###',
	regex: /^(\d{3})$/i
};
export const PH: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const PK: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const PL: PostalCodeInfo = {
	format: '##-###',
	regex: /^\d{2}-\d{3}$/i
};
export const PM: PostalCodeInfo = {
	format: '#####',
	regex: /^(97500)$/i
};
export const PR: PostalCodeInfo = {
	format: '#####-####',
	regex: /^00[679]\d{2}(?:-\d{4})?$/i
};
export const PT: PostalCodeInfo = {
	format: '####-###',
	regex: /^\d{4}-\d{3}\s?[a-zA-Z]{0,25}$/i
};
export const PW: PostalCodeInfo = {
	format: '96940',
	regex: /^(96940)$/i
};
export const PY: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const RE: PostalCodeInfo = {
	format: '#####',
	regex: /^((97|98)(4|7|8)\d{2})$/i
};
export const RO: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const RS: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const RU: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const SA: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const SD: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const SE: PostalCodeInfo = {
	format: '### ##',
	regex: /^(?:SE)?\d{3}\s\d{2}$/i
};
export const SG: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const SH: PostalCodeInfo = {
	format: 'STHL 1ZZ',
	regex: /^(STHL1ZZ)$/i
};
export const SI: PostalCodeInfo = {
	format: '####',
	regex: /^(?:SI)*(\d{4})$/i
};
export const SJ: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const SK: PostalCodeInfo = {
	format: '### ##',
	regex: /^\d{3}\s?\d{2}$/i
};
export const SM: PostalCodeInfo = {
	format: '4789#',
	regex: /^(4789\d)$/i
};
export const SN: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const SO: PostalCodeInfo = {
	format: '@@  #####',
	regex: /^([A-Z]{2}\d{5})$/i
};
export const SV: PostalCodeInfo = {
	format: 'CP ####',
	regex: /^(?:CP)*(\d{4})$/i
};
export const SZ: PostalCodeInfo = {
	format: '@###',
	regex: /^([A-Z]\d{3})$/i
};
export const TC: PostalCodeInfo = {
	format: 'TKCA 1ZZ',
	regex: /^(TKCA 1ZZ)$/i
};
export const TH: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const TJ: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const TM: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const TN: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const TR: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const TW: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const UA: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const US: PostalCodeInfo = {
	format: '#####-####',
	regex: /^\d{5}(-\d{4})?$/i
};
export const UY: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const UZ: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const VA: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const VE: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const VI: PostalCodeInfo = {
	format: '#####-####',
	regex: /^008\d{2}(?:-\d{4})?$/i
};
export const VN: PostalCodeInfo = {
	format: '######',
	regex: /^(\d{6})$/i
};
export const WF: PostalCodeInfo = {
	format: '#####',
	regex: /^(986\d{2})$/i
};
export const YT: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const ZA: PostalCodeInfo = {
	format: '####',
	regex: /^(\d{4})$/i
};
export const ZM: PostalCodeInfo = {
	format: '#####',
	regex: /^(\d{5})$/i
};
export const PostalCodes = {
	AD: AD,
	AL: AL,
	AM: AM,
	AR: AR,
	AS: AS,
	AT: AT,
	AU: AU,
	AX: AX,
	AZ: AZ,
	BA: BA,
	BB: BB,
	BD: BD,
	BE: BE,
	BG: BG,
	BH: BH,
	BL: BL,
	BM: BM,
	BN: BN,
	BR: BR,
	BY: BY,
	CA: CA,
	CH: CH,
	CL: CL,
	CN: CN,
	CO: CO,
	CR: CR,
	CS: CS,
	CU: CU,
	CV: CV,
	CX: CX,
	CY: CY,
	CZ: CZ,
	DE: DE,
	DK: DK,
	DO: DO,
	DZ: DZ,
	EC: EC,
	EE: EE,
	EG: EG,
	ES: ES,
	ET: ET,
	FI: FI,
	FM: FM,
	FO: FO,
	FR: FR,
	GB: GB,
	GE: GE,
	GF: GF,
	GG: GG,
	GL: GL,
	GP: GP,
	GR: GR,
	GT: GT,
	GU: GU,
	GW: GW,
	HN: HN,
	HR: HR,
	HT: HT,
	HU: HU,
	ID: ID,
	IE: IE,
	IL: IL,
	IM: IM,
	IN: IN,
	IQ: IQ,
	IR: IR,
	IS: IS,
	IT: IT,
	JE: JE,
	JO: JO,
	JP: JP,
	KE: KE,
	KG: KG,
	KH: KH,
	KP: KP,
	KR: KR,
	KW: KW,
	KZ: KZ,
	LA: LA,
	LB: LB,
	LI: LI,
	LK: LK,
	LR: LR,
	LS: LS,
	LT: LT,
	LU: LU,
	LV: LV,
	MA: MA,
	MC: MC,
	MD: MD,
	ME: ME,
	MF: MF,
	MG: MG,
	MH: MH,
	MK: MK,
	MM: MM,
	MN: MN,
	MP: MP,
	MQ: MQ,
	MT: MT,
	MV: MV,
	MW: MW,
	MX: MX,
	MY: MY,
	MZ: MZ,
	NC: NC,
	NE: NE,
	NF: NF,
	NG: NG,
	NI: NI,
	NL: NL,
	NO: NO,
	NP: NP,
	NZ: NZ,
	OM: OM,
	PF: PF,
	PG: PG,
	PH: PH,
	PK: PK,
	PL: PL,
	PM: PM,
	PR: PR,
	PT: PT,
	PW: PW,
	PY: PY,
	RE: RE,
	RO: RO,
	RS: RS,
	RU: RU,
	SA: SA,
	SD: SD,
	SE: SE,
	SG: SG,
	SH: SH,
	SI: SI,
	SJ: SJ,
	SK: SK,
	SM: SM,
	SN: SN,
	SO: SO,
	SV: SV,
	SZ: SZ,
	TC: TC,
	TH: TH,
	TJ: TJ,
	TM: TM,
	TN: TN,
	TR: TR,
	TW: TW,
	UA: UA,
	US: US,
	UY: UY,
	UZ: UZ,
	VA: VA,
	VE: VE,
	VI: VI,
	VN: VN,
	WF: WF,
	YT: YT,
	ZA: ZA,
	ZM: ZM
} as const;

export type PostalCode = typeof PostalCodes;
