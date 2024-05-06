# Date methods

1. `today`
- Checks if the date is today.
	```typescript
	today(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	date().today('Custom error message')
	```

2. `minDate`
- Checks if the date is greater than the specified minimum date.
	```typescript
	minDate(minDate: Date, message?: string)
	```
- Parameters:
	- `minDate`: Minimum date.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	date().minDate(minDate, format, 'Custom error message')
	```

2. `maxDate`
- Checks if the date is greater than the specified minimum date.
	```typescript
	maxDate(maxDate: Date, message?: string)
	```
- Parameters:
	- `maxDate`: Maximum date.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	date().maxDate(maxDate, format, 'Custom error message')
	```

2. `equals`
- Checks if the date is equal to the specified date.
	```typescript
	equals(date: Date, message?: string)
	```
- Parameters:
	- `date`: Date to compare.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	date().equals(date, format, 'Custom error message')
	```

3. `test`

- Allows you to define custom synchronous validation methods for the schema.
	```typescript
	test(method: TestMethodConfig<RuledateMethod<Input, Form>>)
	```
- Parameters:
	- `method`: Configuration object containing the validation method and error message.
		- `is`: The validation method which returns a date indicating whether the value is valid.
		- `message`: Error message to be displayed when validation fails.
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().test({
      is: (value) => value.getHours() > 1,
      message: "Age must be greater than 10"
    });
	```

4. `asyncTest`

- Enables the definition of custom asynchronous validation methods for the schema.
	```typescript
	asyncTest(method: TestMethodConfig<AsyncRuledateMethod<Input, Form>>)
	```
- Parameters:
	- `method`: Configuration object containing the asynchronous validation method and error message.
		- `is`: The asynchronous validation method which returns a promise resolving to a date indicating whether the value is valid.
		- `message`: Error message to be displayed when validation fails.
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().asyncTest({
      is: async (value) => Promise.resolve(value.getHours() > 1),
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
      - `is`: The condition function which returns a date.
      - `then`: A callback function to be executed if the condition is true.
      - `otherwise`: A callback function to be executed if the condition is false.
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().when({
      is: (value) => value.getHours() > 1,
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
	import { date } from '@resourge/schema';

	// Define an date schema
	date().onlyOnTouch();
	```


7. `notOnlyOnTouch`

- Disables the validation to occur only on touch, allowing validation on any interaction.
	```typescript
	notOnlyOnTouch()
	```
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().notOnlyOnTouch();
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
	import { date } from '@resourge/schema';

	// Define an date schema
	date().required("Value is required");
	```

9. `notRequired`

- Marks a field as optional for validation.
	```typescript
	notRequired()
	```
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().notRequired();
	```

10. `optional`

- Allows a field to be optional during validation.
	```typescript
	optional()
	```
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().optional();;
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
	import { date } from '@resourge/schema';

	// Define an date schema
	date().notOptional("Value is not optional");;
	```

12. `nullable`

- Permits null values during validation.
	```typescript
	nullable()
	```
- Example
	```typescript
	import { date } from '@resourge/schema';

	// Define an date schema
	date().nullable();
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
	import { date } from '@resourge/schema';

	// Define an date schema
	date().notNullable("Value cannot be null");;
	```