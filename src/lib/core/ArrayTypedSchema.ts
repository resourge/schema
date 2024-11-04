import { type ValidationContext } from '../rules/BaseRule';
import { type ObjectPropertiesSchema } from '../types/SchemaMap';
import { type CompileSchemaConfig, type PrivateSchema } from '../types/SchemaTypes';

import { type Definitions } from './Definitions';
import { Schema } from './schema';

export abstract class ArrayTypedSchema<
	Input extends any[] = any[],
	Final = any,
	S extends ObjectPropertiesSchema<Input[number], Final> = ObjectPropertiesSchema<Input[number], Final>
> extends Schema<Input, Final> {
	protected schema: PrivateSchema;

	constructor(schema: S, message?: string, def?: Definitions) {
		super(message, def);
		this.schema = schema as unknown as PrivateSchema;
	}

	protected override compileSchema({ context }: CompileSchemaConfig) {
		const fns = this.schema.compileSchema({
			context 
		});

		return super.compileSchema({
			context, 
			srcCode: (value: any, parent: any, path: string, validationContext: ValidationContext<Final>) => {
				const len = value.length;
				const basePath = path + '[';
				for (let x = 0; x < len; x++) {
					fns(value[x], parent, basePath + x + ']', validationContext);
				}
			} 
		});
	}
}
