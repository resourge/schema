/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type Schema } from '../core/schema';

export type PrivateSchema = Schema<any, any> & { compileSchema: Schema<any, any>['compileSchema'] };

export type Context = {
	isAsync?: boolean
};

export type CompileSchemaConfig = {
	context: Context
	/**
	 * Serves to make sure the first schema object doesn't need to use the previous path
	 */
	isFirstSchema?: boolean
	srcCode?: Function
};
