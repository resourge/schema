# Array

## Example

```Typescript
import { number, array } from '@resourge/schema';

array(<<Schema>>)
// or
array(<<Schema>>, 'Custom number error message')

// Validate if array as at least 1 item
array(number()).min(1)
```

## Options

### empty

Checks if array is empty

```Typescript
array(number()).empty()
// with custom message
array(number()).empty('Custom min error message')
```

### min

Checks if array has a minimal number of items in array

```Typescript
array(number()).min(1)
// with custom message
array(number()).min(1, 'Custom min error message')
```

### max

Checks if array has a maximal number of elements.

```Typescript

array(number()).max(10)
// with custom message
array(number()).max(10, 'Custom max error message')
```

### length

Checks if array has length number of elements

```Typescript
array(number()).length(1, 10)
// with custom message
array(number()).length(1, 10, 'Custom length error message')
```

### unique

Checks if array has only unique elements

```Typescript
array(number()).unique()
// with custom message
array(number()).unique('Custom unique error message')
```

### uniqueBy

Checks if array has only unique by key elements

```Typescript
array(
	object({
		productId: number(),
		productName: string()
	})
).uniqueBy('productId')
// with custom message
array(
	object({
		productId: number(),
		productName: string()
	})
).uniqueBy('productId', 'Custom uniqueBy error message')
// with method instead of key
array(
	object({
		productId: number(),
		productName: string()
	})
).uniqueBy((obj) => obj.productName)
```

## Contribution

In case you have more different validations that you use please tell us so we improve the library.