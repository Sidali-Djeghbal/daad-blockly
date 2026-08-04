module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
  },
  rules: {
    'no-undef': 'off',
    'no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'prefer-const': 'warn',
    'no-var': 'off',
    'no-redeclare': 'off',
    'eqeqeq': 'off',
    'no-useless-escape': 'off',
    'indent': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.test.js', 'vitest.config.js'],
      parserOptions: { sourceType: 'module' },
      env: { node: true, es2021: true },
    },
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'tests/setup.js'],
};