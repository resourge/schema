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
	test: 'te',
	object: [
		{
			productName: 'testObject 1'
		}
	]
};

const schemaValidator: ValidationSchema<typeof test> = {
	test: { type: 'string', min: 3 },
	object: {
		$$type: 'array',
		items: {
			testObject: { type: 'string', min: 3 }
		}
	}
};

const check = v.compile(schemaValidator);

const yupSchema = yup.object().shape({
	test: yup.string().min(3),
	object: yup.array().of(
		yup.object().shape({
			testObject: yup.string().min(3)
		})
	)
});

const zodSchema = z.object({
	test: z.string().min(3),
	object: z.array(
		z.object({
			testObject: z.string().min(3)
		})
	)
});

const joiSchema = joi.object<typeof test>({
	test: joi.string().min(3),
	object: joi.array().items(
		joi.object({
			testObject: joi.string().min(3)
		})
	)
});

const schema = object<typeof test>({
	test: string().min(3).required(),
	object: array(
		object({
			productName: string().min(3).required()
		}).required()
	).required()
}).compile();

const suite = new Benchmark.Suite();
suite
.add('schema', function () {
	schema.validate(test);
})
.add('Fast Validator', function () {
	check(test);
})
.add('joi', function () {
	try {
		joiSchema.validate(test);
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

/*
const test4 = new Map()

Array.from({ length: 100 }).forEach((_, index) => { 
	test4.set(`test_${index}`, index)
})

const test3 = Array.from({ length: 100 }).reduce((obj, _, index) => { 
	// @ts-expect-error
	obj[`test_${index}`] = index;
	
	return obj;
}, {})

const suite = new Benchmark.Suite();
suite
.add('RegExp#test', function() {
	Array.from(test4)
	.forEach(([k, schema]) => {
		const a = schema
	})
})
.add('String#indexOf', function() {
	// @ts-expect-error
	Object.keys(test3)
	.forEach((key: string) => {
	// @ts-expect-error
		const a = test3[key]
	})
})
.on('cycle', function(event: any) {
	console.log(String(event.target));
})
.on('complete', function() {
	// @ts-expect-error
	console.log('Fastest is ', this.filter('fastest').map('name'));
})
// run async
.run({ async: true });

*/
