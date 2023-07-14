# Schema Validation

`@resourge/schema` is a schema validator to validate simple and complex forms.

Visit our website [resourge-schema-validator.netlify.app](https://resourge-schema-validator.netlify.app)

## Features

- Build with typescript.
- Easy to use in both javascript, node and deno.
- Extremely fast and versatile.
- `OnlyOnTouch` to validate values "only on touch" (values that were changed between last and new validation).
- Offers a complete collection of validations (email, postalCode, etc...).
- Custom methods (test and asyncTest) easy to implement and use.
- 100% coverage.
- Includes validation for countries postal codes and phone numbers.

## How it was done

Under the hood `@resourge/schema` creates the validation structure(only) using the Function constructor. No user input is involved in the creation.

It's important to distinguish this from the dangers of a user input generated Function, as in this case user input is not involved.

`@resourge/schema` creates the structure as if the developer created the if's, else's and for's manually.

## Benchmark

Benchmarks to compare with other schemas validators (the performance can variate slightly depending on the machine).

[Benchmark](./benchmark/benchmark.ts) 
```sh
@resourge/schema x 18,634,802 ops/sec ±1.30%  (93 runs sampled)
Fast Validator   x  1,632,544 ops/sec ±0.50%  (92 runs sampled)
joi              x    182,179 ops/sec ±1.15%  (93 runs sampled)
zod              x     52,358 ops/sec ±0.86%  (89 runs sampled)
Yup              x      8,573 ops/sec ±4.42%  (81 runs sampled)
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

Would you like to try?

```sh
git clone https://github.com/resourge/schema.git
cd schema
npm install
npm run bench
```

## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/schema
```

or NPM:

```sh
npm install @resourge/schema --save
```

## Basic usage

```Typescript
import { array, object, string } from '@resourge/schemas';

type User = {
  name: string
  age: number
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
  hobbies: array(string()).min(1).required(),
}).compile();

const schemaErrors = schema.validate(user)
const isValidUser = schema.isValid(user)
```

## Documentation

### Rules

Exists 3 types of rules, [Normal Rules](#normalRules), [Mandatory Rules](#mandatoryRules) and [When Rules](#whenRules)

#### Mandatory Rules

`Mandatory rules` are rules that come before [Normal Rules](#normalRules) and in case they fail [Normal Rules](#normalRules) will not be called.

[See more](docs/MANDATORY_RULES.md)

#### When Rules

- Are rules that come before [Mandatory Rules](#mandatoryRules).
- Adjust the schema based in the validation `is` providing the `then` schema changes or `otherwise` schema changes.
- Are additive, meaning they take the previous validations and add it to `then` or `otherwise`.

```Typescript
number()
.optional()
.when({
  is: (value) => value < 10 || value === null,
  // required() will cancel optional()
  // but in otherwise optional() will still be used
  then: (schema) => schema.negative().required()
});

object({
  productId: number(),
  productTypeId: number().optional()
  // "productId" here it will change the "value" from "is"
  // "productId" will only affect the "is" "value"
  .when('productId', {
    is: (value) => value === 10,
    then: (schema) => schema.required()
  })
})
.compile();
```

#### Normal Rule

`Normal rule` consist of 2 types of rules, [test](#test) and [asyncTest](#asyncTest).

Also exists some predefined normal rules: 
- [Any](docs/ANY.md)
- [Array](docs/ARRAY.md)
- [Boolean](docs/BOOLEAN.md)
- [Date](docs/DATE.md)
- [Number](docs/ARRAY.md)
- [Object](docs/OBJECT.md)
- [String](docs/STRING.md)

_NOTE: If you have rules that you normally use, please tell us so we can improve the package._

#### test

`test` is a normal sync validation.

```typescript
string()
// value is the string value
// form is the original value
// In this case, test is expected to return either true or an array of errors
.test((value, parent, config) => [{
  // path can be a empty string or a path
  // In the case path is a empty string the system will replace it with original path
  path: '', 
  error: 'Custom error Message'
}])
// or
.test({
  // In this case, test is a mandatory a boolean
  is: (value, parent, config) => true,
  message: 'Custom error Message'
})
```

#### asyncTest

`asyncTest` is a normal async validation.

```typescript
string()
// value is the string value
// form is the original value
// In this case, test is expected to return a promise containing either true or an array of errors
.asyncTest(
  (value, parent, config) => Promise.resolve([{
    // path can be a empty string or a path
    // In the case path is a empty string the system will replace it with original path
    // NOTE: It does not handle the catch, it expect to always resolve the promise
    path: '', 
    error: 'Custom error Message'
  }])
)
// or
.asyncTest({
  // In this case, test is a mandatory a boolean
  // NOTE: It does not handle the catch, it expect to always resolve the promise
  is: (value, parent, config) => Promise.resolve(true),
  message: 'Custom error Message'
})
```

### Compile

`compile` is a method to generate the schema (it's recommended to use in every schema. Otherwise `isValid` and `validate` will call it).

```jsx
import { array, object, string } from '@resourge/schemas';

const schema = number().min(20).compile(); // calling compile
const isValid = schema.isValid();
```

#### Compile Options
| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| **debug** | `boolean` | false | false | Shows validation structure in a log. (only works in dev) |
| **onlyOnTouch** | `boolean` | false | false | Set's default onlyOnTouch in every schema. |
| **defaultOptional** | `boolean` | false | undefined | Set's default optional in every schema. (default undefined, meaning it will not validate if is optional or not) |
| **defaultNullable** | `boolean` | false | undefined | Set's default nullable in every schema. (default undefined, meaning it will not validate if is nullable or not) |
| **messages** | `object` | false |  | Object containing all default messages (expect the specific message for the schema). |

### validate

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
    path: 'age',
    error: 'Requires to have at least minimum size of 20'}
  }
]
*/

```

### isValid

`isValid` is a method to validate the data. Returns true or false.

```Typescript
import { array, object, string } from '@resourge/schemas';

const schema = object({
  age: number().min(20)
}).compile();

schema.isValid({ age: 10 }) // false
schema.isValid({ age: 25 }) // true

```

## Advance usage

```Typescript
import { number, object, string, array } from '@resourge/schemas';
import { PostalCodes } from '@resourge/schemas/PostalCodes';
import { PhoneNumbers } from '@resourge/schemas/PhoneNumbers';

type User = {
  name: string
  age: number
  phoneNumber: string
  nif: string
  gender: {
    type: GenderEnum,
    other?: string
  }
  location: {
    city: string
    address: string,
    postalCode: string,
    country: string
  },
  hobbies: string[]
}

enum GenderEnum {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other'
}

const user: User = {
  name: 'Rimuru',
  age: 39,
  phoneNumber: '',
  nif: '',
  gender: {
	type: GenderEnum.MALE
  }
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

const schema = object<UserModel>({
  name: string().min(5).required(),
  age: number().min(18).required(),
  nif: string().onlyOnTouch(
    (schema) => schema.asyncTest({
      is: (value, parent, config) => Promise.resolve(true),
      message: 'Async error'
    })
  ),
  phoneNumber: string().phoneNumber(PhoneNumbers.pt_PT).required(),
  location: object({
    city: string().required(),
    address: string().required(),
    postalCode: string().postalCode(PostalCodes.PT).required(),
    country: string().min(3).required(),
  }).required(),
  gender: object({
    type: string().enum(GenderEnum),
    other: string().when('type', {
	  is: (typeValue) => typeValue === GenderEnum.OTHER,
	  then: (schema) => schema.required()
    }) 
	//
  }),
  hobbies: array(string().enum(HobbiesEnum)).min(1).required(),
}).compile();

const schemaErrors = schema.validate(user)
const isValidUser = schema.isValid(user)
```

### Change default messages

`@resourge/schema`, by default, has default messages. This message can be changed globally.

```Typescript
const customMinMessage = 'Custom min message';

setupDefaultMessage({
  //... rest of translations
  string: {
    min: () => customMinMessage
  }
})

const schema = string()
.min(10)
.compile();

```

## Contribution

We plan to add more validations, as they became necessary.
In case you have different validations that you use, please tell us so we improve the library.

## License

MIT Licensed.
