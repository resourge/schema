/* eslint-disable no-useless-escape */
export type PostalCodeInfo = {
	country: string
	format: string
	regex: RegExp
};
export const AF: PostalCodeInfo = {
	country: 'Afghanistan',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const AX: PostalCodeInfo = {
	country: 'Aland Islands',
	format: '#####, AX-#####',
	regex: /^(AX)?[0-9]{5}$/i
};
export const AL: PostalCodeInfo = {
	country: 'Albania',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const DZ: PostalCodeInfo = {
	country: 'Algeria',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const AS: PostalCodeInfo = {
	country: 'American Samoa',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const AD: PostalCodeInfo = {
	country: 'Andorra',
	format: 'AD###',
	regex: /^AD[0-9]{3}$/i
};
export const AI: PostalCodeInfo = {
	country: 'Anguilla',
	format: 'AI2640',
	regex: /^AI2640$/i
};
export const AQ: PostalCodeInfo = {
	country: 'Antarctica',
	format: 'BIQQ 1ZZ',
	regex: /^BIQQ 1ZZ$/i
};
export const AR: PostalCodeInfo = {
	country: 'Argentina',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const AM: PostalCodeInfo = {
	country: 'Armenia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const AU: PostalCodeInfo = {
	country: 'Australia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const AT: PostalCodeInfo = {
	country: 'Austria',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const AZ: PostalCodeInfo = {
	country: 'Azerbaijan',
	format: 'AZ#####',
	regex: /^AZ[0-9]{4}$/i
};
export const BH: PostalCodeInfo = {
	country: 'Bahrain',
	format: '###, ####',
	regex: /^[0-9]{3,4}$/i
};
export const BD: PostalCodeInfo = {
	country: 'Bangladesh',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const BB: PostalCodeInfo = {
	country: 'Barbados',
	format: 'BB#####',
	regex: /^(BB)?[0-9]{5}$/i
};
export const BY: PostalCodeInfo = {
	country: 'Belarus',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const BE: PostalCodeInfo = {
	country: 'Belgium',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const BT: PostalCodeInfo = {
	country: 'Bhutan',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const BO: PostalCodeInfo = {
	country: 'Bolivia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const BA: PostalCodeInfo = {
	country: 'Bosnia and Herzegovina',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const BR: PostalCodeInfo = {
	country: 'Brazil',
	format: '########',
	regex: /^[0-9]{8}$/i
};
export const VG: PostalCodeInfo = {
	country: 'British Virgin Islands',
	format: 'VG####',
	regex: /^(VG)?[0-9]{4}$/i
};
export const IO: PostalCodeInfo = {
	country: 'British Indian Ocean Territory',
	format: 'BBND 1ZZ',
	regex: /^BBND 1ZZ$/i
};
export const BN: PostalCodeInfo = {
	country: 'Brunei Darussalam',
	format: 'LL####',
	regex: /^[a-zA-Z]{2}[0-9]{4}$/i
};
export const BG: PostalCodeInfo = {
	country: 'Bulgaria',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const KH: PostalCodeInfo = {
	country: 'Cambodia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const CA: PostalCodeInfo = {
	country: 'Canada',
	format: 'A0A 0A0',
	regex: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i
};
export const CV: PostalCodeInfo = {
	country: 'Cape Verde',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const KY: PostalCodeInfo = {
	country: 'Cayman Islands',
	format: 'KY#-####',
	regex: /^KY[0-9]{1}-[0-9]{4}$/i
};
export const TD: PostalCodeInfo = {
	country: 'Chad',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const CL: PostalCodeInfo = {
	country: 'Chile',
	format: '#######',
	regex: /^[0-9]{7}$/i
};
export const CN: PostalCodeInfo = {
	country: 'China',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const CX: PostalCodeInfo = {
	country: 'Christmas Island',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const CC: PostalCodeInfo = {
	country: 'Cocos (Keeling) Islands',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const CO: PostalCodeInfo = {
	country: 'Colombia',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const CR: PostalCodeInfo = {
	country: 'Costa Rica',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const HR: PostalCodeInfo = {
	country: 'Croatia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const CU: PostalCodeInfo = {
	country: 'Cuba',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const CY: PostalCodeInfo = {
	country: 'Cyprus',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const CZ: PostalCodeInfo = {
	country: 'Czech Republic',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const DK: PostalCodeInfo = {
	country: 'Denmark',
	format: 'DK####',
	regex: /^(DK){0,1}\d{4}$/i
};
export const DO: PostalCodeInfo = {
	country: 'Dominican Republic',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const EC: PostalCodeInfo = {
	country: 'Ecuador',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const EG: PostalCodeInfo = {
	country: 'Egypt',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const SV: PostalCodeInfo = {
	country: 'El Salvador',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const EE: PostalCodeInfo = {
	country: 'Estonia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const ET: PostalCodeInfo = {
	country: 'Ethiopia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const FK: PostalCodeInfo = {
	country: 'Falkland Islands (Malvinas)',
	format: 'FIQQ 1ZZ',
	regex: /^FIQQ 1ZZ$/i
};
export const FO: PostalCodeInfo = {
	country: 'Faroe Islands',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const FI: PostalCodeInfo = {
	country: 'Finland',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const FR: PostalCodeInfo = {
	country: 'France',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const GF: PostalCodeInfo = {
	country: 'French Guiana',
	format: '973##',
	regex: /^973[0-9]{2}$/i
};
export const PF: PostalCodeInfo = {
	country: 'French Polynesia',
	format: '987##',
	regex: /^987[0-9]{2}$/i
};
export const GE: PostalCodeInfo = {
	country: 'Georgia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const DE: PostalCodeInfo = {
	country: 'Germany',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const GI: PostalCodeInfo = {
	country: 'Gibraltar',
	format: 'GX11 1AA',
	regex: /^GX111AA$/i
};
export const GR: PostalCodeInfo = {
	country: 'Greece',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const GL: PostalCodeInfo = {
	country: 'Greenland',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const GP: PostalCodeInfo = {
	country: 'Guadeloupe',
	format: '971##',
	regex: /^971[0-9]{2}$/i
};
export const GU: PostalCodeInfo = {
	country: 'Guam',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const GT: PostalCodeInfo = {
	country: 'Guatemala',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const GG: PostalCodeInfo = {
	country: 'Guernsey',
	format: 'GY#####',
	regex: /^GY[1-10]{1} [1-9]{1}[A-Za-z]{2}$/i
};
export const GN: PostalCodeInfo = {
	country: 'Guinea',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const GW: PostalCodeInfo = {
	country: 'Guinea-Bissau',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const HT: PostalCodeInfo = {
	country: 'Haiti',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const HM: PostalCodeInfo = {
	country: 'Heard Island and Mcdonald Islands',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const VA: PostalCodeInfo = {
	country: 'Holy See (Vatican City State)',
	format: '00120',
	regex: /^00120$/i
};
export const HN: PostalCodeInfo = {
	country: 'Honduras',
	format: 'HN#####',
	regex: /^(HN)?[0-9]{5}$/i
};
export const HU: PostalCodeInfo = {
	country: 'Hungary',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const IS: PostalCodeInfo = {
	country: 'Iceland',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const IN: PostalCodeInfo = {
	country: 'India',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const IC: PostalCodeInfo = {
	country: 'Canary Islands',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const ID: PostalCodeInfo = {
	country: 'Indonesia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const IR: PostalCodeInfo = {
	country: 'Iran, Islamic Republic of',
	format: '##########',
	regex: /^[0-9]{10}$/i
};
export const IQ: PostalCodeInfo = {
	country: 'Iraq',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const IE: PostalCodeInfo = {
	country: 'Ireland',
	format: '### ####, #######, ###-####',
	regex: /^[AaC-Fc-fHhKkNnPpRrTtV-Yv-y]\d[0-9Ww][ -]?[0-9AaC-Fc-fHhKkNnPpRrTtV-Yv-y]{4}$/i
};
export const IM: PostalCodeInfo = {
	country: 'Isle of Man',
	format: 'IM# ###, IM#####',
	regex: /^IM([1-9]{1}|99{1}) [1-9]{1}[A-Za-z]{2}$/i
};
export const IL: PostalCodeInfo = {
	country: 'Israel',
	format: '#######',
	regex: /^[0-9]{7}$/i
};
export const IT: PostalCodeInfo = {
	country: 'Italy',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const JM: PostalCodeInfo = {
	country: 'Jamaica',
	format: '##',
	regex: /^[0-9]{2}$/i
};
export const JP: PostalCodeInfo = {
	country: 'Japan',
	format: '#######',
	regex: /^[0-9]{7}$/i
};
export const JE: PostalCodeInfo = {
	country: 'Jersey',
	format: 'JE# ###, JE#####',
	regex: /^JE[1-9]{1} [1-9]{1}[A-Za-z]{2}$/i
};
export const JO: PostalCodeInfo = {
	country: 'Jordan',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const KZ: PostalCodeInfo = {
	country: 'Kazakhstan',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const KE: PostalCodeInfo = {
	country: 'Kenya',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const KR: PostalCodeInfo = {
	country: 'Korea, Republic of',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const KW: PostalCodeInfo = {
	country: 'Kuwait',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const KG: PostalCodeInfo = {
	country: 'Kyrgyzstan',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const LA: PostalCodeInfo = {
	country: 'Lao PDR',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const LV: PostalCodeInfo = {
	country: 'Latvia',
	format: '#####, LV-#####',
	regex: /^(LV)?[0-9]{4}$/i
};
export const LB: PostalCodeInfo = {
	country: 'Lebanon',
	format: '#####, #### ####',
	regex: /^[0-9]{4}(?:[0-9]{4})?$/i
};
export const LS: PostalCodeInfo = {
	country: 'Lesotho',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const LR: PostalCodeInfo = {
	country: 'Liberia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const LY: PostalCodeInfo = {
	country: 'Libya',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const LI: PostalCodeInfo = {
	country: 'Liechtenstein',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const LT: PostalCodeInfo = {
	country: 'Lithuania',
	format: 'LT-#####',
	regex: /^(LT)?[0-9]{5}$/i
};
export const LU: PostalCodeInfo = {
	country: 'Luxembourg',
	format: 'L####',
	regex: /^(L){0,1}\d{4}$/i
};
export const MK: PostalCodeInfo = {
	country: 'Macedonia, Republic of',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const MG: PostalCodeInfo = {
	country: 'Madagascar',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const MY: PostalCodeInfo = {
	country: 'Malaysia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const MV: PostalCodeInfo = {
	country: 'Maldives',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const MT: PostalCodeInfo = {
	country: 'Malta',
	format: 'LLL ####',
	regex: /^[A-Z]{3}[0-9]{4}$/i
};
export const MH: PostalCodeInfo = {
	country: 'Marshall Islands',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const MQ: PostalCodeInfo = {
	country: 'Martinique',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const MU: PostalCodeInfo = {
	country: 'Mauritius',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const YT: PostalCodeInfo = {
	country: 'Mayotte',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const MX: PostalCodeInfo = {
	country: 'Mexico',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const FM: PostalCodeInfo = {
	country: 'Micronesia, Federated States of',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const MD: PostalCodeInfo = {
	country: 'Moldova',
	format: 'MD####, MD-####',
	regex: /^(MD)?[0-9]{4}$/i
};
export const MC: PostalCodeInfo = {
	country: 'Monaco',
	format: '980##',
	regex: /^980[0-9]{2}$/i
};
export const MN: PostalCodeInfo = {
	country: 'Mongolia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const ME: PostalCodeInfo = {
	country: 'Montenegro',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const MS: PostalCodeInfo = {
	country: 'Montserrat',
	format: 'MSR####',
	regex: /^MSR[0-9]{4}$/i
};
export const MA: PostalCodeInfo = {
	country: 'Morocco',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const MZ: PostalCodeInfo = {
	country: 'Mozambique',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const MM: PostalCodeInfo = {
	country: 'Myanmar',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const NA: PostalCodeInfo = {
	country: 'Namibia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const NP: PostalCodeInfo = {
	country: 'Nepal',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const NL: PostalCodeInfo = {
	country: 'Netherlands',
	format: '#### LL',
	regex: /^[1-9][0-9]{3}(?!SA|SD|SS)[A-Z]{2}$/i
};
export const NC: PostalCodeInfo = {
	country: 'New Caledonia',
	format: '988##',
	regex: /^988[0-9]{2}$/i
};
export const NZ: PostalCodeInfo = {
	country: 'New Zealand',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const NI: PostalCodeInfo = {
	country: 'Nicaragua',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const NE: PostalCodeInfo = {
	country: 'Niger',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const NG: PostalCodeInfo = {
	country: 'Nigeria',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const NF: PostalCodeInfo = {
	country: 'Norfolk Island',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const MP: PostalCodeInfo = {
	country: 'Northern Mariana Islands',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const NO: PostalCodeInfo = {
	country: 'Norway',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const OM: PostalCodeInfo = {
	country: 'Oman',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const PK: PostalCodeInfo = {
	country: 'Pakistan',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const PW: PostalCodeInfo = {
	country: 'Palau',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const PS: PostalCodeInfo = {
	country: 'Palestinian Territory, Occupied',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const PA: PostalCodeInfo = {
	country: 'Panama',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const PG: PostalCodeInfo = {
	country: 'Papua New Guinea',
	format: '###',
	regex: /^[0-9]{3}$/i
};
export const PY: PostalCodeInfo = {
	country: 'Paraguay',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const PE: PostalCodeInfo = {
	country: 'Peru',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const PH: PostalCodeInfo = {
	country: 'Philippines',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const PN: PostalCodeInfo = {
	country: 'Pitcairn',
	format: 'PCR9 1ZZ',
	regex: /^PCR9 1ZZ$/i
};
export const PL: PostalCodeInfo = {
	country: 'Poland',
	format: '##-###',
	regex: /^[0-9]{2}-[0-9]{3}$/i
};
export const PT: PostalCodeInfo = {
	country: 'Portugal',
	format: '####-###',
	regex: /^[0-9]{4}-[0-9]{3}$/i
};
export const PR: PostalCodeInfo = {
	country: 'Puerto Rico',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const RE: PostalCodeInfo = {
	country: 'R??union',
	format: '974##',
	regex: /^974[0-9]{2}$/i
};
export const RO: PostalCodeInfo = {
	country: 'Romania',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const RU: PostalCodeInfo = {
	country: 'Russian Federation',
	format: '###[-###]',
	regex: /^[0-9]{3}([0-9]{3})?$/i
};
export const BL: PostalCodeInfo = {
	country: 'Saint-Barth??lemy',
	format: '97133',
	regex: /^97133$/i
};
export const SH: PostalCodeInfo = {
	country: 'Saint Helena',
	format: 'STHL 1ZZ',
	regex: /^STHL 1ZZ$/i
};
export const LC: PostalCodeInfo = {
	country: 'Saint Lucia',
	format: 'LC## ###',
	regex: /^LC[0-9]{2} [0-9]{3}$/i
};
export const MF: PostalCodeInfo = {
	country: 'Saint-Martin (French part)',
	format: '97150',
	regex: /^97150$/i
};
export const PM: PostalCodeInfo = {
	country: 'Saint Pierre and Miquelon',
	format: '97500',
	regex: /^97500$/i
};
export const VC: PostalCodeInfo = {
	country: 'Saint Vincent and Grenadines',
	format: 'VC#####',
	regex: /^(VC)?[0-9]{4}$/i
};
export const WS: PostalCodeInfo = {
	country: 'Samoa',
	format: 'WS#####',
	regex: /^(WS)?[0-9]{4}$/i
};
export const SM: PostalCodeInfo = {
	country: 'San Marino',
	format: '4789#',
	regex: /^4789[0-9]{1}$/i
};
export const SA: PostalCodeInfo = {
	country: 'Saudi Arabia',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const SN: PostalCodeInfo = {
	country: 'Senegal',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const RS: PostalCodeInfo = {
	country: 'Serbia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const SG: PostalCodeInfo = {
	country: 'Singapore',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const SK: PostalCodeInfo = {
	country: 'Slovakia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const SI: PostalCodeInfo = {
	country: 'Slovenia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const SO: PostalCodeInfo = {
	country: 'Somalia',
	format: 'AA #####',
	regex: /^[a-zA-Z]{2}[0-9]{5}$/i
};
export const ZA: PostalCodeInfo = {
	country: 'South Africa',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const GS: PostalCodeInfo = {
	country: 'South Georgia and the South Sandwich Islands',
	format: 'SIQQ 1ZZ',
	regex: /^SIQQ 1ZZ$/i
};
export const ES: PostalCodeInfo = {
	country: 'Spain',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const LK: PostalCodeInfo = {
	country: 'Sri Lanka',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const SD: PostalCodeInfo = {
	country: 'Sudan',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const SJ: PostalCodeInfo = {
	country: 'Svalbard and Jan Mayen Islands',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const SZ: PostalCodeInfo = {
	country: 'Swaziland',
	format: 'A###',
	regex: /^[a-zA-Z]{1}[0-9]{3}$/i
};
export const SE: PostalCodeInfo = {
	country: 'Sweden',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const CH: PostalCodeInfo = {
	country: 'Switzerland',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const TW: PostalCodeInfo = {
	country: 'Taiwan, Republic of China',
	format: '###[-##]',
	regex: /^[0-9]{3}([0-9]{2})?$/i
};
export const TJ: PostalCodeInfo = {
	country: 'Tajikistan',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const TZ: PostalCodeInfo = {
	country: 'Tanzania *, United Republic of',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const TH: PostalCodeInfo = {
	country: 'Thailand',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const TT: PostalCodeInfo = {
	country: 'Trinidad and Tobago',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const TN: PostalCodeInfo = {
	country: 'Tunisia',
	format: '####',
	regex: /^[0-9]{4}$/i
};
export const TR: PostalCodeInfo = {
	country: 'Turkey',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const TM: PostalCodeInfo = {
	country: 'Turkmenistan',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const TC: PostalCodeInfo = {
	country: 'Turks and Caicos Islands',
	format: 'TKCA 1ZZ',
	regex: /^TKCA1ZZ$/i
};
export const UA: PostalCodeInfo = {
	country: 'Ukraine',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const GB: PostalCodeInfo = {
	country: 'United Kingdom',
	format: '#### ###, ### ###, ## ###',
	regex: /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/i
};
export const US: PostalCodeInfo = {
	country: 'United States of America',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const UY: PostalCodeInfo = {
	country: 'Uruguay',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const UZ: PostalCodeInfo = {
	country: 'Uzbekistan',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const VE: PostalCodeInfo = {
	country: 'Venezuela (Bolivarian Republic of)',
	format: '####, ####-A',
	regex: /^[0-9]{4}[a-zA-Z]?$/i
};
export const VN: PostalCodeInfo = {
	country: 'Viet Nam',
	format: '######',
	regex: /^[0-9]{6}$/i
};
export const VI: PostalCodeInfo = {
	country: 'Virgin Islands, US',
	format: '#####[-####]',
	regex: /^[0-9]{5}([0-9]{4})?$/i
};
export const WF: PostalCodeInfo = {
	country: 'Wallis and Futuna Islands',
	format: '986##',
	regex: /^986[0-9]{2}$/i
};
export const ZM: PostalCodeInfo = {
	country: 'Zambia',
	format: '#####',
	regex: /^[0-9]{5}$/i
};
export const PostalCodes = {
	AF: AF,
	AX: AX,
	AL: AL,
	DZ: DZ,
	AS: AS,
	AD: AD,
	AI: AI,
	AQ: AQ,
	AR: AR,
	AM: AM,
	AU: AU,
	AT: AT,
	AZ: AZ,
	BH: BH,
	BD: BD,
	BB: BB,
	BY: BY,
	BE: BE,
	BT: BT,
	BO: BO,
	BA: BA,
	BR: BR,
	VG: VG,
	IO: IO,
	BN: BN,
	BG: BG,
	KH: KH,
	CA: CA,
	CV: CV,
	KY: KY,
	TD: TD,
	CL: CL,
	CN: CN,
	CX: CX,
	CC: CC,
	CO: CO,
	CR: CR,
	HR: HR,
	CU: CU,
	CY: CY,
	CZ: CZ,
	DK: DK,
	DO: DO,
	EC: EC,
	EG: EG,
	SV: SV,
	EE: EE,
	ET: ET,
	FK: FK,
	FO: FO,
	FI: FI,
	FR: FR,
	GF: GF,
	PF: PF,
	GE: GE,
	DE: DE,
	GI: GI,
	GR: GR,
	GL: GL,
	GP: GP,
	GU: GU,
	GT: GT,
	GG: GG,
	GN: GN,
	GW: GW,
	HT: HT,
	HM: HM,
	VA: VA,
	HN: HN,
	HU: HU,
	IS: IS,
	IN: IN,
	IC: IC,
	ID: ID,
	IR: IR,
	IQ: IQ,
	IE: IE,
	IM: IM,
	IL: IL,
	IT: IT,
	JM: JM,
	JP: JP,
	JE: JE,
	JO: JO,
	KZ: KZ,
	KE: KE,
	KR: KR,
	KW: KW,
	KG: KG,
	LA: LA,
	LV: LV,
	LB: LB,
	LS: LS,
	LR: LR,
	LY: LY,
	LI: LI,
	LT: LT,
	LU: LU,
	MK: MK,
	MG: MG,
	MY: MY,
	MV: MV,
	MT: MT,
	MH: MH,
	MQ: MQ,
	MU: MU,
	YT: YT,
	MX: MX,
	FM: FM,
	MD: MD,
	MC: MC,
	MN: MN,
	ME: ME,
	MS: MS,
	MA: MA,
	MZ: MZ,
	MM: MM,
	NA: NA,
	NP: NP,
	NL: NL,
	NC: NC,
	NZ: NZ,
	NI: NI,
	NE: NE,
	NG: NG,
	NF: NF,
	MP: MP,
	NO: NO,
	OM: OM,
	PK: PK,
	PW: PW,
	PS: PS,
	PA: PA,
	PG: PG,
	PY: PY,
	PE: PE,
	PH: PH,
	PN: PN,
	PL: PL,
	PT: PT,
	PR: PR,
	RE: RE,
	RO: RO,
	RU: RU,
	BL: BL,
	SH: SH,
	LC: LC,
	MF: MF,
	PM: PM,
	VC: VC,
	WS: WS,
	SM: SM,
	SA: SA,
	SN: SN,
	RS: RS,
	SG: SG,
	SK: SK,
	SI: SI,
	SO: SO,
	ZA: ZA,
	GS: GS,
	ES: ES,
	LK: LK,
	SD: SD,
	SJ: SJ,
	SZ: SZ,
	SE: SE,
	CH: CH,
	TW: TW,
	TJ: TJ,
	TZ: TZ,
	TH: TH,
	TT: TT,
	TN: TN,
	TR: TR,
	TM: TM,
	TC: TC,
	UA: UA,
	GB: GB,
	US: US,
	UY: UY,
	UZ: UZ,
	VE: VE,
	VN: VN,
	VI: VI,
	WF: WF,
	ZM: ZM
} as const;

export type PostalCode = typeof PostalCodes;
