# Schema Validation

`schema` is a schema validator in typescript with all the validations needed for complex forms. 
Includes postal codes for all countries available.

BenchMark comparing with other schemas validators:
```sh
@resourge/schema x  21,201,314 ops/sec ±1.02% (88 runs sampled)
Fast Validator   x  1,751,056 ops/sec ±1.26%  (90 runs sampled)
joi 			 x  329,450 ops/sec ±1.32%    (88 runs sampled)
zod 			 x  33,499 ops/sec ±1.30%     (88 runs sampled)
Yup 			 x  4,066 ops/sec ±1.39%      (70 runs sampled)
Fastest is  [ '@resourge/schema' ]
```

## Features

- Schema validator is completely independent is not necessary to use only forms.
- Build with typescript.
- Easy to use everywhere in javascript.
- Very fast.
- OnlyOnTouch to validate values "only on touch"(value that where changed).
- Offers a very complete collection of validations (email, postalCode, etc...).


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

// TODO add example with values

const schema = object<User>({
  name: string().min(5).required(),
  age: number().min(18).required(),
  location: object({
    city: string().required(),
    address: string().required(),
    postalCode: string().postalCode().required(),
    country: string().min(3).required(),
  }).required(),
  hobbies: array(string()).min(1).required(),
}).compile();


const schemaErrors = schema.validate(...)
const isValidUser = schema.isValid(...)

```

## Compile

`compile` is a method necessary to generate the schema and is required to call .compile() at the end of the schema.

```jsx
import { array, object, string } from '@resourge/schemas';

const schema = number().min(20).compile(); // calling compile
const isValid = schema.isValid();

```

## validate

`validate` is the method necessary to validate the schema and will return the errors.

```jsx
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

`isValid` is the method to check if is valid without returning the errors.

## isValid

```jsx
import { array, object, string } from '@resourge/schemas';

const schema = object({
  age: number().min(20)
}).compile();

schema.isValid({ age: 10 }) // false
schema.isValid({ age: 25 }) // true

```

// TODO: Add examples with "S"
// TODO: Mandatory Rules
// TODO: When
// TODO: Custom Test
// TODO: Custom Async Test
// TODO: Review English
// TODO: Add unitary testing for method PostalCode

## Available validations

- [String](docs/STRING.md)
- [Number](docs/ARRAY.md)
- [Array](docs/ARRAY.md)
- [Boolean](docs/BOOLEAN.md)
- [Date](docs/DATE.md)
- [Object](docs/OBJECT.md)

## License

MIT Licensed.