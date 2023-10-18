import { Parameters } from './Utils';

export const getOnlyOnTouchSrcCode = (
	path: string,
	srcCode: string[]
) => {
	return [
		`if ( ${Parameters.ONLY_ON_TOUCH}.some((key) => key.includes(\`${path}\`) || \`${path}\`.includes(key)) ){`,
		...srcCode,
		`context.onlyOnTouchErrors[\`${path}\`] = errors.filter((error) => error.path === \`${path}\`);`,
		'}',
		`else if ( context.onlyOnTouchErrors[\`${path}\`] ){`,
		`context.onlyOnTouchErrors[\`${path}\`].forEach((error) => errors.push(error))`,
		'}'
	];
};
