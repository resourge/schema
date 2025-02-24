import deepmerge from '@fastify/deepmerge'
import { resolve } from 'path'
import { defineConfig, type UserConfigExport } from 'vite'
import banner from 'vite-plugin-banner'
import { checker } from 'vite-plugin-checker'
import dts from 'vite-plugin-dts'
import viteTsconfigPaths from 'vite-tsconfig-paths'

import PackageJson from '../package.json'

import { createBanner } from './createBanner'
import { packages } from './getPackages'

const {
	dependencies = {}, devDependencies = {}, peerDependencies = {}
} = PackageJson as any;

const globals: Record<string, string> = {
	vue: 'Vue',
	'react/jsx-runtime': 'ReactJsxRuntime',
	react: 'React',
	'react-dom': 'ReactDOM',
	'@resourge/shallow-clone': 'ResourceShallowClone'
}

const globalsKeys = Object.keys(globals);

const external = [
	'react/jsx-runtime',
	...Object.keys(peerDependencies),
	...Object.keys(dependencies),
	...Object.keys(devDependencies)
].filter((key) => key !== 'on-change')

const packagesNames = packages.map((pack) => pack.name);

const entryLib = './src/lib/index.ts';
const POSTAL_CODE_INDEX = './src/lib/postalCodes/index.ts'

const PHONE_NUMBER_INDEX = './src/lib/phoneNumbers/index.ts'

const deepMerge = deepmerge();

export const defineLibConfig = (
	config: UserConfigExport,
	afterBuild?: (() => void | Promise<void>)
): UserConfigExport => defineConfig((originalConfig) => deepMerge(
	typeof config === 'function' ? config(originalConfig) : config,
	{
		test: {
			globals: true,
			setupFiles: './src/setupTests.ts'
		},
		build: {
			minify: false,
			sourcemap: true,
			lib: {
				entry: {
					index: entryLib,
					'postalCodes/index': POSTAL_CODE_INDEX,
					'phoneNumbers/index': PHONE_NUMBER_INDEX
				},
				name: 'index',
				fileName: (module, fileName) => (
					`${fileName}.${module === 'cjs' ? 'cjs' : 'js'}`
				),
				formats: ['cjs', 'es']
			},
			outDir: './dist',
			rollupOptions: {
				output: {
					dir: './dist',
					globals: external.filter((key) => globalsKeys.includes(key))
					.reduce<Record<string, string>>((obj, key) => {
						obj[key] = globals[key];
						return obj
					}, {}),
				},
				external
			}
		},
		resolve: {
			preserveSymlinks: true,
			alias: originalConfig.mode === 'development' ? packages.reduce((obj, { name, path }) => {
				obj[name] = resolve(path, `../${entryLib}`)
				return obj;
			}, {}) : {}
		},
		plugins: [
			banner(createBanner()),
			viteTsconfigPaths(),
			checker({ 
				typescript: true,
				enableBuild: true,
				overlay: {
					initialIsOpen: false
				},
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
				}
			}),
			dts({
				insertTypesEntry: true,

				bundledPackages: packagesNames,
				compilerOptions: {
					preserveSymlinks: true,
					paths: {}
				},
				exclude: [
					'**/*.test*',
					'./src/App.tsx',
					'./old/**/*',
					'./src/main.tsx',
					'./src/setupTests.ts'
				],
				afterBuild
			})
		]
	}
));
