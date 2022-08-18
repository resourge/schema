/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
export type PhoneNumberInfo = {
	country: string
	countryCode: string
	regex: RegExp
}

const am_AM: PhoneNumberInfo = {
	country: 'am',
	countryCode: 'am_AM',
	regex: /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/
} 
const ar_AE: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_AE',
	regex: /^((\+?971)|0)?5[024568]\d{7}$/
} 
const ar_BH: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_BH',
	regex: /^(\+?973)?(3|6)\d{7}$/
} 
const ar_DZ: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_DZ',
	regex: /^(\+?213|0)(5|6|7)\d{8}$/
} 
const ar_LB: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_LB',
	regex: /^(\+?961)?((3|81)\d{6}|7\d{7})$/
} 
const ar_EG: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_EG',
	regex: /^((\+?20)|0)?1[0125]\d{8}$/
} 
const ar_IQ: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_IQ',
	regex: /^(\+?964|0)?7[0-9]\d{8}$/
} 
const ar_JO: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_JO',
	regex: /^(\+?962|0)?7[789]\d{7}$/
} 
const ar_KW: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_KW',
	regex: /^(\+?965)[569]\d{7}$/
} 
const ar_LY: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_LY',
	regex: /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/
} 
const ar_MA: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_MA',
	regex: /^(?:(?:\+|00)212|0)[5-7]\d{8}$/
} 
const ar_OM: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_OM',
	regex: /^((\+|00)968)?(9[1-9])\d{6}$/
} 
const ar_PS: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_PS',
	regex: /^(\+?970|0)5[6|9](\d{7})$/
} 
const ar_SA: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_SA',
	regex: /^(!?(\+?966)|0)?5\d{8}$/
} 
const ar_SY: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_SY',
	regex: /^(!?(\+?963)|0)?9\d{8}$/
} 
const ar_TN: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_TN',
	regex: /^(\+?216)?[2459]\d{7}$/
} 
const az_AZ: PhoneNumberInfo = {
	country: 'az',
	countryCode: 'az_AZ',
	regex: /^(\+994|0)(10|5[015]|7[07]|99)\d{7}$/
} 
const bs_BA: PhoneNumberInfo = {
	country: 'bs',
	countryCode: 'bs_BA',
	regex: /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/
} 
const be_BY: PhoneNumberInfo = {
	country: 'be',
	countryCode: 'be_BY',
	regex: /^(\+?375)?(24|25|29|33|44)\d{7}$/
} 
const bg_BG: PhoneNumberInfo = {
	country: 'bg',
	countryCode: 'bg_BG',
	regex: /^(\+?359|0)?8[789]\d{7}$/
} 
const bn_BD: PhoneNumberInfo = {
	country: 'bn',
	countryCode: 'bn_BD',
	regex: /^(\+?880|0)1[13456789][0-9]{8}$/
} 
const ca_AD: PhoneNumberInfo = {
	country: 'ca',
	countryCode: 'ca_AD',
	regex: /^(\+376)?[346]\d{5}$/
} 
const cs_CZ: PhoneNumberInfo = {
	country: 'cs',
	countryCode: 'cs_CZ',
	regex: /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/
} 
const da_DK: PhoneNumberInfo = {
	country: 'da',
	countryCode: 'da_DK',
	regex: /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/
} 
const de_DE: PhoneNumberInfo = {
	country: 'de',
	countryCode: 'de_DE',
	regex: /^((\+49|0)1)(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/
} 
const de_AT: PhoneNumberInfo = {
	country: 'de',
	countryCode: 'de_AT',
	regex: /^(\+43|0)\d{1,4}\d{3,12}$/
} 
const de_CH: PhoneNumberInfo = {
	country: 'de',
	countryCode: 'de_CH',
	regex: /^(\+41|0)([1-9])\d{1,9}$/
} 
const de_LU: PhoneNumberInfo = {
	country: 'de',
	countryCode: 'de_LU',
	regex: /^(\+352)?((6\d1)\d{6})$/
} 
const dv_MV: PhoneNumberInfo = {
	country: 'dv',
	countryCode: 'dv_MV',
	regex: /^(\+?960)?(7[2-9]|91|9[3-9])\d{7}$/
} 
const el_GR: PhoneNumberInfo = {
	country: 'el',
	countryCode: 'el_GR',
	regex: /^(\+?30|0)?(69\d{8})$/
} 
const el_CY: PhoneNumberInfo = {
	country: 'el',
	countryCode: 'el_CY',
	regex: /^(\+?357?)?(9(9|6)\d{6})$/
} 
const en_AI: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_AI',
	regex: /^(\+?1|0)264(?:2(35|92)|4(?:6[1-2]|76|97)|5(?:3[6-9]|8[1-4])|7(?:2(4|9)|72))\d{4}$/
} 
const en_AU: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_AU',
	regex: /^(\+?61|0)4\d{8}$/
} 
const en_AG: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_AG',
	regex: /^(?:\+1|1)268(?:464|7(?:1[3-9]|[28]\d|3[0246]|64|7[0-689]))\d{4}$/
} 
const en_BM: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_BM',
	regex: /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}))/
} 
const en_BS: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_BS',
	regex: /^(\+?1[-\s]?|0)?\(?242\)?[-\s]?\d{3}[-\s]?\d{4}$/
} 
const en_GB: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_GB',
	regex: /^(\+?44|0)7\d{9}$/
} 
const en_GG: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_GG',
	regex: /^(\+?44|0)1481\d{6}$/
} 
const en_GH: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_GH',
	regex: /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|59)\d{7}$/
} 
const en_GY: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_GY',
	regex: /^(\+592|0)6\d{6}$/
} 
const en_HK: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_HK',
	regex: /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/
} 
const en_MO: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_MO',
	regex: /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/
} 
const en_IE: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_IE',
	regex: /^(\+?353|0)8[356789]\d{7}$/
} 
const en_IN: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_IN',
	regex: /^(\+?91|0)?[6789]\d{9}$/
} 
const en_JM: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_JM',
	regex: /^(\+?876)?\d{7}$/
} 
const en_KE: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_KE',
	regex: /^(\+?254|0)(7|1)\d{8}$/
} 
const en_KI: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_KI',
	regex: /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/
} 
const en_LS: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_LS',
	regex: /^(\+?266)(22|28|57|58|59|27|52)\d{6}$/
} 
const en_MT: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_MT',
	regex: /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/
} 
const en_MU: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_MU',
	regex: /^(\+?230|0)?\d{8}$/
} 
const en_NA: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_NA',
	regex: /^(\+?264|0)(6|8)\d{7}$/
} 
const en_NG: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_NG',
	regex: /^(\+?234|0)?[789]\d{9}$/
} 
const en_NZ: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_NZ',
	regex: /^(\+?64|0)[28]\d{7,9}$/
} 
const en_PG: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_PG',
	regex: /^(\+?675|0)?(7\d|8[18])\d{6}$/
} 
const en_PK: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_PK',
	regex: /^((00|\+)?92|0)3[0-6]\d{8}$/
} 
const en_PH: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_PH',
	regex: /^(09|\+639)\d{9}$/
} 
const en_RW: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_RW',
	regex: /^(\+?250|0)?[7]\d{8}$/
} 
const en_SG: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_SG',
	regex: /^(\+65)?[3689]\d{7}$/
} 
const en_SL: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_SL',
	regex: /^(\+?232|0)\d{8}$/
} 
const en_TZ: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_TZ',
	regex: /^(\+?255|0)?[67]\d{8}$/
} 
const en_UG: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_UG',
	regex: /^(\+?256|0)?[7]\d{8}$/
} 
const en_US: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_US',
	regex: /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/
} 
const en_ZA: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_ZA',
	regex: /^(\+?27|0)\d{9}$/
} 
const en_ZM: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_ZM',
	regex: /^(\+?26)?09[567]\d{7}$/
} 
const en_ZW: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_ZW',
	regex: /^(\+263)[0-9]{9}$/
} 
const en_BW: PhoneNumberInfo = {
	country: 'en',
	countryCode: 'en_BW',
	regex: /^(\+?267)?(7[1-8]{1})\d{6}$/
} 
const es_AR: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_AR',
	regex: /^\+?549(11|[2368]\d)\d{8}$/
} 
const es_BO: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_BO',
	regex: /^(\+?591)?(6|7)\d{7}$/
} 
const es_CO: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_CO',
	regex: /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/
} 
const es_CL: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_CL',
	regex: /^(\+?56|0)[2-9]\d{1}\d{7}$/
} 
const es_CR: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_CR',
	regex: /^(\+506)?[2-8]\d{7}$/
} 
const es_CU: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_CU',
	regex: /^(\+53|0053)?5\d{7}/
} 
const es_DO: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_DO',
	regex: /^(\+?1)?8[024]9\d{7}$/
} 
const es_HN: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_HN',
	regex: /^(\+?504)?[9|8]\d{7}$/
} 
const es_EC: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_EC',
	regex: /^(\+?593|0)([2-7]|9[2-9])\d{7}$/
} 
const es_ES: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_ES',
	regex: /^(\+?34)?[6|7]\d{8}$/
} 
const es_PE: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_PE',
	regex: /^(\+?51)?9\d{8}$/
} 
const es_MX: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_MX',
	regex: /^(\+?52)?(1|01)?\d{10,11}$/
} 
const es_NI: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_NI',
	regex: /^(\+?505)\d{7,8}$/
} 
const es_PA: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_PA',
	regex: /^(\+?507)\d{7,8}$/
} 
const es_PY: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_PY',
	regex: /^(\+?595|0)9[9876]\d{7}$/
} 
const es_SV: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_SV',
	regex: /^(\+?503)?[67]\d{7}$/
} 
const es_UY: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_UY',
	regex: /^(\+598|0)9[1-9][\d]{6}$/
} 
const es_VE: PhoneNumberInfo = {
	country: 'es',
	countryCode: 'es_VE',
	regex: /^(\+?58)?(2|4)\d{9}$/
} 
const et_EE: PhoneNumberInfo = {
	country: 'et',
	countryCode: 'et_EE',
	regex: /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/
} 
const fa_IR: PhoneNumberInfo = {
	country: 'fa',
	countryCode: 'fa_IR',
	regex: /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/
} 
const fi_FI: PhoneNumberInfo = {
	country: 'fi',
	countryCode: 'fi_FI',
	regex: /^(\+?358|0)\s?(4[0-6]|50)\s?(\d\s?){4,8}$/
} 
const fj_FJ: PhoneNumberInfo = {
	country: 'fj',
	countryCode: 'fj_FJ',
	regex: /^(\+?679)?\s?\d{3}\s?\d{4}$/
} 
const fo_FO: PhoneNumberInfo = {
	country: 'fo',
	countryCode: 'fo_FO',
	regex: /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/
} 
const fr_BF: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_BF',
	regex: /^(\+226|0)[67]\d{7}$/
} 
const fr_BJ: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_BJ',
	regex: /^(\+229)\d{8}$/
} 
const fr_CM: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_CM',
	regex: /^(\+?237)6[0-9]{8}$/
} 
const fr_FR: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_FR',
	regex: /^(\+?33|0)[67]\d{8}$/
} 
const fr_GF: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_GF',
	regex: /^(\+?594|0|00594)[67]\d{8}$/
} 
const fr_GP: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_GP',
	regex: /^(\+?590|0|00590)[67]\d{8}$/
} 
const fr_MQ: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_MQ',
	regex: /^(\+?596|0|00596)[67]\d{8}$/
} 
const fr_PF: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_PF',
	regex: /^(\+?689)?8[789]\d{6}$/
} 
const fr_RE: PhoneNumberInfo = {
	country: 'fr',
	countryCode: 'fr_RE',
	regex: /^(\+?262|0|00262)[67]\d{8}$/
} 
const he_IL: PhoneNumberInfo = {
	country: 'he',
	countryCode: 'he_IL',
	regex: /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/
} 
const hu_HU: PhoneNumberInfo = {
	country: 'hu',
	countryCode: 'hu_HU',
	regex: /^(\+?36|06)(20|30|31|50|70)\d{7}$/
} 
const id_ID: PhoneNumberInfo = {
	country: 'id',
	countryCode: 'id_ID',
	regex: /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/
} 
const ir_IR: PhoneNumberInfo = {
	country: 'ir',
	countryCode: 'ir_IR',
	regex: /^(\+98|0)?9\d{9}$/
} 
const it_IT: PhoneNumberInfo = {
	country: 'it',
	countryCode: 'it_IT',
	regex: /^(\+?39)?\s?3\d{2} ?\d{6,7}$/
} 
const it_SM: PhoneNumberInfo = {
	country: 'it',
	countryCode: 'it_SM',
	regex: /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/
} 
const ja_JP: PhoneNumberInfo = {
	country: 'ja',
	countryCode: 'ja_JP',
	regex: /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/
} 
const ka_GE: PhoneNumberInfo = {
	country: 'ka',
	countryCode: 'ka_GE',
	regex: /^(\+?995)?(79\d{7}|5\d{8})$/
} 
const kk_KZ: PhoneNumberInfo = {
	country: 'kk',
	countryCode: 'kk_KZ',
	regex: /^(\+?7|8)?7\d{9}$/
} 
const kl_GL: PhoneNumberInfo = {
	country: 'kl',
	countryCode: 'kl_GL',
	regex: /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/
} 
const ko_KR: PhoneNumberInfo = {
	country: 'ko',
	countryCode: 'ko_KR',
	regex: /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/
} 
const ky_KG: PhoneNumberInfo = {
	country: 'ky',
	countryCode: 'ky_KG',
	regex: /^(\+?7\s?\+?7|0)\s?\d{2}\s?\d{3}\s?\d{4}$/
} 
const lt_LT: PhoneNumberInfo = {
	country: 'lt',
	countryCode: 'lt_LT',
	regex: /^(\+370|8)\d{8}$/
} 
const lv_LV: PhoneNumberInfo = {
	country: 'lv',
	countryCode: 'lv_LV',
	regex: /^(\+?371)2\d{7}$/
} 
const mg_MG: PhoneNumberInfo = {
	country: 'mg',
	countryCode: 'mg_MG',
	regex: /^((\+?261|0)(2|3)\d)?\d{7}$/
} 
const mn_MN: PhoneNumberInfo = {
	country: 'mn',
	countryCode: 'mn_MN',
	regex: /^(\+|00|011)?976(77|81|88|91|94|95|96|99)\d{6}$/
} 
const my_MM: PhoneNumberInfo = {
	country: 'my',
	countryCode: 'my_MM',
	regex: /^(\+?959|09|9)(2[5-7]|3[1-2]|4[0-5]|6[6-9]|7[5-9]|9[6-9])[0-9]{7}$/
} 
const ms_MY: PhoneNumberInfo = {
	country: 'ms',
	countryCode: 'ms_MY',
	regex: /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/
} 
const mz_MZ: PhoneNumberInfo = {
	country: 'mz',
	countryCode: 'mz_MZ',
	regex: /^(\+?258)?8[234567]\d{7}$/
} 
const nb_NO: PhoneNumberInfo = {
	country: 'nb',
	countryCode: 'nb_NO',
	regex: /^(\+?47)?[49]\d{7}$/
} 
const ne_NP: PhoneNumberInfo = {
	country: 'ne',
	countryCode: 'ne_NP',
	regex: /^(\+?977)?9[78]\d{8}$/
} 
const nl_BE: PhoneNumberInfo = {
	country: 'nl',
	countryCode: 'nl_BE',
	regex: /^(\+?32|0)4\d{8}$/
} 
const nl_NL: PhoneNumberInfo = {
	country: 'nl',
	countryCode: 'nl_NL',
	regex: /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/
} 
const nl_AW: PhoneNumberInfo = {
	country: 'nl',
	countryCode: 'nl_AW',
	regex: /^(\+)?297(56|59|64|73|74|99)\d{5}$/
} 
const nn_NO: PhoneNumberInfo = {
	country: 'nn',
	countryCode: 'nn_NO',
	regex: /^(\+?47)?[49]\d{7}$/
} 
const pl_PL: PhoneNumberInfo = {
	country: 'pl',
	countryCode: 'pl_PL',
	regex: /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/
} 
const pt_BR: PhoneNumberInfo = {
	country: 'pt',
	countryCode: 'pt_BR',
	regex: /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[1-9]{1}\d{3}\-?\d{4}))$/
} 
const pt_PT: PhoneNumberInfo = {
	country: 'pt',
	countryCode: 'pt_PT',
	regex: /^(\+?351)?9[1236]\d{7}$/
} 
const pt_AO: PhoneNumberInfo = {
	country: 'pt',
	countryCode: 'pt_AO',
	regex: /^(\+244)\d{9}$/
} 
const ro_RO: PhoneNumberInfo = {
	country: 'ro',
	countryCode: 'ro_RO',
	regex: /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/
} 
const ru_RU: PhoneNumberInfo = {
	country: 'ru',
	countryCode: 'ru_RU',
	regex: /^(\+?7|8)?9\d{9}$/
} 
const si_LK: PhoneNumberInfo = {
	country: 'si',
	countryCode: 'si_LK',
	regex: /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/
} 
const sl_SI: PhoneNumberInfo = {
	country: 'sl',
	countryCode: 'sl_SI',
	regex: /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/
} 
const sk_SK: PhoneNumberInfo = {
	country: 'sk',
	countryCode: 'sk_SK',
	regex: /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/
} 
const sq_AL: PhoneNumberInfo = {
	country: 'sq',
	countryCode: 'sq_AL',
	regex: /^(\+355|0)6[789]\d{6}$/
} 
const sr_RS: PhoneNumberInfo = {
	country: 'sr',
	countryCode: 'sr_RS',
	regex: /^(\+3816|06)[- \d]{5,9}$/
} 
const sv_SE: PhoneNumberInfo = {
	country: 'sv',
	countryCode: 'sv_SE',
	regex: /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/
} 
const tg_TJ: PhoneNumberInfo = {
	country: 'tg',
	countryCode: 'tg_TJ',
	regex: /^(\+?992)?[5][5]\d{7}$/
} 
const th_TH: PhoneNumberInfo = {
	country: 'th',
	countryCode: 'th_TH',
	regex: /^(\+66|66|0)\d{9}$/
} 
const tr_TR: PhoneNumberInfo = {
	country: 'tr',
	countryCode: 'tr_TR',
	regex: /^(\+?90|0)?5\d{9}$/
} 
const tk_TM: PhoneNumberInfo = {
	country: 'tk',
	countryCode: 'tk_TM',
	regex: /^(\+993|993|8)\d{8}$/
} 
const uk_UA: PhoneNumberInfo = {
	country: 'uk',
	countryCode: 'uk_UA',
	regex: /^(\+?38|8)?0\d{9}$/
} 
const uz_UZ: PhoneNumberInfo = {
	country: 'uz',
	countryCode: 'uz_UZ',
	regex: /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/
} 
const vi_VN: PhoneNumberInfo = {
	country: 'vi',
	countryCode: 'vi_VN',
	regex: /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/
} 
const zh_CN: PhoneNumberInfo = {
	country: 'zh',
	countryCode: 'zh_CN',
	regex: /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/
} 
const zh_TW: PhoneNumberInfo = {
	country: 'zh',
	countryCode: 'zh_TW',
	regex: /^(\+?886\-?|0)?9\d{8}$/
} 
const dz_BT: PhoneNumberInfo = {
	country: 'dz',
	countryCode: 'dz_BT',
	regex: /^(\+?975|0)?(17|16|77|02)\d{6}$/
} 
const ar_YE: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_YE',
	regex: /^(((\+|00)9677|0?7)[0137]\d{7}|((\+|00)967|0)[1-7]\d{6})$/
} 
const ar_EH: PhoneNumberInfo = {
	country: 'ar',
	countryCode: 'ar_EH',
	regex: /^(\+?212|0)[\s\-]?(5288|5289)[\s\-]?\d{5}$/
} 
const fa_AF: PhoneNumberInfo = {
	country: 'fa',
	countryCode: 'fa_AF',
	regex: /^(\+93|0)?(2{1}[0-8]{1}|[3-5]{1}[0-4]{1})(\d{7})$/
} 

export const PhoneNumbers = {
	am_AM,
	ar_AE,
	ar_BH,
	ar_DZ,
	ar_LB,
	ar_EG,
	ar_IQ,
	ar_JO,
	ar_KW,
	ar_LY,
	ar_MA,
	ar_OM,
	ar_PS,
	ar_SA,
	ar_SY,
	ar_TN,
	az_AZ,
	bs_BA,
	be_BY,
	bg_BG,
	bn_BD,
	ca_AD,
	cs_CZ,
	da_DK,
	de_DE,
	de_AT,
	de_CH,
	de_LU,
	dv_MV,
	el_GR,
	el_CY,
	en_AI,
	en_AU,
	en_AG,
	en_BM,
	en_BS,
	en_GB,
	en_GG,
	en_GH,
	en_GY,
	en_HK,
	en_MO,
	en_IE,
	en_IN,
	en_JM,
	en_KE,
	en_KI,
	en_LS,
	en_MT,
	en_MU,
	en_NA,
	en_NG,
	en_NZ,
	en_PG,
	en_PK,
	en_PH,
	en_RW,
	en_SG,
	en_SL,
	en_TZ,
	en_UG,
	en_US,
	en_ZA,
	en_ZM,
	en_ZW,
	en_BW,
	es_AR,
	es_BO,
	es_CO,
	es_CL,
	es_CR,
	es_CU,
	es_DO,
	es_HN,
	es_EC,
	es_ES,
	es_PE,
	es_MX,
	es_NI,
	es_PA,
	es_PY,
	es_SV,
	es_UY,
	es_VE,
	et_EE,
	fa_IR,
	fi_FI,
	fj_FJ,
	fo_FO,
	fr_BF,
	fr_BJ,
	fr_CM,
	fr_FR,
	fr_GF,
	fr_GP,
	fr_MQ,
	fr_PF,
	fr_RE,
	he_IL,
	hu_HU,
	id_ID,
	ir_IR,
	it_IT,
	it_SM,
	ja_JP,
	ka_GE,
	kk_KZ,
	kl_GL,
	ko_KR,
	ky_KG,
	lt_LT,
	lv_LV,
	mg_MG,
	mn_MN,
	my_MM,
	ms_MY,
	mz_MZ,
	nb_NO,
	ne_NP,
	nl_BE,
	nl_NL,
	nl_AW,
	nn_NO,
	pl_PL,
	pt_BR,
	pt_PT,
	pt_AO,
	ro_RO,
	ru_RU,
	si_LK,
	sl_SI,
	sk_SK,
	sq_AL,
	sr_RS,
	sv_SE,
	tg_TJ,
	th_TH,
	tr_TR,
	tk_TM,
	uk_UA,
	uz_UZ,
	vi_VN,
	zh_CN,
	zh_TW,
	dz_BT,
	ar_YE,
	ar_EH,
	fa_AF
} as const;

export type PhoneNumber = typeof PhoneNumbers;
