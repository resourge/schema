# Schema Validation

`@resourge/schema` is a schema validator to validate simple or complex forms.
Includes validation for countries postal codes.

## Features

- Schema validator is completely independent is not necessary to use only forms.
- Build with typescript.
- Easy to use in both javascript, node and deno.
- Extremely fast and versatilely.
- `OnlyOnTouch` to validate values "only on touch" (values that where changed between last validation and new).
- Offers a complete collection of validations (email, postalCode, etc...).
- Custom methods(test and asyncTest) easy to implement and use.
- 100% coverage.

## How it was done

Under the hood `@resourge/schema` creates the validations structure(only) using the Function constructor. No user input is involved in the creation.

It's important to distinguish this from the dangers of a user input generated Function, as in this case user input is not involved.

`@resourge/schema` creates the structure as if the developer created the if's, else's and for's manually.

## Benchmark

Benchmarks comparing with other schemas validators (more or less, as it can variate slightly depending on the machine).

[Benchmark](./benchmark/benchmark.ts) 
```sh
@resourge/schema x 18,634,802 ops/sec ±1.30%  (93 runs sampled)
Fast Validator   x  1,632,544 ops/sec ±0.50%  (92 runs sampled)
joi 			 x    182,179 ops/sec ±1.15%  (93 runs sampled)
zod 			 x     52,358 ops/sec ±0.86%  (89 runs sampled)
Yup 			 x      8,573 ops/sec ±4.42%  (81 runs sampled)
Fastest is  [ '@resourge/schema' ]
```

[HeavyBenchmark](./benchmark/heavyBenchmark.ts) (done with an array with 10 000 items)
```sh
@resourge/schema x 2,594    ops/sec ±0.80% (86 runs sampled)
Fast Validator   x   227    ops/sec ±0.96% (82 runs sampled)
joi              x    32.28 ops/sec ±2.86% (55 runs sampled)
zod              x    21.99 ops/sec ±1.58% (40 runs sampled)
Yup              x    15.65 ops/sec ±2.47% (43 runs sampled)
Fastest is  [ '@resourge/schema' ]
```

## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/schemas
```

or NPM:

```sh
npm install @resourge/schemas --save
```

## Usage

```Typescript
import { array, object, string } from '@resourge/schemas';

type User = {
  name: string
  age: number
  location: {
    city: string
    address: string,
    postalCode: string,
    country: string
  },
  hobbies: string[]
}

const user: User = {
  name: 'Rimuru',
  age: 39,
  location: {
    city: 'Tempest',
    address: 'Tempest',
    postalCode: '4000-000',
    country: 'Tempest'
  },
  hobbies: [
	'Read',
	'Nothing'
  ]	
}

const schema = object<User>({
  name: string().min(5).required(),
  age: number().min(18).required(),
  location: object({
    city: string().required(),
    address: string().required(),
    postalCode: string().postalCode(PostalCodes.PT).required(),
    country: string().min(3).required(),
  }).required(),
  hobbies: array(string()).min(1).required(),
}).compile();


const schemaErrors = schema.validate(user)
const isValidUser = schema.isValid(user)

```

## Rule

Exists 3 types of rules, [Normal Rule](#normalRule), [Mandatory Rule](#mandatoryRule) and [When Rule](#whenRule)

### Mandatory Rule

`Mandatory rule` are rules that come before [Normal Rule](#normalRule) and in case they fail [Normal Rule](#normalRule) will not be called.

[See more](docs/MANDATORY_RULES.md)

### When Rule

`When rule` are rules that come before [Mandatory Rule](#mandatoryRule).

`When rule` adjust the schema based in the validation `is` providing then `then` schema changes or `otherwise` schema changes.

`When rule` are additive, meaning they take the previous validations and add `then` or `otherwise`.

```Typescript
number()
.optional()
.when({
	is: (value) => value < 10 || value === null,
	then: (schema) => schema.negative().required()
});
```

### Normal Rule

`Normal rule` consist in 2 types of rules, [test](#test) and [asyncTest](#asyncTest).

Some of the existing predefined normal rules: 
- [Any](docs/ANY.md)
- [Array](docs/ARRAY.md)
- [Boolean](docs/BOOLEAN.md)
- [Date](docs/DATE.md)
- [Number](docs/ARRAY.md)
- [Object](docs/OBJECT.md)
- [String](docs/STRING.md)

_NOTE: If you have rules that you normally use, tell us._

#### test

`test` is a normal sync rule.

```typescript
string()
// value is the string value
// form is the original value
// In this case, test is expected to return true or an array of errors
.test((value, form) => [{
	// key can be a empty string or a key
	// In case key is a empty string the system will replace it with original key
	key: '', 
	error: 'Custom error Message'
}])
// or
.test({
	// In this case, test is mandatory a boolean
	test: (value, form) => true,
	message: 'Custom error Message'
})
```

#### asyncTest

`asyncTest` is a normal async rule.

```typescript
string()
// value is the string value
// form is the original value
// In this case, test is expected to return a promise containing true or an array of errors
.asyncTest(
	(value, form) => Promise.resolve([{
		// key can be a empty string or a key
		// In case key is a empty string the system will replace it with original key
		// NOTE: It does not handle the catch, it expect to always resolve the promise
		key: '', 
		error: 'Custom error Message'
	}])
)
// or
.asyncTest({
	// In this case, test is mandatory a boolean
	// NOTE: It does not handle the catch, it expect to always resolve the promise
	test: (value, form) => Promise.resolve(true),
	message: 'Custom error Message'
})
```

## Compile

`compile` is a method to generate the schema (it's recommended to use in every schema. In case of missing, `isValid` and `validate` will still call it).

```jsx
import { array, object, string } from '@resourge/schemas';

const schema = number().min(20).compile(); // calling compile
const isValid = schema.isValid();

```

## validate

`validate` is a method to validate the data. Returns the errors.

```Typescript
import { array, object, string } from '@resourge/schemas';

const schema = object({
  age: number().min(20)
}).compile();

const errors = schema.validate({ age: 10 }) 
/* errors will be
[
  { 
    key: 'age',
    error: 'Requires to have at least minimum size of 20'}
  }
]
*/

```

## isValid

`isValid` is a method to validate the data. Returns true or false.

```Typescript
import { array, object, string } from '@resourge/schemas';

const schema = object({
  age: number().min(20)
}).compile();

schema.isValid({ age: 10 }) // false
schema.isValid({ age: 25 }) // true

```

## Using abbreviation of S as shortname

Example using `S` shortname from schema.

```Typescript
import { PostalCodes } from '@resourge/schema/postalCodes';

import { S } from '@resourge/schema';

const user = {
  name: 'Himaru',
  age: 18,
  postalCode: '1000-100'
}

const schema = S.object({
  name: S.string().required(),
  age: S.number().min(16).required(),
  postalCode: S.string().postalCode(PostalCodes.PT)
}).compile();

schema.isValid(user)

```

## Custom Test

Example of a unit testing.

```Typescript
import { PostalCodes } from '@resourge/schema/postalCodes';

import { string, StringSchema } from '@resourge/schema';

describe('Postal code', () => { 
  it('should be a valid user', () => {
    
    const user = {
      name: 'Himaru',
      age: 18,
      postalCode: '1000-100'
    }

    const userInvalid = {
      name: '',
      age: -1,
      postalCode: '1000'
    }

    const schema = object({
      name: string().required(),
      age: number().min(16).required(),
      postalCode: string().postalCode(PostalCodes.PT)
    }).compile();
    
    expect(schema.isValid(user)).toBeTruthy()
    expect(schema.isValid(userInvalid)).toBeFalsy()
  })
})

```

- // TODO: Review English


## Contribution

We plan to add more validations, as they became necessary.
In case you have different validations that you use, please tell us so we improve the library.

## License

MIT Licensed.