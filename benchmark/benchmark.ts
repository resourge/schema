import Benchmark from 'benchmark';
import Validator, { ValidationSchema } from 'fastest-validator';
import { object, array, string } from '../src/lib/index';
import * as yup from 'yup';
import { z } from 'zod';
import joi from 'joi';

const v = new Validator();

// @ts-expect-error
globalThis.__DEV__ = true;

const delivery = {
	deliveryName: 'te',
	products: [
		{
			productName: 'testObject 1'
		}
	]
};

const schemaValidator: ValidationSchema<typeof delivery> = {
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

const joiSchema = joi.object<typeof delivery>({
	deliveryName: joi.string().min(3),
	products: joi.array().items(
		joi.object({
			productName: joi.string().min(3)
		})
	)
});

const schema = object<typeof delivery>({
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
	schema.validate(delivery);
})
.add('Fast Validator', function () {
	check(delivery);
})
.add('joi', function () {
	try {
		joiSchema.validate(delivery, { abortEarly: false });
	}
	catch {}
})
.add('zod', function () {
	try {
		zodSchema.parse(delivery);
	}
	catch {}
})
.add('Yup', function () {
	try {
		yupSchema.validateSync(delivery, { abortEarly: false });
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
.run({ async: false, minSamples: 1000 });