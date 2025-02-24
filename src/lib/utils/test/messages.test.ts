import { expect, it } from 'vitest';

import { string } from '../../schemas';
import { setupDefaultMessage } from '../messages';

it('beautifyFunction', () => {
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
