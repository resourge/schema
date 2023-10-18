import { string } from 'src/lib/schemas';

import { setupDefaultMessage } from '../messages';

test('beautifyFunction', () => {
	const customMinMessage = 'Custom min message';

	setupDefaultMessage({
		string: {
			min: () => customMinMessage
		}
	});

	const schema = string()
	.min(10)
	.compile();

	expect(
		schema.validate('Small')
	)
	.toMatchObject([
		{
			path: '',
			error: customMinMessage
		}
	]);
});
