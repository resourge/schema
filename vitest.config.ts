import { defineConfig } from 'vitest/config';
import { GithubReporter } from 'vitest-github-action';

export default defineConfig({
	test: {
		include: ['**\/src/lib/**/*.{test,spec}?(-d).?(c|m)[jt]s?(x)'],
		coverage: {
			provider: 'istanbul',

			exclude: [
				'**\/node_modules/**', '**\/dist/**', '**\/cypress/**', 
				'**\/.{idea,git,cache,output,temp}/**', 
				'**\/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*', 
				'**\/old/**/*',
				'**\/benchmark/**/*',
				'**\/scripts/**/*',
				'**\/config/**/*',
				'**\/.*',
				'**\/src/App.tsx',
				'**\/src/main.tsx',
				'**\/src/examples/*',
			]
		},
		typecheck: {
			enabled: true,
		},
		reporters: process.env.GITHUB_ACTIONS
			? ['default', new GithubReporter()]
			: 'default'
	}	
})
