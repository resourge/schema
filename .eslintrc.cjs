module.exports = {
	extends: ['resourge/react'],
	rules: {
		'resourge-custom-react/no-index': 'off',
		'resourge-custom-react/folder-file-convention': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off'
	},
	ignorePatterns: ['src/examples/**/*']
};
