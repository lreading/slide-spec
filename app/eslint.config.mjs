import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const typeCheckedParserOptions = {
  projectService: true,
  tsconfigRootDir: import.meta.dirname,
}

export default tseslint.config(
  {
    ignores: ['coverage/**', 'dist/**'],
  },
  {
    files: [
      'e2e/**/*.ts',
      'playwright.config.ts',
      'playwright.visual.config.ts',
      'playwright.demo.config.ts',
      'playwright.readme-gif.config.ts',
    ],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: typeCheckedParserOptions,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    ignores: [
      'e2e/**/*.ts',
      'playwright.config.ts',
      'playwright.visual.config.ts',
      'playwright.demo.config.ts',
      'playwright.readme-gif.config.ts',
    ],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: typeCheckedParserOptions,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    extends: [...pluginVue.configs['flat/essential'], ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: vueParser,
      parserOptions: {
        ...typeCheckedParserOptions,
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
)
