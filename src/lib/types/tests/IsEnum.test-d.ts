/* eslint-disable @typescript-eslint/no-unused-vars */
import { type IsEnum } from '../IsEnum';

describe('should isEnum be true', () => {
	enum FieldTypeEnum {
		FREE_TEXT = 1,
		EXISTING_FIELD = 2,
		SQL_EXPRESSION = 3,
		SOURCE_FIELD = 4
	}

	enum FieldTypeEnumS {
		FREE_TEXT = 'FREE_TEXT',
		EXISTING_FIELD = 'EXISTING_FIELD',
		SQL_EXPRESSION = 'SQL_EXPRESSION',
		SOURCE_FIELD = 'SOURCE_FIELD'
	}

	enum FieldTypeEnumF {
		FREE_TEXT = 1,
		EXISTING_FIELD = 2,
		SQL_EXPRESSION = 'SQL_EXPRESSION',
		SOURCE_FIELD = 'SOURCE_FIELD'
	}

	class Teste {
		public asdas: number = 1;
		public fgg: string = '';
	}
	type ExpectTrue<T extends true> = T;
	type ExpectFalse<T extends false> = T;

	it('should be true', () => {
		type Test1 = ExpectTrue<IsEnum<FieldTypeEnum>>;
		type Test2 = ExpectTrue<IsEnum<FieldTypeEnumF>>;
		type Test3 = ExpectTrue<IsEnum<FieldTypeEnumS>>;
	});

	it('should be false', () => {
		type Test1 = ExpectFalse<IsEnum<Teste>>;
		type Test2 = ExpectFalse<IsEnum<Teste | 1>>;
		type Test3 = ExpectFalse<IsEnum<Teste | 1 | 'asdas'> >;
		type Test4 = ExpectFalse<IsEnum<Set<Teste>> >;
		type Test5 = ExpectFalse<IsEnum<Map<string, Teste>> >;
		type Test6 = ExpectFalse<IsEnum<''>>;
		type Test7 = ExpectFalse<IsEnum<1>>;
		type Test8 = ExpectFalse<IsEnum<object>>;
		type Test9 = ExpectFalse<IsEnum<{ test: number }>>;
		type Test10 = ExpectFalse<IsEnum<{ test: string }>>;
		type Test11 = ExpectFalse<IsEnum<[]>>;
		type Test12 = ExpectFalse<IsEnum<[1]>>;
		type Test13 = ExpectFalse<IsEnum<['']>>;
		type Test14 = ExpectFalse<IsEnum<[{ test: number }]>>;
		type Test15 = ExpectFalse<IsEnum<[{ test: string }]>>;
		type Test16 = ExpectFalse<IsEnum<false>>;
		type Test17 = ExpectFalse<IsEnum<true>>;
		type Test18 = ExpectFalse<IsEnum<(() => any)>>;
		type Test19 = ExpectFalse<IsEnum<() => Promise<any>>>;
		type Test20 = ExpectFalse<IsEnum<1 | ''>>;
		type Test21 = ExpectFalse<IsEnum<1 | '3'>>;
		type Test22 = ExpectFalse<IsEnum<'1' | '5'>>;
		type Test23 = ExpectFalse<IsEnum<'1' | boolean> >
	});
});
