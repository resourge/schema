# Date

## Example

```Typescript
import { date } from '@resourge/schema';

date()
// or
date('Custom error message')
```

## Options

### today

Checks if date is today

```Typescript
date().today()
// with custom message
date().today('Custom error message')
```
### minDate

Checks if date is bigger than minDate

```Typescript
date().minDate(minDate)
// with custom message
date().minDate(minDate, format, 'Custom error message')

// Format change what get compared
// year -> Compares only years
// month -> Compares only years and months
// date -> Compares only years, months and days
// hour -> Compares only years, months, days and hours
// minute -> Compares only years, months, days, hours and minutes
// second -> Compares only years, months, days, hours, minutes and seconds
// dateTime -> Compares only years, months, days, hours, minutes, seconds and seconds
// time -> Compares only hours, minutes, seconds and seconds
```
### maxDate

Checks if date is smaller than maxDate

```Typescript
date().maxDate(maxDate)
// with custom message
date().maxDate(maxDate, format, 'Custom error message')

// Format change what get compared
// year -> Compares only years
// month -> Compares only years and months
// date -> Compares only years, months and days
// hour -> Compares only years, months, days and hours
// minute -> Compares only years, months, days, hours and minutes
// second -> Compares only years, months, days, hours, minutes and seconds
// dateTime -> Compares only years, months, days, hours, minutes, seconds and seconds
// time -> Compares only hours, minutes, seconds and seconds
```
### equals

Checks if date is equal to date

```Typescript
date().equals(date)
// with custom message
date().equals(date, format, 'Custom error message')

// Format change what get compared
// year -> Compares only years
// month -> Compares only years and months
// date -> Compares only years, months and days
// hour -> Compares only years, months, days and hours
// minute -> Compares only years, months, days, hours and minutes
// second -> Compares only years, months, days, hours, minutes and seconds
// dateTime -> Compares only years, months, days, hours, minutes, seconds and seconds
// time -> Compares only hours, minutes, seconds and seconds
```

## Contribution

In case you have different validations that you use, please tell us so we improve the library.