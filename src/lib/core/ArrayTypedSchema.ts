import { PrivateSchema } from './ObjectTypedSchema';
import { CompileSchemaConfig, RuleFn, Schema, SchemaTypes } from './schema';

export class ArrayTypedSchema<
	Input, 
	Shape extends Schema = Schema
> extends Schema<Input> {
	readonly _shape!: Shape;
	protected schema: PrivateSchema

	public type: SchemaTypes = SchemaTypes.ARRAY
	public message: string = `{{key}} is not ${this.type}`
	protected rule: RuleFn<Input, '', Input> = (value: Input) => Array.isArray(value)

	constructor(schema: Shape) {
		super();
		this.schema = schema as unknown as PrivateSchema
	}

	protected override compileSchema({
		context, 
		index, 
		key, 
		path
	}: CompileSchemaConfig) {
		const valueKey = this.getValueKey(key)

		const iKey = `i${index}`;

		const schemaRules = this.schema.compileSchema({
			context, 
			index: index + 1, 
			key: `${key ?? ''}[${iKey}]`, 
			path: `${path ?? ''}['+ ${iKey} +']`
		});

		const arraySchemaRules = [
			`for (let ${iKey} = 0; ${iKey} < ${valueKey}.length; ${iKey}++) {`,
			...schemaRules,
			'}'
		]

		return super.compileSchema({
			context, 
			index, 
			key, 
			srcCode: arraySchemaRules, 
			path
		});
	}
}
