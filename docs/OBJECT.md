# Object methods

1. `extend`

- Extends the current schema object with additional schemas.
	```typescript
	extend(schemas: SchemaMap<TInput>): ObjectSchema<TInput, TFinal>
	```
- Parameters:
	- `schemas`: An object containing additional validation schemas for object properties.
- Example
	```typescript
	import { object, string, number } from '@resourge/schema';

	// Define an object schema
	object({
	  name: string().required(),
	  age: number().min(18).required()
	}).compile();

	// Extend the schema with additional properties
	const extendedSchema = schema.extend({
	  email: string().email().required()
	}).compile();
	```

2. `oneOf`

- Defines a validation rule where only one of the provided schemas must pass.
	```typescript
	oneOf(oneOfKey: OneOf<Input>, oneOfConfig?: OneOfConfig)
	oneOf<Key extends keyof Input>(
	  oneOfKey: Key[],
	  schema: SchemaMap<Input>[Key],
	  oneOfConfig?: OneOfConfigMessage
	)
	```
- Parameters:
	- `oneOfKey`: An object representing the schema(s) to apply the oneOf validation rule or an array of keys if using multiple schemas.
	- `schema` (optional): If oneOfKey is an array, this parameter represents the schema to apply for each key.
	- `oneOfConfig` (optional): Configuration options for the oneOf validation rule.
- Example
	```Typescript
	import { object, string, number } from '@resourge/schema';

	// Define a oneOf validation rule
	const oneOfSchema = object({
	  name: string().required(),
	  age: number().min(18).required()
	}).oneOf({
	  email: string().email().required()
	}, {
	  includeAllErrors: true,
	  message: 'Only one of name or email is allowed'
	});
	```
- OneOf Message works different from other messages. It can be of 3 ways:
	- string, it will replace all errors generated by oneOf validations with current message
	- { path: string, error: string }, it will only return this object as an error (independently of how many errors are generated by oneOf)
	- Array<{ path: string, error: string }>, it will only return this object as an error (independently of how many errors are generated by oneOf)

3. `test`

- Allows you to define custom synchronous validation methods for the schema.
	```typescript
	test(method: TestMethodConfig<RuleBooleanMethod<Input, Form>>)
	```
- Parameters:
	- `method`: Configuration object containing the validation method and error message.
		- `is`: The validation method which returns a boolean indicating whether the value is valid.
		- `message`: Error message to be displayed when validation fails.
- Example
	```typescript
	import { object, number } from '@resourge/schema';

	// Define an object schema
	object({
	  age: number()
	}).test({
      is: (value) => value.age.length > 10,
      message: "Age must be greater than 10"
    });
	```

4. `asyncTest`

- Enables the definition of custom asynchronous validation methods for the schema.
	```typescript
	asyncTest(method: TestMethodConfig<AsyncRuleBooleanMethod<Input, Form>>)
	```
- Parameters:
	- `method`: Configuration object containing the asynchronous validation method and error message.
		- `is`: The asynchronous validation method which returns a promise resolving to a boolean indicating whether the value is valid.
		- `message`: Error message to be displayed when validation fails.
- Example
	```typescript
	import { object, number } from '@resourge/schema';

	// Define an object schema
	object({
	  age: number()
	}).asyncTest({
      is: async (value) => Promise.resolve(value.age.length > 10),
      message: "Age must be greater than 10"
    });
	```

5. `when`

- Facilitates conditional validation based on a specified condition.
	```typescript
	when(name: string, config: WhenConfig<S, Value, Form>)
	when(config: WhenConfig<S, Value, Form>)
	```
- Parameters:
	- `name` (optional): Name of the condition (if provided).
    - `config`: Configuration object defining the condition and corresponding actions.
      - `is`: The condition function which returns a boolean.
      - `then`: A callback function to be executed if the condition is true.
      - `otherwise`: A callback function to be executed if the condition is false.
- Example
	```typescript
	import { object, number } from '@resourge/schema';

	// Define an object schema
	object({
	  age: number()
	}).when({
      is: (value) => value.age.length > 10,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notOptional()
    });
	```

6. `onlyOnTouch`

- Allows validation to occur only when a field is interacted with (touched).
	```typescript
	onlyOnTouch(onlyOnTouch?: (schema: this) => this)
	```
- Parameters:
	- `onlyOnTouch` (optional): A custom callback function to define validation behavior when validation occurs only on touch.
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().onlyOnTouch();
	```


7. `notOnlyOnTouch`

- Disables the validation to occur only on touch, allowing validation on any interaction.
	```typescript
	notOnlyOnTouch()
	```
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().notOnlyOnTouch();
	```


8. `required`

- Makes a field mandatory for validation.
	```typescript
	required(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is required but missing.
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().required("Value is required");
	```

9. `notRequired`

- Marks a field as optional for validation.
	```typescript
	notRequired()
	```
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().notRequired();
	```

10. `optional`

- Allows a field to be optional during validation.
	```typescript
	optional()
	```
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().optional();;
	```

11. `notOptional`

- Ensures that a field is not optional for validation.
	```typescript
	notOptional(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not optional but is missing.
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().notOptional("Value is not optional");;
	```

12. `nullable`

- Permits null values during validation.
	```typescript
	nullable()
	```
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().nullable();
	```

13. `notNullable`

- Prohibits null values during validation.
	```typescript
	notNullable(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not nullable but is null.
- Example
	```typescript
	import { object } from '@resourge/schema';

	// Define an object schema
	object().notNullable("Value cannot be null");;
	```