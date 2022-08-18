# String

## Example

```Typescript
import { string } from '@resourge/schema';

string()
// or
string('Custom error message')
```

## Options


### required

Checks if string is not null/undefined/empty string. (Basically the default [MANDATORY_RULES](./MANDATORY_RULES.md) plus empty string)

```Typescript
string().required()
// with custom message
string().required('Custom error message')
```

### min

Checks if string has a size bigger than minValue.

```Typescript
string().min(1)
// with custom message
string().min(1, 'Custom error message')
```

### max

Checks if string has a size smaller than maxValue.

```Typescript

string().max(10)
// with custom message
string().max(10, 'Custom error message')
```

### between

Checks if string is between minValue and maxValue.

```Typescript
string().between(1, 10)
// with custom message
string().between(1, 10, 'Custom error message')
```

### length

Checks if string has length number of characters

```Typescript
string().length(10)
// with custom message
string().length(10, 'Custom error message')
```

### equals

Checks if string equal to value.

```Typescript
string().equals('name')
// with custom message
string().equals('name', 'Custom error message')

// or for multiple values
string().equals(['name', 'id']) // Checks if string is 1 or 10
// with custom message
string().equals(['name', 'id'], 'Custom error message')
```

### pattern

Matches regular expression

```Typescript
string().pattern(/\d{4}([-]\d{3})?/)
// with custom message
string().pattern(/\d{4}([-]\d{3})?/, 'Custom error message')
```

### empty

Checks if string is empty.

```Typescript
string().empty()
// with custom message
string().empty('Custom error message')
```

### contains

Checks if string contains value.

```Typescript
string().contains('name')
// with custom message
string().contains('name', 'Custom error message')
```

### numeric

Checks if string contains only numeric characters.

```Typescript
string().numeric()
// with custom message
string().numeric('Custom error message')
```

### alpha

Checks if string contains only alpha characters.

```Typescript
string().alpha()
// with custom message
string().alpha('Custom error message')
```

### alphanum

Checks if string contains only alpha-numeric characters

```Typescript
string().alphanum()
// with custom message
string().alphanum('Custom error message')
```

### alphadash

Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.

```Typescript
string().alphadash()
// with custom message
string().alphadash('Custom error message')
```

### hex

Checks if string is hexadecimal.

```Typescript
string().hex()
// with custom message
string().hex('Custom error message')
```

### base64

Checks if string is hexadecimal.

```Typescript
string().hex()
// with custom message
string().hex('Custom error message')
```

### uuid

Checks if string is format uuid.

```Typescript
string().uuid()
// with custom message
string().uuid('Custom error message')
```

### url

Checks if string is URL accepted.

```Typescript
string().url()
// with custom message
string().url('Custom error message')
```

### cuid

Checks if string is format cuid.

```Typescript
string().cuid()
// with custom message
string().cuid('Custom error message')
```

### email

Checks if is a valid email.

@mode 
  - basic -> Validation of basic email template.
  - precise -> Validation of a more restricted email template.


```Typescript
string().email()
// or
string().email('basic', 'Custom error message') // 'basic' | 'precise'
// with custom message
string().email('Custom error message')
```

### postalCode

Checks if is a valid postalCode.
Postal Codes regex validations are included.

```Typescript
import { PostalCodes } from '@resourge/schemas/postalCodes';

object({
  country: string(),
  postalCode: string().postalCode(PostalCodes.PT
})
// with custom message
object({
  country: string(),
  postalCode: string().postalCode(PostalCodes.PT, 'Custom error message'))
})
// or
object({
  country: string(),
  postalCode: string().postalCode(
    (_, form) => {
      if(form.country === 'Espanha') {
        return PostalCodes.ES
      }
      return PostalCodes.PT
    }
  )
})
// with custom message
object({
  country: string(),
  postalCode: string().postalCode(
    (_, form) => {
      if(form.country === 'Espanha') {
        return PostalCodes.ES
      }
      return PostalCodes.PT
    }, 
    'Custom error message'
  )
})
```

### phoneNumbers

Checks if is a valid phoneNumber.
Phone Number regex validations are included for every country.

```Typescript
import { phoneNumbers } from '@resourge/schemas/phoneNumbers';

object({
  phoneNumber: string().phoneNumber(PhoneNumbers.pt_PT).required()
// with custom message
object({
  phoneNumber: string().phoneNumber(PhoneNumbers.pt_PT) 'Custom error message'))
})
// or
object({
  phoneNumber: string().phoneNumber(
    (_, form) => {
      if(form.country === 'Spain') {
        return PhoneNumbers.es_ES
      }
      return PhoneNumbers.pt_PT
    }
  )
})
// with custom message
object({
  country: string(),
  postalCode: string().postalCode(
    (_, form) => {
      if(form.country === 'Spain') {
        return PhoneNumbers.es_ES
      }
      return PhoneNumbers.pt_PT
    }, 
    'Custom error message'
  )
})
```

### enum

Checks if string is a value of enum.

```Typescript

enum FieldTypeEnum {
  FREE_TEXT = 'FREE_TEXT',
  EXISTING_FIELD = 'EXISTING_FIELD',
  SQL_EXPRESSION = 'SQL_EXPRESSION',
  SOURCE_FIELD = 'SOURCE_FIELD'
}
string().enum(FieldTypeEnum)
// with custom message
string().enum(FieldTypeEnum, 'Custom error message')
```

## Contribution

In case you have different validations that you use, please tell us so we improve the library.