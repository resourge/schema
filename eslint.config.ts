import reactConfig from 'eslint-config-resourge/react';

import { defineConfig } from 'eslint/config';

export default defineConfig([
	...reactConfig,
	{
		rules: {
			'@stylistic/operator-linebreak': ['error', 'before', {
				overrides: {
					'=': 'after' 
				} 
			}],
			'perfectionist/sort-imports': [
				'error',
				{
					customGroups: [                      
						{                                
							elementNamePattern: {
								pattern: 'react+(|-native)'
							},
							groupName: 'react',
							order: 'asc'
						}                            
					],
					fallbackSort: {
						order: 'asc',
						type: 'natural' 
					},
					groups: [
						'react',
						['value-builtin', 'type-builtin', 'value-external', 'type-external'],
						['value-internal', 'type-internal'],
						['value-parent', 'type-parent'],
						['value-sibling', 'type-sibling'], 
						['value-index', 'type-index']
					],
					ignoreCase: false,
					internalPattern: ['^~/.+', '^@/.+', '^#.+', '^src/.+'],
					newlinesBetween: 1,
					order: 'asc',
					type: 'alphabetical'
				}
			],

			'perfectionist/sort-modules': [
				'error',
				{
					groups: [
						'declare-enum',
						'export-enum',
						'enum',
						['interface', 'type'],
						['declare-interface', 'declare-type'],
						['export-interface', 'export-type'],
						'declare-function',
						'export-function',
						'function',
						'declare-class',
						'export-class',
						'class'
					],
					newlinesBetween: 1,
					newlinesInside: 1,
					order: 'asc',
					type: 'alphabetical'
				}
			],
			'unicorn/no-null': 'off',
			'unicorn/no-thenable': 'off',

			'unicorn/no-useless-undefined': 'off'
			
		}
	}
]);
