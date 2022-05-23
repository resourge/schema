
import { ObjectTypedSchema } from '../core/ObjectTypedSchema';
import { SchemaTypes } from '../core/schema';
import { ObjectShape, Shape, ZodRawShape, ZodTypeAny } from '../types/SchemaObject';
import { objectInputType, objectOutputType, objectUtil } from '../types/types';

export class ObjectSchema<
	T extends ZodRawShape, 
	Output = objectOutputType<T, ZodTypeAny>, 
	Input = objectInputType<T, ZodTypeAny>,
	Final = Input
> extends ObjectTypedSchema<T, Output, Input, Final> {
	public type: SchemaTypes = SchemaTypes.OBJECT
	public message: string = `{{key}} is not ${this.type}`
	protected rule = (value: Input) => typeof value === 'object'

	constructor(schemas: ObjectShape<Input, Final>, message?: string) {
		super(schemas);

		this.message = message ?? this.message;
	}
}

export const object = <
	T extends ZodRawShape,
	Final = objectInputType<T, ZodTypeAny>
>(schemas: T, message?: string): ObjectSchema<
	T, 
	{ 
		[k_1 in keyof objectUtil.addQuestionMarks<{ 
			[k in keyof T]: T[k] extends Shape<any, any> ? T[k]['_output'] : never; 
		}>]: objectUtil.addQuestionMarks<{ 
			[k in keyof T]: T[k] extends Shape<any, any> ? T[k]['_output'] : never; 
		}>[k_1]; 
	}, 
	{ 
		[k_3 in keyof objectUtil.addQuestionMarks<{ 
			[k_2 in keyof T]: T[k_2] extends Shape<any, any> ? T[k_2]['_input'] : never; 
		}>]: objectUtil.addQuestionMarks<{ 
			[k_2 in keyof T]: T[k_2] extends Shape<any, any> ? T[k_2]['_input'] : never; 
		}>[k_3];
	},
	Final
> => {
	return new ObjectSchema<T, Final>(schemas, message) as any;
}
