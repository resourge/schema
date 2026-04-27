import { type Schema } from '../core/schema';

export type CompileSchemaConfig = {
	context: Context
	/**
	 * Serves to make sure the first schema object doesn't need to use the previous path
	 */
	isFirstSchema?: boolean
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	srcCode?: Function
};

export type Context = {
	isAsync?: boolean
};

export type PrivateSchema = Schema<any, any> & { 
	clone: Schema<any, any>['clone']
	compileSchema: Schema<any, any>['compileSchema'] 
};
