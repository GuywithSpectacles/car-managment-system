// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
	{
		ignores: ['node_modules'], // Ignore the node_modules directory
	},
	{
		files: ['**/*.js'], // Apply ESLint to JavaScript files
		languageOptions: {
			ecmaVersion: 'latest', // Use the latest ECMAScript standard
			sourceType: 'module', // Enable ES6 modules
		},
		"rules": {
			"comma-dangle": 0,
			"no-console": 0,
			"node/prop-types": 0,
			"import/prefer-default-export": 0,
			"class-methods-use-this": 0,
			"import/no-dynamic-require": 0,
			"global-require": 0,
			"camelcase": 0,
			"consistent-return": 0,
			"no-param-reassign": 0,
			"no-tabs": 0,
			"indent": ["error", "tab"],
			"no-shadow": 0,
			"arrow-body-style": 0
		},
		plugins: {
			prettier: eslintPluginPrettier,
		},
		settings: {
			prettier: {
				singleQuote: true,
				semi: true,
			},
		},
	},
];
