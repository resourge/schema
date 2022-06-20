## [1.3.2](https://github.com/resourge/schema/compare/v1.3.1...v1.3.2) (2022-06-20)


### Performance Improvements

* **rule:** add currentValue for array cases ([33c8147](https://github.com/resourge/schema/commit/33c8147d494f0f9b7a00174dcac8613fac602369))

## [1.3.1](https://github.com/resourge/schema/compare/v1.3.0...v1.3.1) (2022-06-20)


### Bug Fixes

* **beutifyfunction:** fix error where beautifyFunction was getting less indentations that expected ([28248f1](https://github.com/resourge/schema/commit/28248f139bba73fd0cea2a0717c23429fd83da29))

# [1.3.0](https://github.com/resourge/schema/compare/v1.2.3...v1.3.0) (2022-06-20)


### Bug Fixes

* **baserule:** maintain onlyOnTouch errors in case other keys are changed ([de09f89](https://github.com/resourge/schema/commit/de09f89bf7f8a915182e1249d7a216cd640cc601))


### Features

* **stringschema:** add min length to required string ([77160c1](https://github.com/resourge/schema/commit/77160c11b6fc97d8a258cbaae3154520402811e8))

## [1.2.3](https://github.com/resourge/schema/compare/v1.2.2...v1.2.3) (2022-06-20)


### Bug Fixes

* **baserule:** missing ; after creating const ([eaf52f3](https://github.com/resourge/schema/commit/eaf52f38a7c91228c5b2197c37f24c6aeff54d6e))
* **schema:** fix onlyOnTouch errors not staying after changing other camps ([f447e65](https://github.com/resourge/schema/commit/f447e65b714430efe685abe8403db6ece189ae67))

## [1.2.2](https://github.com/resourge/schema/compare/v1.2.1...v1.2.2) (2022-06-09)


### Bug Fixes

* **schemas:** fix schemas sharing references ([4e42157](https://github.com/resourge/schema/commit/4e4215734f24b4a6254d802eae9878963dca0708))

## [1.2.1](https://github.com/resourge/schema/compare/v1.2.0...v1.2.1) (2022-06-09)


### Bug Fixes

* **objectschema.ts:** fix type not working as intenteded when extending ([1d8c4fc](https://github.com/resourge/schema/commit/1d8c4fc4ff8a3c069173a00cfa22430c7e7ec852))

# [1.2.0](https://github.com/resourge/schema/compare/v1.1.1...v1.2.0) (2022-06-09)


### Features

* **objecttypedschema:** add extend method to ObjectTypeSchema ([b4f449b](https://github.com/resourge/schema/commit/b4f449b1d762ec3b0a72c8f9155db5529785cc63))

## [1.1.1](https://github.com/resourge/schema/compare/v1.1.0...v1.1.1) (2022-06-09)


### Bug Fixes

* **schema:** improve when rule ([8fb7b5c](https://github.com/resourge/schema/commit/8fb7b5c37773d0fe4f7e97a7c21292dba773cbe8))

# [1.1.0](https://github.com/resourge/schema/compare/v1.0.3...v1.1.0) (2022-06-07)


### Bug Fixes

* **beautifyfunction:** improve beautifying function ([645f64e](https://github.com/resourge/schema/commit/645f64e1dc557274a7784ae24f87bad417f19259))
* **validation:** improve extending schemas ([5c460e6](https://github.com/resourge/schema/commit/5c460e6b83124814f65a88015fe63d33126f1b67))


### Features

* **schema:** improve onlyontouch ([5a81845](https://github.com/resourge/schema/commit/5a8184588c7aa9e0b4c88159f455ddf33012c949))
* **shema:** add notOnlyOnTouch to negate onlyOnTouch ([e129154](https://github.com/resourge/schema/commit/e129154ed30baaae726a5f77958016d315444c3b))

## [1.0.3](https://github.com/resourge/schema/compare/v1.0.2...v1.0.3) (2022-06-06)


### Bug Fixes

* **schema:** change schema "when" order of generic types ([6d5a8cb](https://github.com/resourge/schema/commit/6d5a8cb1149aee795acf3cd6a631f853cfbc7bfa))

## [1.0.2](https://github.com/resourge/schema/compare/v1.0.1...v1.0.2) (2022-06-06)


### Bug Fixes

* **asyncrule:** fix AsyncRuleMethodSchemaError type returning false instead of true ([a8acda6](https://github.com/resourge/schema/commit/a8acda614a28344a12c98cc5f43c827c3d8678e6))

## [1.0.1](https://github.com/resourge/schema/compare/v1.0.0...v1.0.1) (2022-06-06)


### Bug Fixes

* **deepreadonly and schemaerrors:** remove deepReadonly and change schemaerrors key to path ([9ca98ce](https://github.com/resourge/schema/commit/9ca98ce97bf6150a8ae1c3e56184aeb4668ab947))

# 1.0.0 (2022-06-06)


### Features

* **package:** first release ([9ad13e0](https://github.com/resourge/schema/commit/9ad13e0abc5baf040c22e758e396341ddfe84bb7))
