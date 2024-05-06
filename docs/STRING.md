# String methods

1. `min`
- Checks if the string has a size bigger than a specified minimum value.
	```typescript
	min(minValue: number, message?: string)
	```
- Parameters:
	- `minValue`: Minimum string length.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().min(5, "Minimum length should be 5 characters");
	```

2. `max`
- Checks if the string has a size smaller than a specified maximum value.
	```typescript
	max(maxValue: number, message?: string)
	```
- Parameters:
	- `maxValue`: Maximum string length.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().max(10, "Maximum length should be 10 characters");
	```

3. `between`
- Checks if the string length is between a specified minimum and maximum value.
	```typescript
	between(minValue:number, maxValue: number, message?: string)
	```
- Parameters:
	- `minValue`: Minimum string length.
	- `maxValue`: Maximum string length.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().between(5, 10, "Length should be between 5 and 10 characters");
	```

4. `length`
- Checks if the string has a specific length.
	```typescript
	length(length: number, message?: string)
	```
- Parameters:
	- `length`: Expected string length.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().length(8, "Length should be exactly 8 characters");
	```

5. `equals`
- Checks if the string is equal to a specified value or an array of values.
	```typescript
	equals(value: number, message?: string)
	```
- Parameters:
	- `value`: Value(s) to compare with.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().equals("password", "Value should be 'password'");
	```

6. `pattern`
- Matches the string against a regular expression pattern.
	```typescript
	pattern(reg: RegExp, message?: string)
	```
- Parameters:
	- `reg`: Regular expression pattern.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().pattern(/[a-zA-Z]+/, "Should contain only alphabetic characters");
	```

7. `empty`
- Checks if the string is empty.
	```typescript
	empty(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().empty("Value should be empty");
	```

8. `contains`
- Checks if the string contains a specified value.
	```typescript
	pattern(value: string, message?: string)
	```
- Parameters:
	- `value`: Value to check if contained.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().contains("example", "Should contain 'example'");
	```

9. `numeric`
- Checks if the string contains only numeric characters.
	```typescript
	numeric(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().numeric("Should contain only numeric characters");
	```

10. `alpha`
- Checks if the string contains only alphabetic characters.
	```typescript
	alpha(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().alpha("Should contain only alphabetic characters");
	```

11. `alphanum`
- Checks if the string contains only alphanumeric characters.
	```typescript
	alphanum(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().alphanum("Should contain only alphanumeric characters");
	```

11. `alphadash`
- Checks if the string contains only alphanumeric characters, dashes, and underscores.
	```typescript
	alphadash(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().alphadash("Should contain only alphanumeric characters, dashes, and underscores");
	```

13. `hex`
- Checks if the string is a hexadecimal value.
	```typescript
	hex(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().hex("Should be a hexadecimal value");
	```

14. `base64`
- Checks if the string is a base64 value.
	```typescript
	base64(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().base64("Should be a base64 value");
	```
15. `uuid`
- Checks if the string is a valid UUID.
	```typescript
	uuid(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().uuid("Should be a valid UUID");
	```

16. `url`
- Checks if the string is a valid URL.
	```typescript
	url(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().url("Should be a valid URL");
	```

17. `cuid`
- Checks if the string is a CUID format.
	```typescript
	cuid(message?: string)
	```
- Parameters:
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().cuid("Should be a CUID");
	```

18. `email`
- Checks if the string is a valid email address.
	```typescript
	email(mode?: 'basic' | 'precise', message?: string)
	```
- Parameters:
	- `mode` (optional): Defines if it's basic or precise validation.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().email("basic", "Should be a valid email address");
	```

19. `postalCode`
- Checks if the string is a valid postal code.
	```typescript
	postalCode(postalCode?: PostalCodeInfo | ((value: NonNullable<Input>, form: any) => PostalCodeInfo), message?: string)
	```
- Parameters:
	- `postalCode`: Postal code to validate or a function that returns the desired postal code.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	import { PostalCodes } from '@resourge/schemas/postalCodes';

	string().postalCode(PostalCodes.US, "Should be a valid US postal code");
	```

20. `phoneNumber`
- Checks if the string is a valid phone number.
	```typescript
	phoneNumber(phoneNumber?: PhoneNumberInfo | ((value: NonNullable<Input>, form: any) => PhoneNumberInfo), message?: string)
	```
- Parameters:
	- `phoneNumber`: Phone number to validate or a function that returns the desired phone number.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	import { PhoneNumbers } from '@resourge/schemas/phoneNumbers';

	string().phoneNumber(PhoneNumbers.en_US, "Should be a valid US phone number");
	```

21. `enum`
- Checks if the string is a value of an enum.
	```typescript
	enum(enumObject: { [name: string]: any }, message?: string)
	```
- Parameters:
	- `enumObject`: Enum object.
	- `message` (optional): Overrides the default error message.
- Example:
	```typescript
	string().enum(MyEnum, "Should be a value of MyEnum");
	```

22. `test`

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
	import { string } from '@resourge/schema';

	// Define an string schema
	string().test({
      is: (value) => value.length >= 3,
      message: 'Username must be at least 3 characters long.',
    });
	```

23. `asyncTest`

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
	import { string } from '@resourge/schema';

	// Define an string schema
	string().asyncTest({
      is: async (value) => Promise.resolve(value.length >= 3),
      message: 'Username must be at least 3 characters long.',
    });
	```

24. `when`

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
	import { string } from '@resourge/schema';

	// Define an string schema
	string().when({
      is: (value) => value.length >= 3,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notOptional()
    });
	```

25. `onlyOnTouch`

- Allows validation to occur only when a field is interacted with (touched).
	```typescript
	onlyOnTouch(onlyOnTouch?: (schema: this) => this)
	```
- Parameters:
	- `onlyOnTouch` (optional): A custom callback function to define validation behavior when validation occurs only on touch.
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().onlyOnTouch();
	```


26. `notOnlyOnTouch`

- Disables the validation to occur only on touch, allowing validation on any interaction.
	```typescript
	notOnlyOnTouch()
	```
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().notOnlyOnTouch();
	```

27. `required`

- Makes a field mandatory for validation.
	```typescript
	required(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is required but missing.
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().required("Value is required");
	```

28. `notRequired`

- Marks a field as optional for validation.
	```typescript
	notRequired()
	```
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().notRequired();
	```

29. `optional`

- Allows a field to be optional during validation.
	```typescript
	optional()
	```
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().optional();;
	```

30. `notOptional`

- Ensures that a field is not optional for validation.
	```typescript
	notOptional(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not optional but is missing.
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().notOptional("Value is not optional");;
	```

31. `nullable`

- Permits null values during validation.
	```typescript
	nullable()
	```
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().nullable();
	```

32. `notNullable`

- Prohibits null values during validation.
	```typescript
	notNullable(message?: string)
	```
- Parameters:
	- `message` (optional): Custom error message to be displayed when the value is not nullable but is null.
- Example
	```typescript
	import { string } from '@resourge/schema';

	// Define an string schema
	string().notNullable("Value cannot be null");;
	```