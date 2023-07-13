# Number

## Example

```Typescript
import { number } from '@resourge/schema';

number()
// or
number('Custom error message')

// Validate if number is bigger than 1
number().min(1)
```

## Options

### min

Checks if number is bigger than minValue.

```Typescript
number().min(1)
// with custom message
number().min(1, 'Custom error message')
```

### max

Checks if number is smaller than maxValue.

```Typescript

number().max(10)
// with custom message
number().max(10, 'Custom error message')
```

### between

Checks if number is between minValue and maxValue.

```Typescript
number().between(1, 10)
// with custom message
number().between(1, 10, 'Custom error message')
```

### equals

Checks if number equal to value.

```Typescript
number().equals(1)
// with custom message
number().equals(1, 'Custom error message')

// or for multiple values
number().equals([1, 10]) // Checks if number is 1 or 10
// with custom message
number().equals([1, 10], 'Custom error message')
```

### integer

Checks if number is integer.

```Typescript
number().integer()
// with custom message
number().integer('Custom error message')
```

### decimal

Checks if number is decimal.

```Typescript
number().decimal()
// with custom message
number().decimal('Custom error message')
```

### positive

Checks if number is a positive value.

```Typescript
number().positive()
// with custom message
number().positive('Custom error message')
```

### negative

Checks if number is a negative value.

```Typescript
number().negative()
// with custom message
number().negative('Custom error message')
```

### enum
Checks if number is a value of enum.

```Typescript

enum FieldTypeEnum {
  FREE_TEXT = 1,
  EXISTING_FIELD = 2,
  SQL_EXPRESSION = 3,
  SOURCE_FIELD = 4,
}
number().enum(FieldTypeEnum)
// with custom message
number().enum(FieldTypeEnum, 'Custom error message')
```

## Contribution

In case you have different validations that you use, please tell us so we improve the library.