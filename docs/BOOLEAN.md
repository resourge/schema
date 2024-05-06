# Boolean methods

1. `mustBe`
- Checks if the value is equal to the specified boolean value.
	```typescript
	mustBe(mustBeValue: boolean, message?: string)
	```
- Parameters:
	- `mustBeValue`: The value that the boolean must be equal to.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	boolean().mustBe(true, "Value must be true")
	```

2. `test`

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
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().test({
      is: (value) => value,
      message: "Value must be true"
    });
	```

3. `asyncTest`

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
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().asyncTest({
      is: async (value) => Promise.resolve(value),
      message: "Value must be true"
    });
	```

4. `when`

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
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().when({
      is: (value) => value,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notOptional()
    });
	```

5. `onlyOnTouch`

- Allows validation to occur only when a field is interacted with (touched).
	```typescript
	onlyOnTouch(onlyOnTouch?: (schema: this) => this)
	```
- Parameters:
	- `onlyOnTouch` (optional): A custom callback function to define validation behavior when validation occurs only on touch.
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().onlyOnTouch();
	```


6. `notOnlyOnTouch`

- Disables the validation to occur only on touch, allowing validation on any interaction.
	```typescript
	notOnlyOnTouch()
	```
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().notOnlyOnTouch();
	```

7. `required`

- Makes a field mandatory for validation.
	```typescript
	required(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is required but missing.
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().required("Value is required");
	```

8. `notRequired`

- Marks a field as optional for validation.
	```typescript
	notRequired()
	```
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().notRequired();
	```

9. `optional`

- Allows a field to be optional during validation.
	```typescript
	optional()
	```
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().optional();;
	```

10. `notOptional`

- Ensures that a field is not optional for validation.
	```typescript
	notOptional(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not optional but is missing.
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().notOptional("Value is not optional");;
	```

11. `nullable`

- Permits null values during validation.
	```typescript
	nullable()
	```
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().nullable();
	```

12. `notNullable`

- Prohibits null values during validation.
	```typescript
	notNullable(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not nullable but is null.
- Example
	```typescript
	import { boolean } from '@resourge/schema';

	// Define an boolean schema
	boolean().notNullable("Value cannot be null");;
	```