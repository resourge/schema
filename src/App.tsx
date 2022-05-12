/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */

import { CompileSchemaConfig, Context, Parameters, RuleFn, Schema, SchemaTypes } from './lib/core/schema';
import { array } from './lib/schemas/ArraySchema';
import { number } from './lib/schemas/NumberSchema';
import { object } from './lib/schemas/ObjectSchema';

type A = Array<{
	test: number
	test2: Array<{
		test: number
	}>
}>

const arrSchema = array(
	object({
		test: number(),
		test2: array(
			object({
				test: number()
			})
		)
	})
)

const validate = arrSchema.compile();
// console.log('min invalid', validate(2))
// console.log('max invalid', validate(5))
console.log('valid', validate([{
	test: 10,
	test2: [
		{
			test: '0'
		}
	]
}]))
/*
import { number } from './schemas/NumberSchema';
import { object } from './schemas/ObjectSchema';

console.log('<----Object---->')
const objectSchema = object<{
	test: number
	testObj: {
		test: number
	}
}>({
	test: number(),
	testObj: object({
		test: number()
	})
})

const validate = objectSchema.compile();
// console.log('min invalid', validate(2))
// console.log('max invalid', validate(5))
console.log('valid', validate({
	test: 10,
	testObj: {
		test: 10
	}
}))
import { number } from './schemas/NumberSchema';

console.log('<----Number---->')
const numberSchema = number()
.min(3)
.max(4)

const validate = numberSchema.compile();
console.log('min invalid', validate(2))
console.log('max invalid', validate(5))
console.log('valid', validate(3))

import { string } from './schemas/StringSchema';

console.log('<----String---->')
const stringSchema = string()
.minLength(3)
.maxLength(4)

const validate = stringSchema.compile();
console.log('min invalid', validate('ab'))
console.log('max invalid', validate('abbca'))
console.log('valid', validate('abbc'))

*/

function App() {
	return (
		<div className="App">
			App
		</div>
	)
}

export default App
