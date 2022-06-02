# Object

## Example

```Typescript
import { object } from '@resourge/schema';

object()

// or specification of the object it self
object({
  name: string().required(),
  age: number().min(18).required()
}, 'Custom string error message')

// or
object('Custom object error message')
```

## Contribution

In case you have more different validations that you use please tell us so we improve the library.