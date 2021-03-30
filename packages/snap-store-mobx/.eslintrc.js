module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module',
	},
	extends: [
		'plugin:@typescript-eslint/recommended', // uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier', // disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
	],
	rules: {
		// add rules... or dont...
	},
};
