# Boolean

## Example

```Typescript
import { boolean } from '@resourge/schema';

boolean()
// or
boolean('Custom error message')
```

## Options

### mustBe

Checks if boolean is true or false

```Typescript
date().mustBe(true)
// with custom message
date().mustBe(true, 'Custom error message')
```

## Contribution

In case you have different validations that you use, please tell us so we improve the library.