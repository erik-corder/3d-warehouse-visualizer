// ESLint config per .skillbase/artifacts/standards/engineering-standards-sources.md:
// eslint:recommended, @typescript-eslint/recommended, eslint-plugin-import,
// eslint-plugin-simple-import-sort, eslint-plugin-jsx-a11y, eslint-plugin-prettier.
// Next.js-specific rules (eslint-plugin-next, core-web-vitals) are deliberately
// excluded per that source's own instruction — this project is Electron + React,
// not Next.js.
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  ignorePatterns: ['out/', 'node_modules/', 'dist/'],
};
