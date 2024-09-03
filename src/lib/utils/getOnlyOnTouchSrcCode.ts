import { Parameters } from './Utils';

export const getOnlyOnTouchSrcCode = (
	path: string,
	srcCode: string[]
) => {
	return [
		`if ( ${Parameters.ONLY_ON_TOUCH}.some((key) => key.includes(\`${path}\`) || \`${path}\`.includes(key)) ){`,
		...srcCode,
		`${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${Parameters.ERRORS_KEY}.filter((error) => error.path === \`${path}\`);`,
		'}',
		`else if ( ${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] ){`,
		`${Parameters.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`].forEach((error) => ${Parameters.ERRORS_KEY}.push(error))`,
		'}'
	];
};
