import { PhoneNumbers } from '../index';

test('phoneNumbers object', () => {
	// pt_PT
	expect(PhoneNumbers.pt_PT.regex.test('960000000'))
	.toBeTruthy();
	expect(PhoneNumbers.pt_PT.regex.test('999999999'))
	.toBeFalsy();
		
	// fr_FR
	expect(PhoneNumbers.fr_FR.regex.test('33673121233'))
	.toBeTruthy();
	expect(PhoneNumbers.fr_FR.regex.test('999999999'))
	.toBeFalsy();
});
