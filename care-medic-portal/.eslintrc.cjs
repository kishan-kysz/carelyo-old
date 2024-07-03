/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  // plugins: ["@typescript-eslint"],
  extends: ['next/core-web-vitals'],
  rules: {
    // "@typescript-eslint/array-type": "off",
    // "@typescript-eslint/consistent-type-definitions": "off",
    // "@typescript-eslint/prefer-nullish-coalescing": "off",
    // "@typescript-eslint/no-unsafe-member-access" :"off",
    // "@typescript-eslint/no-unsafe-assignment" :"off",
    // "@typescript-eslint/consistent-type-imports": [
    //   "warn",
    //   {
    //     prefer: "type-imports",
    //     fixStyle: "inline-type-imports",
    //   },
    // ],
    // "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
}

module.exports = config
