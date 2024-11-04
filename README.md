# @resourge/schema

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

`@resourge/schema` package is a comprehensive schema validation package tailored for developers working with diverse data schemas in modern applications. Designed with simplicity and efficiency in mind, `@resourge/schema` provides a set of utilities to effortlessly validate data against predefined schemas, ensuring accuracy, consistency, and compliance with specified standards.

## Features

- Build with typescript.
- Easy to use in both javascript, node and deno.
- Extremely fast and versatile.
- `OnlyOnTouch` to validate values "only on touch" (values that were changed between last and new validation).
- Offers a complete collection of validations (email, postalCode, etc...).
- Custom methods (test and asyncTest) easy to implement and use.
- 100% coverage.
- Includes validation for countries postal codes and phone numbers.

## Table of Contents

- [Installation](#installation)
- [How it was done](#how-it-was-done)
- [Benchmark](#benchmark)
- [Usage](#usage)
- [Rules](#rules)
- [Object](#object)
- [String](#string)
- [Number](#number)
- [Array](#array)
- [Date](#date)
- [Boolean](#boolean)
- [Compile](#compile)
- [Validate](#validate)
- [Default Message](#default-messages)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/schema
```

or NPM:

```sh
npm install @resourge/schema --save
```

## Benchmark

Benchmarks to compare with other schemas validators (the performance can variate slightly depending on the machine).

[Benchmark](./benchmark/benchmark.ts) 
```sh
@resourge/schema old x 11,616,880 ops/sec ±3.03% (93 runs sampled)
@resourge/schema new x  4,492,524 ops/sec ±2.66% (92 runs sampled)
Fast Validator   	 x  1,593,352 ops/sec ±1.83% (95 runs sampled)
joi              	 x    200,949 ops/sec ±1.30% (94 runs sampled)
zod              	 x     53,117 ops/sec ±2.82% (91 runs sampled)
Yup              	 x     11,939 ops/sec ±0.50% (92 runs sampled)
```

[HeavyBenchmark](./benchmark/heavyBenchmark.ts) (done with an array with 10 000 items)
```sh
@resourge/schema old x 2,550 	ops/sec ±2.17% (90 runs sampled)
@resourge/schema new x 1,363 	ops/sec ±3.31% (93 runs sampled)
Fast Validator   	 x   211 	ops/sec ±0.78% (82 runs sampled)
joi              	 x    28.60 ops/sec ±9.21% (52 runs sampled)
zod              	 x    24.60 ops/sec ±4.28% (45 runs sampled)
Yup              	 x    15.58 ops/sec ±6.81% (44 runs sampled)
```

Would you like to try?

```sh
git clone https://github.com/resourge/schema.git
cd schema
npm install
npm run bench
```

## Usage

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

# object

`object` is used to define schemas for validating objects. 

## Parameters

- `schemas`: An object containing validation schemas for object properties.
- `message` (optional): A custom error message template for object validation failures.

## Methods

[Object schema](./docs/OBJECT.md)

#### Example 

Once you have created a schema using the `object` function, you can chain various validation methods to define your validation rules. For example:

```typescript
import { object, string, number } from '@resourge/schema';

const userSchema = object({
    name: string().required("Name is required"),
    age: number().min(18, "Age must be at least 18").max(100, "Age must be less than or equal to 100"),
    email: string().email("Invalid email address")
})
.compile();

userSchema.validate({
    name: "John Doe",
    age: 25,
    email: "john.doe@example.com"
});
```

In this example, the schema validates that the object:

- Has a name property that is required.
- Has an age property that is at least 18 and less than or equal to 100.
- Has an email property that is a valid email address.



# string

`string` is used to define validation rules for string values. You can chain multiple validation methods to create complex validation logic.

## Parameters

- `message` (optional)(string): Overrides the default error message for validation rules.

## Methods

[string schema](./docs/STRING.md)

#### Example 

Once you have created a schema using the `string` function, you can chain various validation methods to define your validation rules. For example:

```typescript
import { string } from '@resourge/schema';

string()
    .min(5, "Minimum length should be 5 characters")
    .max(10, "Maximum length should be 10 characters")
    .pattern(/[a-zA-Z]+/, "Should contain only alphabetic characters")
	.compile();
```

In this example, the schema validates that the string:

- Has a minimum length of 5 characters.
- Has a maximum length of 10 characters.
- Contains only alphabetic characters.



# number

`number` is used to define validation rules for numbers values. You can chain multiple validation methods to create complex validation logic.

## Parameters

- `message` (optional)(string): Overrides the default error message for validation rules.

## Methods

[number schema](./docs/NUMBER.md)

#### Example 

Once you have created a schema using the `number` function, you can chain various validation methods to define your validation rules. For example:

```typescript
import { string } from '@resourge/schema';

number()
    .min(0, "Value should be greater than or equal to 0")
    .max(100, "Value should be less than or equal to 100")
    .integer("Value should be an integer")
    .positive("Value should be positive")
	.compile();
```

In this example, the schema validates that the number:

- Is greater than or equal to 0.
- Is less than or equal to 100.
- Is an integer.
- Is positive.

# array

`array` is used to define validation rules for array's. You can chain multiple validation methods to create complex validation logic.

## Parameters

- `message` (optional)(string): Overrides the default error message for validation rules.

## Methods

[array schema](./docs/ARRAY.md)

#### Example 

Once you have created a schema using the `array` function, you can chain various validation methods to define your validation rules. For example:

```typescript
import { array } from '@resourge/schema';

// Create an array schema for validating arrays of objects
const arraySchema = array({
    id: number().positive("ID must be a positive number"),
    name: string().required("Name is required"),
    email: string().email("Invalid email address")
}).compile();

// Example data to validate
const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: -2, name: "Alice", email: "alice@example" }, // Invalid email
    { id: 3, name: "Bob", email: "bob@example.com" }
];

// Validate the array of users
const validationResult = arraySchema.validate(users);

if (validationResult.isValid) {
    console.log("All users are valid!");
} else {
    console.log("Validation errors:");
    console.log(validationResult.errors);
}
```

In this example, the schema validates:

- Each object must have a:
	- Positive id.
	- Non-empty name property of type string.
	- Valid email address in the email property.

# date

`date` is used to define validation rules for dates. You can chain multiple validation methods to create complex validation logic.

## Parameters

- `message` (optional)(string): Overrides the default error message for validation rules.

## Methods

[dates schema](./docs/DATE.md)

#### Example 

Once you have created a schema using the `date` function, you can chain various validation methods to define your validation rules. For example:

```typescript
import { date } from '@resourge/schema';

// Create a date schema for validating arrays of objects
const dateSchema = date()
.minDate(new Date("2024-01-01"), "Date must be after 2024-01-01")
.maxDate(new Date("2024-12-31"), "Date must be before 2024-12-31")
.compile();

// Example data to validate
const eventDate = new Date("2024-06-15");

// Validate the date
const validationResult = dateSchema.validate(eventDate);

if (validationResult.isValid) {
    console.log("Event date is valid!");
} else {
    console.log("Validation errors:");
    console.log(validationResult.errors);
}
```

In this example, the schema validates:

- Each object must have a:
	- The date must be after January 1, 2024.
	- The date must be before December 31, 2024.

# boolean

`boolean` is used to define validation rules for dates. You can chain multiple validation methods to create complex validation logic.

## Parameters

- `message` (optional)(string): Overrides the default error message for validation rules.

## Methods

[boolean schema](./docs/BOOLEAN.md)

#### Example 

Once you have created a schema using the `boolean` function, you can chain various validation methods to define your validation rules. For example:

```typescript
import { boolean } from '@resourge/schema';

// Create a boolean schema for validating boolean values
const booleanSchema = boolean();

// Example data to validate
const isEnabled = true;

// Validate the boolean value
const validationResult = booleanSchema.validate(isEnabled);

if (validationResult.isValid) {
    console.log("Boolean value is valid!");
} else {
    console.log("Validation errors:");
    console.log(validationResult.errors);
}
```

In this example, the schema validates:

- Each object must have a:
	- The value must be a boolean (true or false).

# Compile

`compile` is responsible for compiling the validation rules into executable code. The compiled code is then used to validate input data against the defined schema. (it's recommended to use in every schema. Otherwise `isValid` and `validate` will call it).

## Parameters

```typescript
compile(config?: CompileConfig): this
```
- `config` (optional): An object containing configuration options for compilation.
	- `debug` (optional): A boolean flag indicating whether to log the validation structure for debugging purposes. Default is false.
	- `defaultNullable` (optional): A boolean flag indicating whether to make nullable default in the schemas. Default is undefined.
	- `defaultOptional` (optional): A boolean flag indicating whether to make optional default in the schemas. Default is undefined.
	- `messages` (optional): An object containing custom messages to be used during validation.
	- `onlyOnTouch` (optional): A boolean flag indicating whether to make onlyOnTouch default in the schemas.

#### Example

```typescript
import { object } from '@resourge/schema';

// Compile the schema with default configuration
object().compile();

// Compile the schema with custom configuration
object().compile({
  debug: true,
  defaultNullable: true,
  messages: {
    required: 'This field is required.',
    notNullable: 'This field cannot be null.'
  }
});
```

# Validate

`validate` is responsible for validating input data against the compiled schema. It returns an array of errors if any validation errors are encountered.

## Usage

```typescript
validate(value: Input, onlyOnTouch?: OnlyOnTouch<Input>): SchemaError[] | Promise<SchemaError[]>
```

## Parameters

- `value`: The input data to be validated against the schema.
- `onlyOnTouch` (optional): An array of keys that inform the schema if a value was touched. Works only with the onlyOnTouch feature of the schema.

#### Example

```Typescript
import { array, object, string } from '@resourge/schemas';

const schema = object({
  username: string().required(),
  age: number().min(20).required()
  email: string().email().required()
}).compile();

const inputData = {
  username: 'John',
  age: 30,
  email: 'john@example.com'
};

const errors = schema.validate(inputData);
if (errors.length > 0) {
  console.log('Validation errors:', errors);
} else {
  console.log('Validation successful');
}
```

# Default messages

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

## Documentation

For comprehensive documentation and usage examples, visit the [schema documentation](https://resourge.vercel.app/docs/schema/intro).

## Contributing

Contributions to `@resourge/schema` are welcome! To contribute, please follow the [contributing guidelines](CONTRIBUTING.md).

## License

`@resourge/schema` is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact the maintainers:
- GitHub: [Resourge](https://github.com/resourge)
