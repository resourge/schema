import {
	beforeEach,
	describe,
	expect,
	it
} from 'vitest';

import { type Context } from 'src/lib/types/SchemaTypes';
import { type SchemaError } from 'src/lib/types/types';

import { type ValidationContext } from '../BaseRule';
import { getRule, type RuleConfig } from '../Rule';

describe('getRule', () => {
	const context: Context = {
		isAsync: false
	};

	const validationContext: ValidationContext<any> = {
		context: {
			errors: [],
			onlyOnTouch: [],
			onlyOnTouchErrors: {},
			promises: []
		},
		form: {},
		path: 'some/path',
		parent: {}
	};

	beforeEach(() => {
		validationContext.context.errors = [];
		validationContext.context.promises = [];
	});

	it('should handle synchronous boolean rule method', () => {
		const config: RuleConfig = {
			isAsync: false,
			isCustomTestThatReturnsArray: false,
			method: (value) => value === 'invalid', // custom synchronous rule method
			message: 'Invalid value',
			type: 'Rule'
		};

		const rule = getRule(config, context);

		rule('invalid', validationContext); // Should add an error to the context
		expect(validationContext.context.errors.length).toBe(1);
		expect(validationContext.context.errors[0].error).toBe('Invalid value');
    
		rule('valid', validationContext); // Should not add an error
		expect(validationContext.context.errors.length).toBe(1);
	});

	it('should handle asynchronous boolean rule method', async () => {
		const config: RuleConfig = {
			isAsync: true,
			isCustomTestThatReturnsArray: false,
			method: () => Promise.resolve(false), // async rule method returning true
			message: 'Async validation failed',
			type: 'Rule'
		};

		const rule = getRule(config, context);

		// eslint-disable-next-line @typescript-eslint/await-thenable
		await rule('value', validationContext);

		await Promise.all(validationContext.context.promises);

		validationContext.context.promises = [];
		
		expect(validationContext.context.errors.length).toBe(0); // No error because the rule passed

		config.method = () => Promise.resolve(true); // Async method returning false

		// eslint-disable-next-line @typescript-eslint/await-thenable
		await rule('value', validationContext);
		await Promise.all(validationContext.context.promises);

		expect(validationContext.context.errors.length).toBe(1); // Should add an error
		expect(validationContext.context.errors[0].error).toBe('Async validation failed');
	});

	it('should handle custom test that returns array of errors', () => {
		const customErrors: SchemaError[] = [{
			path: 'some/path',
			error: 'Custom error' 
		}];
    
		const config: RuleConfig = {
			isAsync: false,
			isCustomTestThatReturnsArray: true,
			method: () => customErrors, // custom method returning an array of errors
			type: 'Rule'
		};

		const rule = getRule(config, context);

		rule('value', validationContext);
		expect(validationContext.context.errors.length).toBe(1); // One error should be added
		expect(validationContext.context.errors[0].error).toBe('Custom error' );
	});

	it('should handle async custom test that returns array of errors', async () => {
		const customErrors: SchemaError[] = [{
			path: 'some/path',
			error: 'Async custom error' 
		}];
    
		const config: RuleConfig = {
			isAsync: true,
			isCustomTestThatReturnsArray: true,
			method: () => Promise.resolve(customErrors), // async method returning array of errors
			type: 'Rule'
		};

		const rule = getRule(config, context);

		// eslint-disable-next-line @typescript-eslint/await-thenable
		await rule('value', validationContext);

		await Promise.all(validationContext.context.promises);

		expect(validationContext.context.errors.length).toBe(1); // One error should be added
		expect(validationContext.context.errors[0].error).toBe('Async custom error' );
	});
});
