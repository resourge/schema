# Number methods

1. `min`
- Checks if the number is greater than or equal to the specified minimum value.
	```typescript
	min(minValue: number, message?: string)
	```
- Parameters:
	- `minValue`: Minimum number value.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().min(5, "Value must be at least 5");
	```

2. `max`
- Checks if the number is less than or equal to the specified maximum value.
	```typescript
	max(maxValue: number, message?: string)
	```
- Parameters:
	- `maxValue`: Maximum number value.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().max(10, "Value cannot exceed 10");
	```

3. `between`
- Checks if the number is within the specified range (inclusive).
	```typescript
	between(minValue: number, maxValue: number, message?: string)
	```
- Parameters:
	- `minValue`: Minimum number value.
	- `maxValue`: Maximum number value.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().between(5, 10, "Value must be between 5 and 10");
	```

4. `equals`
- Checks if the number is equal to the specified value or within the specified array of values.
	```typescript
	equals(value: number, message?: string)
	```
- Parameters:
	- `value`: Value to compare with.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().equals(5, "Value must be equal to 5");
	```

5. `integer`
- Checks if the number is an integer.
	```typescript
	integer(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().integer("Value must be an integer");
	```

6. `decimal`
- Checks if the number has a specified number of decimal places.
	```typescript
	decimal(decimal: number, message?: string)
	```
- Parameters:
	- `decimal`: Number of decimal places.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().decimal(2, "Value must have 2 decimal places");
	```

7. `positive`
- Checks if the number is a positive value (greater than or equal to zero).
	```typescript
	positive(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().positive("Value must be positive");
	```

8. `negative`
- Checks if the number is a negative value.
	```typescript
	negative(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	number().negative("Value must be negative");
	```

9. `enum`
- Checks if the number is one of the values defined in the specified enum.
	```typescript
	enum(enumObject: { [name: string]: number }, message?: string)
	```
- Parameters:
	- `enumObject`: Enum object containing allowed values.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	enum Color {
      Red = 1,
      Green = 2,
      Blue = 3
    }

    number().enum(Color, "Value must be a valid color");
	```

10. `test`

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

11. `asyncTest`

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

12. `when`

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

13. `onlyOnTouch`

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


14. `notOnlyOnTouch`

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

15. `required`

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

16. `notRequired`

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

17. `optional`

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

18. `notOptional`

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

19. `nullable`

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

20. `notNullable`

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