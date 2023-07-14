# Any

## Example

```Typescript
import { any } from '@resourge/schema';

any()
// or
any('Custom error message')
```

### enum

Checks if any is a value of enum.

```Typescript

enum FieldTypeEnum {
  FREE_TEXT = 'FREE_TEXT',
  EXISTING_FIELD = 'EXISTING_FIELD',
  SQL_EXPRESSION = 'SQL_EXPRESSION',
  SOURCE_FIELD = 'SOURCE_FIELD'
}
any().enum(FieldTypeEnum)
// with custom message
any().enum(FieldTypeEnum, 'Custom error message')
```

## Contribution

In case you have different validations that you use, please tell us so we improve the library.