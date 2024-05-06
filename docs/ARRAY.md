# Array methods

1. `empty`
- Checks if the array is empty.
	```typescript
	empty(message?: string)
	```
- Parameters:
	- `message` (optional) (string): Overrides the default error message.
- Example:
	```typescript
	array({}).empty("Array must be empty");
	```

2. `min`
- Checks if the array has a minimum number of items.
	```typescript
	min(minValue: number, message?: string)
	```
- Parameters:
	- `minValue`: Minimum number of items.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	array({}).min(3, "Array must have at least 3 items");
	```

3. `max`
- Checks if the array has a maximum number of items.
	```typescript
	max(maxValue: number, message?: string)
	```
- Parameters:
	- `maxValue`: Maximum number value.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	array({}).max(10, "Array cannot exceed 10 items");
	```

4. `length`
- Checks if the array has a specific length.
	```typescript
	length(length: number, message?: string)
	```
- Parameters:
	- `length`: Value to compare with.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	array({}).length(5, "Array must have exactly 5 items");
	```

5. `unique`
- Checks if the array contains only unique elements.
	```typescript
	unique(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	array({}).unique("Array must contain only unique items");
	```

6. `uniqueBy`
- Checks if the array contains only unique elements based on a specific key.
	```typescript
	uniqueBy(key: keyof Input[number] | ((val: Input[number]) => any), message?: string): this
	```
- Parameters:
	- `key`: Key to use for uniqueness comparison.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	array({}).uniqueBy("id", "Array must contain unique items based on ID");
	```

7. `test`

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
	import { number } from '@resourge/schema';

	// Define an number schema
	number().test({
      is: (value) => value.length > 10,
      message: "Age must be greater than 10"
    });
	```

8. `asyncTest`

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
	import { number } from '@resourge/schema';

	// Define an number schema
	number().asyncTest({
      is: async (value) => Promise.resolve(value.length > 10),
      message: "Age must be greater than 10"
    });
	```

9. `when`

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
	import { number } from '@resourge/schema';

	// Define an number schema
	number().when({
      is: (value) => value.length > 10,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notOptional()
    });
	```

10. `onlyOnTouch`

- Allows validation to occur only when a field is interacted with (touched).
	```typescript
	onlyOnTouch(onlyOnTouch?: (schema: this) => this)
	```
- Parameters:
	- `onlyOnTouch` (optional): A custom callback function to define validation behavior when validation occurs only on touch.
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().onlyOnTouch();
	```


11. `notOnlyOnTouch`

- Disables the validation to occur only on touch, allowing validation on any interaction.
	```typescript
	notOnlyOnTouch()
	```
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().notOnlyOnTouch();
	```

12. `required`

- Makes a field mandatory for validation.
	```typescript
	required(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is required but missing.
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().required("Value is required");
	```

13. `notRequired`

- Marks a field as optional for validation.
	```typescript
	notRequired()
	```
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().notRequired();
	```

14. `optional`

- Allows a field to be optional during validation.
	```typescript
	optional()
	```
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().optional();;
	```

15. `notOptional`

- Ensures that a field is not optional for validation.
	```typescript
	notOptional(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not optional but is missing.
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().notOptional("Value is not optional");;
	```

16. `nullable`

- Permits null values during validation.
	```typescript
	nullable()
	```
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().nullable();
	```

17. `notNullable`

- Prohibits null values during validation.
	```typescript
	notNullable(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not nullable but is null.
- Example
	```typescript
	import { number } from '@resourge/schema';

	// Define an number schema
	number().notNullable("Value cannot be null");;
	```