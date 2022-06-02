# String

## Example

```Typescript
import { string } from '@resourge/schema';

string()
// or
string('Custom string error message')
```

## Options

### min

Checks if string has a size bigger than minValue.

```Typescript
string().min(1)
// with custom message
string().min(1, 'Custom min error message')
```

### max

Checks if string has a size smaller than maxValue.

```Typescript

string().max(10)
// with custom message
string().max(10, 'Custom max error message')
```

### between

Checks if string is between minValue and maxValue.

```Typescript
string().between(1, 10)
// with custom message
string().between(1, 10, 'Custom between error message')
```

### length

Checks if string has `length` number of characters

```Typescript
string().length(10)
// with custom message
string().length(10, 'Custom length error message')
```

### equals

Checks if string equal to value.

```Typescript
string().equals('name')
// with custom message
string().equals('name', 'Custom equals error message')

// or for multiple values
string().equals(['name', 'id']) // Checks if string is 1 or 10
// with custom message
string().equals(['name', 'id'], 'Custom equals error message')
```

### pattern

Matches regular expression

```Typescript
string().pattern(/\d{4}([-]\d{3})?/)
// with custom message
string().pattern(/\d{4}([-]\d{3})?/, 'Custom pattern error message')
```

### empty

Checks if string is empty.

```Typescript
string().empty()
// with custom message
string().empty('Custom empty error message')
```

### contains

Checks if string contains value.

```Typescript
string().contains('name')
// with custom message
string().contains('name', 'Custom contains error message')
```

### numeric

Checks if string contains only numeric characters.

```Typescript
string().numeric()
// with custom message
string().numeric('Custom numeric error message')
```

### alpha

Checks if string contains only alpha characters.

```Typescript
string().alpha()
// with custom message
string().alpha('Custom alpha error message')
```

### alphanum

Checks if string contains only alpha-numeric characters

```Typescript
string().alphanum()
// with custom message
string().alphanum('Custom alphanum error message')
```

### alphadash

Checks if string contains only contains alpha-numeric characters, as well as dashes and underscores.

```Typescript
string().alphadash()
// with custom message
string().alphadash('Custom alphadash error message')
```

### hex

Checks if string is hexadecimal.

```Typescript
string().hex()
// with custom message
string().hex('Custom hex error message')
```

### base64

Checks if string is hexadecimal.

```Typescript
string().hex()
// with custom message
string().hex('Custom hex error message')
```

## Contribution

In case you have more different validations that you use please tell us so we improve the library.