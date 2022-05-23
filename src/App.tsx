/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new-func */
/* eslint-disable @typescript-eslint/no-implied-eval */

// import { CompileSchemaConfig, Context, Parameters, RuleFn, Schema, SchemaTypes } from './core/schema';
import { Touches } from './lib/core/schema';
import { array } from './lib/schemas/ArraySchema';
import { number } from './lib/schemas/NumberSchema';
import { object } from './lib/schemas/ObjectSchema';
import { string } from './lib/schemas/StringSchema';
// import { ObjectShape, Shape } from './lib/types/SchemaObject';

const schema = array<
	Array<{
		deliveryId: number
		products: Array<{
			product: number
			productName: string
		}>
	}>
>(
	object({
		deliveryId: number(),
		products: array(
			object(
				{
					product: number((schema) => 
						schema.min(1)
						.equals(10)
						.max(10)
						.test(
							'Custom function for the number',
							(a, c) => {
								return true;
							},
							'Custom message for the number'
						)
					),
					productName: string()
				},
				(schema) => schema
				.test(
					'Custom function for the object',
					(a, c) => {
						return true;
					},
					'Custom message for the object'
				)
			),
			(schema) => schema.min(1)
		)
	})
).compile({ onlyOnTouch: true });
console.log(
	'valid', 
	schema.validate(
		[{
			deliveryId: 10,
			products: [
				{
					product: 10,
					productName: 'test'
				}
			]
		}],
		{
			'[0].deliveryId': true,
			'[0].products': true
		}
	)
)

type A = Touches<Array<{ test: number }>>
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
