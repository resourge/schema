import { PARAMETERS } from './Utils';

export const getOnlyOnTouchSrcCode = (
	path: string,
	srcCode: string[]
) => {
	return [
		`if ( ${PARAMETERS.ONLY_ON_TOUCH}.some((key) => key.includes(\`${path}\`) || \`${path}\`.includes(key)) ){`,
		...srcCode,
		`${PARAMETERS.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] = ${PARAMETERS.ERRORS_KEY}.filter((error) => error.path === \`${path}\`);`,
		'}',
		`else if ( ${PARAMETERS.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`] ){`,
		`${PARAMETERS.CONTEXT_KEY}.onlyOnTouchErrors[\`${path}\`].forEach((error) => ${PARAMETERS.ERRORS_KEY}.push(error))`,
		'}'
	];
};
