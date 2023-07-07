module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	extends: [
		'plugin:@typescript-eslint/recommended', // uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier', // disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
	],
	ignorePatterns: ["**/docs", "**/dist", "*.test.ts", "*.test.tsx", "webpack.*.js"],
	rules: {
		// add rules... or dont...
		'no-debugger': 'error',
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{'ts-ignore': 'allow-with-description'},
		  ],		
		'@typescript-eslint/no-explicit-any': 'off',

		// todo turn these on
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		
		'@typescript-eslint/no-empty-function': 'error',
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ 
				"varsIgnorePattern": "^(h|jsx)$"
			}
		],
	},
	settings: {
		"preact": {
			"pragma": "h"
		}
	}
};

