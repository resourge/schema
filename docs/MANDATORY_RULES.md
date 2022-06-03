# Mandatory Rule

`Mandatory rule` are rules that come before [Normal Rule](#normalRule) and in case they fail [Normal Rule](#normalRule) will not be called.

## onlyOnTouch

Makes validation only in case data was `touched`

```Typescript
string().onlyOnTouch()
```

## required
### required

Makes validation required (meaning not null and not undefined)

```Typescript
string().required()
```
### notRequired

Makes validation required (meaning it can be null and undefined)

```Typescript
string().notRequired()
```
## optional
### optional

Makes validation optional (meaning it can be undefined)

```Typescript
string().optional()
```
### notOptional

Makes validation optional (meaning it can not be undefined)

```Typescript
string().notOptional()
```
## nullable
### nullable

Makes validation nullable (meaning it can be null)

```Typescript
string().nullable()
```
### notNullable

Makes validation nullable (meaning it can not be null)

```Typescript
string().notNullable()
```