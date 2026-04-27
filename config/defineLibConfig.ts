import deepmerge from '@fastify/deepmerge';
import { defineConfig, type UserConfigExport } from 'vite';
import banner from 'vite-plugin-banner';
import dts from 'vite-plugin-dts';

import PackageJson from '../package.json';

import { createBanner } from './createBanner';
import { packages } from './getPackages';

const {
	dependencies = {}, devDependencies = {}, peerDependencies = {}
} = PackageJson as any;

const globals: Record<string, string> = {
	'@resourge/shallow-clone': 'ResourceShallowClone',
	'react': 'React',
	'react-dom': 'ReactDOM',
	'react/jsx-runtime': 'ReactJsxRuntime',
	'vue': 'Vue'
};

const globalsKeys = Object.keys(globals);

const external = [
	'react/jsx-runtime',
	...Object.keys(peerDependencies),
	...Object.keys(dependencies),
	...Object.keys(devDependencies)
].filter((key) => key !== 'on-change');

const packagesNames = packages.map((pack) => pack.name);

const entryLibrary = './src/lib/index.ts';
const POSTAL_CODE_INDEX = './src/lib/postalCodes/index.ts';

const PHONE_NUMBER_INDEX = './src/lib/phoneNumbers/index.ts';

const deepMerge = deepmerge();

export const defineLibConfig = (
	config: UserConfigExport,
	afterBuild?: (() => Promise<void> | void)
): UserConfigExport => defineConfig((originalConfig) => deepMerge(
	typeof config === 'function'
		? config(originalConfig)
		: config,
	{
		build: {
			lib: {
				entry: {
					'index': entryLibrary,
					'phoneNumbers/index': PHONE_NUMBER_INDEX,
					'postalCodes/index': POSTAL_CODE_INDEX
				},
				fileName: (module, fileName) => (
					`${fileName}.${module === 'cjs'
						? 'cjs'
						: 'js'}`
				),
				formats: ['cjs', 'es'],
				name: 'index'
			},
			minify: false,
			outDir: './dist',
			rollupOptions: {
				external,
				output: {
					dir: './dist',
					globals: external.filter((key) => globalsKeys.includes(key))
					.reduce<Record<string, string>>((object, key) => {
						object[key] = globals[key];
						return object;
					}, {})
				}
			},
			sourcemap: true
		},
		plugins: [
			banner(createBanner()),
			dts({
				afterBuild,

				bundledPackages: packagesNames,
				compilerOptions: {
					baseUrl: '.',
					paths: {},
					preserveSymlinks: true
				},
				exclude: [
					'**/*.test*',
					'./src/App.tsx',
					'./old/**/*',
					'./src/main.tsx',
					'./src/setupTests.ts'
				],
				insertTypesEntry: true
			})
		],
		resolve: {
			preserveSymlinks: true,
			tsconfigPaths: true
		}
	}
));
