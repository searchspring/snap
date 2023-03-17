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
		'no-debugger': 'error',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		'@typescript-eslint/no-empty-function': 'off'
	},
	settings: {
		"preact": {
			"pragma": "h"
		}
	}
	

};

