# Object

## Example

```Typescript
import { object } from '@resourge/schema';

object({
  name: string().required(),
  age: number().min(18).required()
})
// with message
object({
  name: string().required(),
  age: number().min(18).required()
}, 'Custom error message')
```

## Contribution

In case you have different validations that you use, please tell us so we improve the library.