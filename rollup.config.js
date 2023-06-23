import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import filsesize from 'rollup-plugin-filesize';

import { name, author, license } from './package.json'

const external = [];
const globals = {}

const babelPlugins = [
	'babel-plugin-dev-expression'
]

const babelPresetEnv = ['@babel/preset-env', { 
	targets: [
		'defaults',
		'not IE 11',
		'chrome > 78', // To remove in the future
		'maintained node versions'
	],
	loose: true,
	bugfixes: true
}]

const jsonPlugin = json({
	preferConst: true
})

const defaultExtPlugin = [
	jsonPlugin,
	filsesize({
		showBeforeSizes: 'build'
	}),
	nodeResolve({
		extensions: ['.tsx', '.ts']

	})
]

function createBanner(libraryName, version, authorName, license) {
	return `/**
 * ${libraryName} v${version}
 *
 * Copyright (c) ${authorName}.
 *
 * This source code is licensed under the ${license} license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license ${license}
 */`;
}
function capitalizeFirstLetter(string) {
	return string.charAt(0)
	.toUpperCase() + string.slice(1);
}

function getName(name) {
	const arr = name.split('/');

	return arr[arr.length - 1];
}

/**
 * Package Json info
 */
const VERSION = process.env.PROJECT_VERSION;
const AUTHOR_NAME = author;
const LICENSE = license;

const getPackage = (
	OUTPUT_DIR,
	SOURCE_FOLDER,
	PACKAGE_NAME
) => {
	const SOURCE_INDEX_FILE = `${SOURCE_FOLDER}/index.ts`
	const PROJECT_NAME = getName(PACKAGE_NAME);

	/**
	 * Folders
	 */
	const CJS_DIR = `${OUTPUT_DIR}/cjs`;
	const UMD_DIR = `${OUTPUT_DIR}/umd`;
	/**
	 * Options
	 */
	const sourcemap = true;
	const banner = createBanner(PROJECT_NAME, VERSION, AUTHOR_NAME, LICENSE);
	const umdName = PROJECT_NAME.split('-')
	.map(capitalizeFirstLetter)
	.join('')

	const POSTAL_CODE_INDEX = `${SOURCE_FOLDER}/postalCodes/index.ts`

	const PHONE_NUMBER_INDEX = `${SOURCE_FOLDER}/phoneNumbers/index.ts`

	// JS modules for bundlers
	const modules = [
		{
			input: {
				index: SOURCE_INDEX_FILE,
				'postalCodes/index': POSTAL_CODE_INDEX,
				'phoneNumbers/index': PHONE_NUMBER_INDEX
			},
			output: {
				dir: OUTPUT_DIR,
				format: 'esm',
				sourcemap,
				banner
			},
			external,
			plugins: [
				replace({
					preventAssignment: true,
					delimiters: ['\\b', '\\b(?!\\.)'],
					values: {
						postalCodes: 'schemas',
						phoneNumbers: 'phoneNumbers'
					}
				}),
				...defaultExtPlugin,
				babel({
					exclude: /node_modules/,
					babelHelpers: 'bundled',
					presets: [
						babelPresetEnv,
						['@babel/preset-react', {
							useBuiltIns: true
						}],
						'@babel/preset-typescript'
					],
					plugins: babelPlugins,
					extensions: ['.ts', '.tsx']
				})
			]
		},
		{
			input: {
				index: SOURCE_INDEX_FILE,
				'postalCodes/index': POSTAL_CODE_INDEX,
				'phoneNumbers/index': PHONE_NUMBER_INDEX
			},
			output: {
				dir: OUTPUT_DIR,
				format: 'esm',
				banner
			},
			plugins: [
				jsonPlugin,
				dts()
			]
		}
	];

	// JS modules for <script type=module>
	const cjsModules = [
		{
			input: SOURCE_INDEX_FILE,
			output: {
				file: `${CJS_DIR}/${PROJECT_NAME}.development.js`,
				format: 'cjs',
				sourcemap,
				banner
			},
			external,
			plugins: [
				...defaultExtPlugin,
				babel({
					exclude: /node_modules/,
					babelHelpers: 'bundled',
					presets: [
						['@babel/preset-react', {
							useBuiltIns: true
						}],
						'@babel/preset-typescript',
						babelPresetEnv
					],
					plugins: babelPlugins,
					extensions: ['.ts', '.tsx']
				}),
				replace({
					preventAssignment: true,
					'process.env.NODE_ENV': JSON.stringify('development')
				})
			]
		},
		{
			
			input: SOURCE_INDEX_FILE,
			output: {
				file: `${CJS_DIR}/${PROJECT_NAME}.production.min.js`,
				format: 'cjs',
				sourcemap,
				banner
			},
			external,
			plugins: [
				...defaultExtPlugin,
				babel({
					exclude: /node_modules/,
					babelHelpers: 'bundled',
					presets: [
						babelPresetEnv,
						['@babel/preset-react', {
							useBuiltIns: true
						}],
						'@babel/preset-typescript'
					],
					plugins: babelPlugins,
					extensions: ['.ts', '.tsx']
				}),
				replace({
					preventAssignment: true,
					'process.env.NODE_ENV': JSON.stringify('production')
				}),
				terser({
					ecma: 8,
					safari10: true 
				})
			]
		}
	];

	// UMD modules for <script> tags and CommonJS (node)
	const umdModules = [
		{
			input: SOURCE_INDEX_FILE,
			output: {
				file: `${UMD_DIR}/${PROJECT_NAME}.development.js`,
				format: 'umd',
				sourcemap,
				banner,
				globals,
				name: umdName
			},
			external,
			plugins: [
				...defaultExtPlugin,
				babel({
					exclude: /node_modules/,
					babelHelpers: 'bundled',
					presets: [
						babelPresetEnv,
						['@babel/preset-react', {
							useBuiltIns: true
						}],
						'@babel/preset-typescript'
					],
					plugins: babelPlugins,
					extensions: ['.ts', '.tsx']
				}),
				replace({
					preventAssignment: true,
					'process.env.NODE_ENV': JSON.stringify('development')
				})
			]
		},
		{
			input: SOURCE_INDEX_FILE,
			output: {
				file: `${UMD_DIR}/${PROJECT_NAME}.production.min.js`,
				format: 'umd',
				sourcemap,
				banner,
				globals,
				name: umdName
			},
			external,
			plugins: [
				...defaultExtPlugin,
				babel({
					exclude: /node_modules/,
					babelHelpers: 'bundled',
					presets: [
						babelPresetEnv,
						['@babel/preset-react', {
							useBuiltIns: true
						}],
						'@babel/preset-typescript'
					],
					plugins: babelPlugins,
					extensions: ['.ts', '.tsx']
				}),
				replace({
					preventAssignment: true,
					'process.env.NODE_ENV': JSON.stringify('production')
				}),
				terser()
			]
		}
	];

	const mainModule = [
		{
			input: './main.js',
			output: {
				file: `${OUTPUT_DIR}/main.js`,
				format: 'cjs',
				banner
			},
			plugins: [
				...defaultExtPlugin,
				replace({
					preventAssignment: true,
					devFile: `${UMD_DIR}/${PROJECT_NAME}.development.js`.replace(OUTPUT_DIR, '.'),
					prodFile: `${UMD_DIR}/${PROJECT_NAME}.production.min.js`.replace(OUTPUT_DIR, '.')
				})
			]
		}
	];

	return [...modules, ...cjsModules, ...umdModules, ...mainModule];
}

export default function rollup() {
	return [
		...getPackage(
			'./dist',
			'./src/lib',
			name
		)
	];
}
