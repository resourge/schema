import {
	object, array, string, number
} from '../dist'

const arrSchema = array<Array<{
	test: number
	test2: Array<{
		test: number
		test1: string
	}>
}>>(
	object({
		test: number(),
		test2: array(
			object({
				
			})
		)
		.min(1)
	})
);
