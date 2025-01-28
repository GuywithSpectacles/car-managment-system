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
    rules: {
      'no-console': 'warn', // Warn on console.log usage
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables starting with "_"
      'semi': ['error', 'always'], // Enforce semicolons
      'quotes': ['error', 'single'], // Enforce single quotes
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
