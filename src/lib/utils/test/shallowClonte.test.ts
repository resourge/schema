import { shallowClone } from '../shallowClone'

describe('shallowClone', () => {
	it('should test array', () => {
		expect(
			shallowClone([])
		).toEqual([])
	})

	it('should test symbol', () => {
		expect(
			shallowClone(
				Object.freeze({
					[Symbol('test')]: true
				})
			)
		)
		.toMatchObject({
			[Symbol('test')]: true
		})
	})

	it('should test object', () => {
		expect(
			shallowClone(
				{
					get productName() {
						return 'productName'
					},
					set productName(productName: string) {
						
					}
				}
			)
		)
		.toMatchObject({
			productName: 'productName'
		})
	})
})
