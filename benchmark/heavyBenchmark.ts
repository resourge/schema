declare module '../src/lib/core/schema' {
	export const __DEV__: boolean;
}

import Benchmark from 'benchmark';
import Validator, { ValidationSchema } from 'fastest-validator';
import { object, array, string } from '../src/lib/index';
import * as yup from 'yup';
import { z } from 'zod';
import joi from 'joi';

const v = new Validator();

// @ts-expect-error
globalThis.__DEV__ = true;

const test = {
	deliveryName: 'tes',
	products: Array.from({ length: 10000 }).map((_, index) => ({
		productName: index
	}))
};

type Test = {
	deliveryName: string
	products: Array<{
		productName: string
	}>
}

const schemaValidator: ValidationSchema<typeof test> = {
	deliveryName: { type: 'string', min: 3 },
	products: {
		type: 'array',
		items: {
			type: "object", 
			props: {
				productName: { type: 'string', min: 3 }
			}
		}
	}
};

const check = v.compile(schemaValidator);

const yupSchema = yup.object().shape({
	deliveryName: yup.string().min(3),
	products: yup.array().of(
		yup.object().shape({
			productName: yup.string().min(3)
		})
	)
});

const zodSchema = z.object({
	deliveryName: z.string().min(3),
	products: z.array(
		z.object({
			productName: z.string().min(3)
		})
	)
});

const joiSchema = joi.object<Test>({
	deliveryName: joi.string().min(3),
	products: joi.array().items(
		joi.object({
			productName: joi.string().min(3)
		})
	)
});

const schema = object<Test>({
	deliveryName: string().min(3).required(),
	products: array(
		object({
			productName: string().min(3).required()
		}).required()
	).required()
}).compile();

const suite = new Benchmark.Suite();
suite
.add('@resourge/schema', function () {
	schema.validate(test as any);
})
.add('Fast Validator', function () {
	check(test);
})
.add('joi', function () {
	try {
		joiSchema.validate(test, { abortEarly: false });
	}
	catch {}
})
.add('zod', function () {
	try {
		zodSchema.parse(test);
	}
	catch {}
})
.add('Yup', function () {
	try {
		yupSchema.validateSync(test, { abortEarly: false });
	}
	catch {}
})
.on('cycle', function (event: any) {
	console.log(String(event.target));
})
.on('complete', function () {
	// @ts-expect-error
	console.log('Fastest is ', this.filter('fastest').map('name'));
})
// run async
.run({ async: false });