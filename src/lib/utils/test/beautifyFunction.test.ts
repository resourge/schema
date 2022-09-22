import { beautifyFunction } from '../beautifyFunction'

test('beautifyFunction', () => {
	expect(
		beautifyFunction([
			'if (true) {',
			'Test',
			'}'
		])
	)
	.toBe(`if (true) {
	Test
}`)
})
